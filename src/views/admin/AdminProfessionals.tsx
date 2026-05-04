import { useEffect, useState, useRef } from 'react';
import { Professional, WorkingHourBlock, WeekDay } from '@/types';
import {
  getProfessionals,
  createProfessional,
  updateProfessional,
  updateProfessionalWorkingHours,
  deactivateProfessional,
  reactivateProfessional,
} from '@/services/professionalService';
import {
  Loader2,
  Plus,
  Pencil,
  Power,
  Clock,
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { formatWorkingHours } from '@/utils';
import {
  getFieldErrorsFromUnknown,
  collapseFieldErrors,
  showValidationToast,
  showApiErrorToast,
} from '@/utils/apiErrors';

const WEEKDAYS: { id: WeekDay; label: string }[] = [
  { id: 'MONDAY', label: 'Segunda' },
  { id: 'TUESDAY', label: 'Terça' },
  { id: 'WEDNESDAY', label: 'Quarta' },
  { id: 'THURSDAY', label: 'Quinta' },
  { id: 'FRIDAY', label: 'Sexta' },
  { id: 'SATURDAY', label: 'Sábado' },
  { id: 'SUNDAY', label: 'Domingo' },
];

interface FormState {
  id?: string;
  name: string;
  email: string;
  phone: string;
  specialties: string;
  avatarUrl: string;
  workingHours: WorkingHourBlock[];
}

const empty: FormState = {
  name: '',
  email: '',
  phone: '',
  specialties: '',
  avatarUrl: '',
  // Agora já inicia com um bloco para facilitar a criação
  workingHours: [{ weekDay: 'MONDAY', startTime: '09:00', endTime: '18:00' }],
};

export default function AdminProfessionals() {
  const [items, setItems] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<FormState | null>(null);
  const [hoursTarget, setHoursTarget] = useState<{
    id: string;
    name: string;
    workingHours: WorkingHourBlock[];
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = 'Profissionais | Studio Neo';
  }, []);

  const refresh = () => {
    setLoading(true);
    setError('');
    getProfessionals()
      .then(setItems)
      .catch((e) => setError(e?.message || 'Erro ao carregar profissionais'))
      .finally(() => setLoading(false));
  };

  useEffect(refresh, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editing) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditing({ ...editing, avatarUrl: reader.result as string });
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next.avatarUrl;
          return next;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Funções para manipular horários dentro do formulário de criação/edição
  const addEditingBlock = () => {
    if (!editing) return;
    setEditing({
      ...editing,
      workingHours: [
        ...editing.workingHours,
        { weekDay: 'MONDAY', startTime: '09:00', endTime: '18:00' },
      ],
    });
  };

  const updateEditingBlock = (i: number, patch: Partial<WorkingHourBlock>) => {
    if (!editing) return;
    const wh = editing.workingHours.map((b, idx) => (idx === i ? { ...b, ...patch } : b));
    setEditing({ ...editing, workingHours: wh });
  };

  const removeEditingBlock = (i: number) => {
    if (!editing) return;
    setEditing({
      ...editing,
      workingHours: editing.workingHours.filter((_, idx) => idx !== i),
    });
  };

  const save = async () => {
    if (!editing) return;
    setFieldErrors({});
    try {
      const phoneDigits = editing.phone.replace(/\D/g, '');
      const payload = {
        name: editing.name.trim(),
        email: editing.email.trim() || undefined,
        phone: phoneDigits.length ? phoneDigits : undefined,
        avatarUrl: editing.avatarUrl.trim() || undefined,
        specialties: editing.specialties
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        workingHours: editing.workingHours,
      };

      if (editing.id) {
        await updateProfessional(editing.id, payload);
        await updateProfessionalWorkingHours(editing.id, editing.workingHours);
      } else {
        await createProfessional(payload);
      }

      setEditing(null);
      refresh();
    } catch (e: unknown) {
      const details = getFieldErrorsFromUnknown(e);
      if (details && Object.keys(details).length > 0) {
        setFieldErrors(collapseFieldErrors(details));
        showValidationToast('Não foi possível salvar o profissional', details);
      } else {
        showApiErrorToast(e, 'Não foi possível salvar o profissional');
      }
    }
  };

  // Funções do Modal de Horários rápido (Lista principal)
  const saveHours = async () => {
    if (!hoursTarget) return;
    try {
      await updateProfessionalWorkingHours(hoursTarget.id, hoursTarget.workingHours);
      setHoursTarget(null);
      refresh();
    } catch (e: unknown) {
      showApiErrorToast(e, 'Não foi possível salvar os horários');
    }
  };

  const updateTargetBlock = (i: number, patch: Partial<WorkingHourBlock>) => {
    if (!hoursTarget) return;
    const wh = hoursTarget.workingHours.map((b, idx) => (idx === i ? { ...b, ...patch } : b));
    setHoursTarget({ ...hoursTarget, workingHours: wh });
  };

  const toggleActive = async (p: Professional) => {
    try {
      if (p.isActive === false) await reactivateProfessional(p.id);
      else await deactivateProfessional(p.id);
      refresh();
    } catch (e: unknown) {
      showApiErrorToast(e, 'Não foi possível alterar o status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-display font-bold">Profissionais</h1>
        <button
          onClick={() => {
            setFieldErrors({});
            setEditing({ ...empty });
          }}
          className="btn-gold !py-2 !text-sm inline-flex items-center gap-2"
        >
          <Plus size={14} /> Novo profissional
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-gold" />
        </div>
      ) : error ? (
        <p className="text-destructive text-center py-12">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-border rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden border border-border flex-shrink-0">
                  {p.avatarUrl ? (
                    <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ImageIcon size={20} />
                    </div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold truncate">{p.name}</p>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${p.isActive === false ? 'bg-muted text-muted-foreground' : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'}`}
                  >
                    {p.isActive === false ? 'INATIVO' : 'ATIVO'}
                  </span>
                </div>
              </div>

              <div className="space-y-1 mb-4">
                <p className="text-xs text-muted-foreground truncate">{p.email || 'Sem e-mail'}</p>
                <div className="flex flex-wrap gap-1">
                  {(p.specialties || []).map((s) => (
                    <span
                      key={s}
                      className="text-[9px] px-2 py-0.5 rounded-full bg-gold/10 text-gold-dark border border-gold/20"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFieldErrors({});
                    setEditing({
                      id: p.id,
                      name: p.name,
                      email: p.email || '',
                      phone: p.phone || '',
                      specialties: (p.specialties || []).join(', '),
                      avatarUrl: p.avatarUrl || '',
                      workingHours: p.workingHours || [],
                    });
                  }}
                  className="flex-1 px-2 py-1.5 text-xs rounded-lg border hover:bg-muted inline-flex items-center justify-center gap-1"
                >
                  <Pencil size={12} /> Editar
                </button>
                <button
                  onClick={() =>
                    setHoursTarget({
                      id: p.id,
                      name: p.name,
                      workingHours: p.workingHours || [],
                    })
                  }
                  className="flex-1 px-2 py-1.5 text-xs rounded-lg border hover:bg-muted inline-flex items-center justify-center gap-1"
                >
                  <Clock size={12} /> Horários
                </button>
                <button
                  onClick={() => toggleActive(p)}
                  className={`px-2 py-1.5 text-xs rounded-lg border transition-colors ${p.isActive === false ? 'text-emerald-600 hover:bg-emerald-50' : 'text-destructive hover:bg-destructive/5'}`}
                >
                  <Power size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <Modal
          onClose={() => {
            setFieldErrors({});
            setEditing(null);
          }}
          title={editing.id ? 'Editar profissional' : 'Novo profissional'}
        >
          <div className="space-y-4 max-h-[80vh] overflow-y-auto px-1 custom-scroll">
            <div className="flex justify-center mb-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-gold transition-colors relative overflow-hidden bg-muted/30"
              >
                {editing.avatarUrl ? (
                  <img src={editing.avatarUrl} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload size={20} className="text-muted-foreground mb-1" />
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">
                      Foto *
                    </span>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              {fieldErrors.avatarUrl && (
                <p className="text-xs text-destructive text-center mt-2">{fieldErrors.avatarUrl}</p>
              )}
            </div>

            <Field label="Nome completo" error={fieldErrors.name}>
              <input
                className="inp"
                value={editing.name}
                onChange={(e) => {
                  setFieldErrors((p) => {
                    const n = { ...p };
                    delete n.name;
                    return n;
                  });
                  setEditing({ ...editing, name: e.target.value });
                }}
                placeholder="Ex: João Silva"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="E-mail *" error={fieldErrors.email}>
                <input
                  type="email"
                  className="inp"
                  value={editing.email}
                  onChange={(e) => {
                    setFieldErrors((p) => {
                      const n = { ...p };
                      delete n.email;
                      return n;
                    });
                    setEditing({ ...editing, email: e.target.value });
                  }}
                  placeholder="joao@exemplo.com"
                />
              </Field>
              <Field label="Telefone (celular) *" error={fieldErrors.phone}>
                <input
                  className="inp"
                  value={editing.phone}
                  onChange={(e) => {
                    setFieldErrors((p) => {
                      const n = { ...p };
                      delete n.phone;
                      return n;
                    });
                    setEditing({ ...editing, phone: e.target.value });
                  }}
                  placeholder="(11) 99999-9999"
                />
              </Field>
            </div>

            <Field label="Especialidades (separadas por vírgula)" error={fieldErrors.specialties}>
              <input
                className="inp"
                value={editing.specialties}
                onChange={(e) => {
                  setFieldErrors((p) => {
                    const n = { ...p };
                    delete n.specialties;
                    return n;
                  });
                  setEditing({ ...editing, specialties: e.target.value });
                }}
                placeholder="Cabelo, Barba, Coloração"
              />
            </Field>

            {/* SEÇÃO DE HORÁRIOS DENTRO DO CRIAR/EDITAR */}
            {/* SEÇÃO DE HORÁRIOS DENTRO DO CRIAR/EDITAR */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Horários de Atendimento
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setFieldErrors((p) => {
                      const n = { ...p };
                      delete n.workingHours;
                      return n;
                    });
                    addEditingBlock();
                  }}
                  className="text-[10px] bg-gold/10 text-gold-dark px-2 py-1 rounded border border-gold/20 hover:bg-gold/20 transition-colors font-bold"
                >
                  + ADICIONAR DIA
                </button>
              </div>
              {fieldErrors.workingHours && (
                <p className="text-xs text-destructive mb-2">{fieldErrors.workingHours}</p>
              )}

              <div className="space-y-3">
                {editing.workingHours.map((b, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 bg-muted/30 p-3 rounded-xl border border-border/50"
                  >
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full">
                      {/* Campo do Dia da Semana */}
                      <div className="flex-1 w-full sm:w-auto">
                        <select
                          className="w-full bg-background border border-input rounded-md px-2 py-1.5 text-sm font-medium focus:ring-1 focus:ring-gold outline-none appearance-none cursor-pointer"
                          style={{
                            backgroundImage:
                              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E\")",
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.5rem center',
                            backgroundSize: '1.2em',
                            paddingRight: '2rem',
                          }}
                          value={b.weekDay}
                          onChange={(e) =>
                            updateEditingBlock(i, {
                              weekDay: e.target.value as WeekDay,
                            })
                          }
                        >
                          {WEEKDAYS.map((d) => (
                            <option key={d.id} value={d.id} className="text-black">
                              {d.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="time"
                          className="inp !py-1 !text-xs !w-24 text-center"
                          value={b.startTime}
                          onChange={(e) => updateEditingBlock(i, { startTime: e.target.value })}
                        />
                        <span className="text-[10px] text-muted-foreground font-bold">ATÉ</span>
                        <input
                          type="time"
                          className="inp !py-1 !text-xs !w-24 text-center"
                          value={b.endTime}
                          onChange={(e) => updateEditingBlock(i, { endTime: e.target.value })}
                        />
                        <button
                          onClick={() => removeEditingBlock(i)}
                          className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors ml-auto sm:ml-0"
                          title="Remover dia"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Almoço */}
                    <div className="flex items-center gap-2 w-full bg-background/50 p-2 rounded-lg border border-border/30 justify-end">
                      <span className="text-[10px] text-muted-foreground font-bold">ALMOÇO:</span>
                      <input
                        type="time"
                        className="inp !py-1 !text-xs !w-24 text-center"
                        value={b.lunchStart || ''}
                        onChange={(e) => updateEditingBlock(i, { lunchStart: e.target.value })}
                        placeholder="Início"
                      />
                      <span className="text-[10px] text-muted-foreground font-bold">ATÉ</span>
                      <input
                        type="time"
                        className="inp !py-1 !text-xs !w-24 text-center"
                        value={b.lunchEnd || ''}
                        onChange={(e) => updateEditingBlock(i, { lunchEnd: e.target.value })}
                        placeholder="Fim"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-white shadow-lg pb-2">
              <button
                onClick={() => {
                  setFieldErrors({});
                  setEditing(null);
                }}
                className="px-4 py-2 text-sm rounded-lg border"
              >
                Cancelar
              </button>
              <button onClick={save} className="btn-gold !py-2 !text-sm">
                Salvar Profissional
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Horários Independente (mantido para acesso rápido) */}
      {hoursTarget && (
        <Modal onClose={() => setHoursTarget(null)} title={`Horários — ${hoursTarget.name}`}>
          <div className="space-y-4">
            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scroll">
              {hoursTarget.workingHours.map((b, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 bg-muted/30 p-2 rounded-lg border border-border/50 animate-in slide-in-from-top-1"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      className="inp flex-1 !py-1"
                      value={b.weekDay}
                      onChange={(e) =>
                        updateTargetBlock(i, {
                          weekDay: e.target.value as WeekDay,
                        })
                      }
                    >
                      {WEEKDAYS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="time"
                      className="inp w-24 !py-1 text-center"
                      value={b.startTime}
                      onChange={(e) => updateTargetBlock(i, { startTime: e.target.value })}
                    />
                    <input
                      type="time"
                      className="inp w-24 !py-1 text-center"
                      value={b.endTime}
                      onChange={(e) => updateTargetBlock(i, { endTime: e.target.value })}
                    />
                    <button
                      onClick={() => {
                        const wh = hoursTarget.workingHours.filter((_, idx) => idx !== i);
                        setHoursTarget({ ...hoursTarget, workingHours: wh });
                      }}
                      className="p-1.5 hover:bg-destructive/10 text-destructive rounded-md transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  {/* Almoço Quick Modal */}
                  <div className="w-full flex items-center justify-end gap-2 bg-background/50 p-1.5 rounded-md border border-border/30">
                    <span className="text-[10px] text-muted-foreground font-bold">ALMOÇO:</span>
                    <input
                      type="time"
                      className="inp w-24 !py-1 !text-xs text-center"
                      value={b.lunchStart || ''}
                      onChange={(e) => updateTargetBlock(i, { lunchStart: e.target.value })}
                    />
                    <span className="text-[10px] text-muted-foreground font-bold">ATÉ</span>
                    <input
                      type="time"
                      className="inp w-24 !py-1 !text-xs text-center"
                      value={b.lunchEnd || ''}
                      onChange={(e) => updateTargetBlock(i, { lunchEnd: e.target.value })}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setHoursTarget({
                  ...hoursTarget,
                  workingHours: [
                    ...hoursTarget.workingHours,
                    { weekDay: 'MONDAY', startTime: '09:00', endTime: '18:00' },
                  ],
                });
              }}
              className="text-xs text-gold-dark font-bold inline-flex items-center gap-1 hover:underline p-1"
            >
              <Plus size={14} /> Adicionar novo horário
            </button>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                onClick={() => setHoursTarget(null)}
                className="px-4 py-2 text-sm rounded-lg border"
              >
                Cancelar
              </button>
              <button onClick={saveHours} className="btn-gold !py-2 !text-sm">
                Salvar Horários
              </button>
            </div>
          </div>
        </Modal>
      )}

      <style>{`
        .inp{width:100%;padding:.5rem .75rem;border-radius:.5rem;border:1px solid hsl(var(--input));background:hsl(var(--background));font-size:.875rem;outline:none;transition:all 0.2s;}
        .inp:focus{border-color:hsl(var(--gold));box-shadow:0 0 0 2px hsl(var(--gold)/0.2)}
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: hsl(var(--gold)/0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 ml-1">
        {label}
      </span>
      {children}
      {error ? <p className="text-xs text-destructive mt-1 ml-1">{error}</p> : null}
    </label>
  );
}

function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-border animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-bold">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-black">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

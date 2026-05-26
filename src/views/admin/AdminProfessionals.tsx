import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { STALE_TIME_ADMIN_DATA } from '@/constants/queryCache';
import { Professional, WorkingHourBlock, WeekDay } from '@/types';
import {
  getProfessionals,
  createProfessional,
  updateProfessional,
  updateProfessionalWorkingHours,
  deactivateProfessional,
  reactivateProfessional,
  uploadProfessionalAvatar,
  resolveAvatarUrl,
  AVATAR_UPLOAD_LIMITS,
} from '@/services/professionalService';
import { getAdminProcedures } from '@/services/procedureService';
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
import Image from 'next/image';
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
  description: string;
  workingHours: WorkingHourBlock[];
}

const empty: FormState = {
  name: '',
  email: '',
  phone: '',
  specialties: '',
  avatarUrl: '',
  description: '',
  // Agora já inicia com um bloco para facilitar a criação
  workingHours: [{ weekDay: 'MONDAY', startTime: '09:00', endTime: '18:00' }],
};

interface ProfessionalCardProps {
  professional: Professional;
  onEdit: (p: Professional) => void;
  onShowHours: (p: Professional) => void;
  onToggleActive: (p: Professional) => void;
}

const ProfessionalCard = memo(function ProfessionalCard({
  professional: p,
  onEdit,
  onShowHours,
  onToggleActive,
}: ProfessionalCardProps) {
  const avatar = resolveAvatarUrl(p.avatarUrl);
  return (
    <div className="bg-white border border-border rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-muted overflow-hidden border border-border flex-shrink-0 relative">
          {avatar ? (
            <Image src={avatar} alt={p.name} fill sizes="48px" className="object-cover" unoptimized />
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
          onClick={() => onEdit(p)}
          className="flex-1 px-2 py-1.5 text-xs rounded-lg border hover:bg-muted inline-flex items-center justify-center gap-1"
        >
          <Pencil size={12} /> Editar
        </button>
        <button
          onClick={() => onShowHours(p)}
          className="flex-1 px-2 py-1.5 text-xs rounded-lg border hover:bg-muted inline-flex items-center justify-center gap-1"
        >
          <Clock size={12} /> Horários
        </button>
        <button
          onClick={() => onToggleActive(p)}
          className={`px-2 py-1.5 text-xs rounded-lg border transition-colors ${p.isActive === false ? 'text-emerald-600 hover:bg-emerald-50' : 'text-destructive hover:bg-destructive/5'}`}
        >
          <Power size={12} />
        </button>
      </div>
    </div>
  );
});

export default function AdminProfessionals() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<FormState | null>(null);
  const [hoursTarget, setHoursTarget] = useState<{
    id: string;
    name: string;
    workingHours: WorkingHourBlock[];
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [specialtySearch, setSpecialtySearch] = useState<string>('');
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [pendingAvatarPreview, setPendingAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (pendingAvatarPreview) URL.revokeObjectURL(pendingAvatarPreview);
    };
  }, [pendingAvatarPreview]);

  useEffect(() => {
    document.title = 'Profissionais | Salão de Beleza';
  }, []);

  const { data: queryData, isLoading: loading, error: queryError, refetch } = useQuery({
    queryKey: ['adminProfessionalsAndProcs'],
    queryFn: async () => {
      const [profs, procs] = await Promise.all([getProfessionals(), getAdminProcedures()]);
      return { profs, procs };
    },
    staleTime: STALE_TIME_ADMIN_DATA,
    gcTime: 5 * 60_000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const error = queryError ? (queryError as Error).message : '';
  const items = queryData?.profs || [];
  const proceduresList = queryData?.procs || [];
  const refresh = refetch;

  const validateAvatarFile = useCallback(async (file: File): Promise<string | null> => {
    const allowedMime = AVATAR_UPLOAD_LIMITS.allowedMime as readonly string[];
    if (!allowedMime.includes(file.type)) {
      return 'Formato inválido. Use JPG, PNG ou WebP.';
    }
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const allowedExt = AVATAR_UPLOAD_LIMITS.allowedExtensions as readonly string[];
    if (!allowedExt.includes(ext)) {
      return 'Extensão inválida. Use .jpg, .jpeg, .png ou .webp.';
    }
    if (file.size > AVATAR_UPLOAD_LIMITS.maxSizeBytes) {
      const mb = (AVATAR_UPLOAD_LIMITS.maxSizeBytes / 1024 / 1024).toFixed(0);
      return `Arquivo muito grande. Máximo ${mb}MB.`;
    }
    if (file.size === 0) {
      return 'Arquivo vazio.';
    }

    const dimensions = await new Promise<{ w: number; h: number } | null>(
      (resolve) => {
        const url = URL.createObjectURL(file);
        const img = new window.Image();
        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve({ w: img.naturalWidth, h: img.naturalHeight });
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(null);
        };
        img.src = url;
      }
    );

    if (!dimensions) return 'Não foi possível ler a imagem.';
    const { w, h } = dimensions;
    if (
      w < AVATAR_UPLOAD_LIMITS.minDimension ||
      h < AVATAR_UPLOAD_LIMITS.minDimension
    ) {
      return `Imagem muito pequena. Mínimo ${AVATAR_UPLOAD_LIMITS.minDimension}x${AVATAR_UPLOAD_LIMITS.minDimension}px.`;
    }
    if (
      w > AVATAR_UPLOAD_LIMITS.maxInputDimension ||
      h > AVATAR_UPLOAD_LIMITS.maxInputDimension
    ) {
      return `Imagem muito grande. Máximo ${AVATAR_UPLOAD_LIMITS.maxInputDimension}x${AVATAR_UPLOAD_LIMITS.maxInputDimension}px.`;
    }
    return null;
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !editing) return;

    const errorMsg = await validateAvatarFile(file);
    if (errorMsg) {
      setFieldErrors((prev) => ({ ...prev, avatarUrl: errorMsg }));
      return;
    }

    if (pendingAvatarPreview) URL.revokeObjectURL(pendingAvatarPreview);
    const preview = URL.createObjectURL(file);
    setPendingAvatarFile(file);
    setPendingAvatarPreview(preview);
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.avatarUrl;
      return next;
    });
  }, [editing, pendingAvatarPreview, validateAvatarFile]);

  // Funções para manipular horários dentro do formulário de criação/edição
  // Usam o updater pattern do setState para evitar dependência em `editing` —
  // assim os callbacks ficam estáveis e qualquer filho memoizado não re-renderiza.
  const addEditingBlock = useCallback(() => {
    setEditing((cur) =>
      cur
        ? {
            ...cur,
            workingHours: [
              ...cur.workingHours,
              { weekDay: 'MONDAY', startTime: '09:00', endTime: '18:00' },
            ],
          }
        : cur
    );
  }, []);

  const updateEditingBlock = useCallback(
    (i: number, patch: Partial<WorkingHourBlock>) => {
      setEditing((cur) =>
        cur
          ? {
              ...cur,
              workingHours: cur.workingHours.map((b, idx) =>
                idx === i ? { ...b, ...patch } : b
              ),
            }
          : cur
      );
    },
    []
  );

  const removeEditingBlock = useCallback((i: number) => {
    setEditing((cur) =>
      cur
        ? { ...cur, workingHours: cur.workingHours.filter((_, idx) => idx !== i) }
        : cur
    );
  }, []);

  const save = async () => {
    if (!editing) return;
    setFieldErrors({});
    try {
      // Validação básica
      if (!editing.name.trim()) {
        setFieldErrors({ name: 'Nome é obrigatório' });
        return;
      }
      if (!editing.specialties.trim()) {
        setFieldErrors({ specialties: 'Selecione pelo menos uma especialidade' });
        return;
      }
      if (!editing.id && !pendingAvatarFile && !editing.avatarUrl) {
        setFieldErrors({ avatarUrl: 'Foto do profissional é obrigatória' });
        return;
      }

      const phoneDigits = editing.phone.replace(/\D/g, '');
      const existingAvatar = editing.avatarUrl.trim();
      const payload = {
        name: editing.name.trim(),
        email: editing.email.trim() || undefined,
        phone: phoneDigits.length ? phoneDigits : undefined,
        avatarUrl: existingAvatar || undefined,
        description: editing.description.trim(),
        specialties: editing.specialties
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        workingHours: editing.workingHours,
      };

      let success = false;
      let professionalId = editing.id;

      if (editing.id) {
        await updateProfessional(editing.id, payload);
        await updateProfessionalWorkingHours(editing.id, editing.workingHours);
        success = true;
      } else {
        const { avatarUrl: _omit, ...createPayload } = payload;
        if (!pendingAvatarFile) {
          setFieldErrors({ avatarUrl: 'Foto do profissional é obrigatória' });
          return;
        }
        const created = await createProfessional(createPayload);
        professionalId = created.id;
        success = true;
      }

      if (pendingAvatarFile && professionalId) {
        setUploadingAvatar(true);
        try {
          await uploadProfessionalAvatar(professionalId, pendingAvatarFile);
        } finally {
          setUploadingAvatar(false);
        }
      }

      if (success) {
        // Pequeno delay para garantir que o backend processou a alteração
        await new Promise(resolve => setTimeout(resolve, 200));

        // Remove COMPLETAMENTE os dados do cache de TODAS as queries relacionadas
        queryClient.removeQueries({ predicate: (query) => {
          const key = query.queryKey[0];
          return typeof key === 'string' && (
            key.includes('professional') ||
            key.includes('Professional') ||
            key.includes('procedure') ||
            key.includes('Procedure') ||
            key.includes('team') ||
            key.includes('Team')
          );
        }});

        // Força um novo fetch dos dados frescos do servidor
        await refetch();

        setEditing(null);
        setSpecialtySearch('');
        if (pendingAvatarPreview) URL.revokeObjectURL(pendingAvatarPreview);
        setPendingAvatarFile(null);
        setPendingAvatarPreview(null);
        showValidationToast('Profissional salvo com sucesso!', {});
      }
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
      // Pequeno delay para garantir que o backend processou
      await new Promise(resolve => setTimeout(resolve, 200));
      // Remove COMPLETAMENTE todas as queries relacionadas
      queryClient.removeQueries({ predicate: (query) => {
        const key = query.queryKey[0];
        return typeof key === 'string' && (
          key.includes('professional') ||
          key.includes('Professional') ||
          key.includes('team') ||
          key.includes('Team')
        );
      }});
      await refetch();
    } catch (e: unknown) {
      showApiErrorToast(e, 'Não foi possível salvar os horários');
    }
  };

  const updateTargetBlock = (i: number, patch: Partial<WorkingHourBlock>) => {
    if (!hoursTarget) return;
    const wh = hoursTarget.workingHours.map((b, idx) => (idx === i ? { ...b, ...patch } : b));
    setHoursTarget({ ...hoursTarget, workingHours: wh });
  };

  const toggleActive = useCallback(async (p: Professional) => {
    try {
      if (p.isActive === false) await reactivateProfessional(p.id);
      else await deactivateProfessional(p.id);
      await new Promise(resolve => setTimeout(resolve, 200));
      queryClient.removeQueries({ predicate: (query) => {
        const key = query.queryKey[0];
        return typeof key === 'string' && (
          key.includes('professional') ||
          key.includes('Professional') ||
          key.includes('team') ||
          key.includes('Team')
        );
      }});
      await refetch();
    } catch (e: unknown) {
      showApiErrorToast(e, 'Não foi possível alterar o status');
    }
  }, [queryClient, refetch]);

  const startEditing = useCallback((p: Professional) => {
    setFieldErrors({});
    setSpecialtySearch('');
    if (pendingAvatarPreview) URL.revokeObjectURL(pendingAvatarPreview);
    setPendingAvatarFile(null);
    setPendingAvatarPreview(null);
    setEditing({
      id: p.id,
      name: p.name,
      email: p.email || '',
      phone: p.phone || '',
      specialties: (p.specialties || []).join(', '),
      description: p.description || '',
      avatarUrl: p.avatarUrl || '',
      workingHours: p.workingHours || [],
    });
  }, [pendingAvatarPreview]);

  const openHoursModal = useCallback((p: Professional) => {
    setHoursTarget({
      id: p.id,
      name: p.name,
      workingHours: p.workingHours || [],
    });
  }, []);

  const startCreating = useCallback(() => {
    setFieldErrors({});
    setSpecialtySearch('');
    if (pendingAvatarPreview) URL.revokeObjectURL(pendingAvatarPreview);
    setPendingAvatarFile(null);
    setPendingAvatarPreview(null);
    setEditing({ ...empty });
  }, [pendingAvatarPreview]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-display font-bold">Profissionais</h1>
        <button
          onClick={startCreating}
          className="btn-gold !py-2 !text-sm inline-flex items-center gap-2"
        >
          <Plus size={14} /> Novo profissional
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-800 font-medium">⚠️ Sem conexão com servidor</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={() => refresh()}
            className="text-red-700 text-sm font-medium mt-2 hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-gold" />
        </div>
      ) : error ? (
        <p className="text-muted-foreground text-center py-12">Carregando últimos dados...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <ProfessionalCard
              key={p.id}
              professional={p}
              onEdit={startEditing}
              onShowHours={openHoursModal}
              onToggleActive={toggleActive}
            />
          ))}
        </div>
      )}

      {editing && (
        <Modal
          onClose={() => {
            setFieldErrors({});
            setSpecialtySearch('');
            setEditing(null);
            if (pendingAvatarPreview) URL.revokeObjectURL(pendingAvatarPreview);
            setPendingAvatarFile(null);
            setPendingAvatarPreview(null);
          }}
          title={editing.id ? 'Editar profissional' : 'Novo profissional'}
        >
          <div className="space-y-4 max-h-[80vh] overflow-y-auto px-1 custom-scroll">
            <div className="flex flex-col items-center mb-4">
              <div
                onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
                className={`w-24 h-24 rounded-full border-2 border-dashed border-border flex flex-col items-center justify-center transition-colors relative overflow-hidden bg-muted/30 ${uploadingAvatar ? 'opacity-60 cursor-wait' : 'cursor-pointer hover:border-gold'}`}
              >
                {pendingAvatarPreview ? (
                  <Image
                    src={pendingAvatarPreview}
                    alt="Avatar preview"
                    fill
                    sizes="96px"
                    className="object-cover"
                    unoptimized
                  />
                ) : resolveAvatarUrl(editing.avatarUrl) ? (
                  <Image
                    src={resolveAvatarUrl(editing.avatarUrl)!}
                    alt="Avatar"
                    fill
                    sizes="96px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <>
                    <Upload size={20} className="text-muted-foreground mb-1" />
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">
                      Foto *
                    </span>
                  </>
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 size={20} className="animate-spin text-white" />
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={uploadingAvatar}
                />
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                JPG, PNG ou WebP — máx 2MB
              </p>
              {fieldErrors.avatarUrl && (
                <p className="text-xs text-destructive text-center mt-1">{fieldErrors.avatarUrl}</p>
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

            <Field label="Especialidades (Obrigatório)" error={fieldErrors.specialties}>
              <input
                type="text"
                className="inp mb-3 text-xs"
                placeholder="Buscar por nome do procedimento..."
                value={specialtySearch}
                onChange={(e) => setSpecialtySearch(e.target.value)}
              />
              <div className="flex flex-wrap gap-2 mt-1">
                {(() => {
                  const filteredProcs = specialtySearch
                    ? proceduresList.filter(p => p.name.toLowerCase().includes(specialtySearch.toLowerCase()))
                    : proceduresList.slice(0, 5);

                  return filteredProcs.map(proc => {
                    const selected = editing.specialties.split(',').map(s => s.trim()).includes(proc.name);
                    return (
                      <button
                        key={proc.id}
                        type="button"
                        onClick={() => {
                          const current = editing.specialties.split(',').map(s => s.trim()).filter(Boolean);
                          let next;
                          if (current.includes(proc.name)) {
                            next = current.filter(c => c !== proc.name);
                          } else {
                            next = [...current, proc.name];
                          }
                          setFieldErrors(p => { const n = {...p}; delete n.specialties; return n; });
                          setEditing({ ...editing, specialties: next.join(', ') });
                        }}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          selected
                            ? 'bg-gold text-primary border-gold font-bold shadow-sm'
                            : 'bg-background text-muted-foreground border-border hover:border-gold/50'
                        }`}
                      >
                        {proc.name}
                      </button>
                    );
                  });
                })()}
              </div>
              {proceduresList.length === 0 && (
                <p className="text-xs text-muted-foreground italic">Nenhum procedimento cadastrado ainda.</p>
              )}
            </Field>

            <Field label="Descrição (Aparecerá na página Equipe)" error={fieldErrors.description}>
              <textarea
                className="inp custom-scroll resize-none"
                rows={3}
                value={editing.description}
                onChange={(e) => {
                  setFieldErrors((p) => {
                    const n = { ...p };
                    delete n.description;
                    return n;
                  });
                  setEditing({ ...editing, description: e.target.value });
                }}
                placeholder="Breve resumo sobre a carreira e perfil do profissional..."
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
                  setSpecialtySearch('');
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
                      onBlur={() => {
                        if (b.endTime && (b.lunchEnd || !b.lunchStart)) {
                          setTimeout(() => setHoursTarget(null), 300);
                        }
                      }}
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
    <div className="block">
      <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 ml-1">
        {label}
      </label>
      {children}
      {error ? <p className="text-xs text-destructive mt-1 ml-1">{error}</p> : null}
    </div>
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


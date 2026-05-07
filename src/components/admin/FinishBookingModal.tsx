import { useState, useEffect, useMemo } from 'react';
import { getAdminProcedures } from '@/services/procedureService';
import { getProfessionals } from '@/services/professionalService';
import { Procedure, Booking, Professional } from '@/types';
import { X, Loader2, CheckCheck, Search, Plus } from 'lucide-react';
import { formatCurrency } from '@/utils';

interface FinishBookingModalProps {
  booking: Booking;
  onConfirm: (
    extraProcedureId?: string, 
    extraProfessionalId?: string, 
    discountPercentage?: number,
    extraProcedures?: { procedureId: string; professionalId?: string }[]
  ) => Promise<void>;
  onClose: () => void;
}

export default function FinishBookingModal({ booking, onConfirm, onClose }: FinishBookingModalProps) {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [extraProceduresList, setExtraProceduresList] = useState<{ procedure: Procedure; professionalId: string }[]>([]);
  const [selectedExtraProc, setSelectedExtraProc] = useState<Procedure | null>(null);
  const [selectedExtraProfId, setSelectedExtraProfId] = useState<string>('');
  const [discountPercentage, setDiscountPercentage] = useState<number | ''>('');

  useEffect(() => {
    setLoading(true);
    Promise.all([getAdminProcedures(), getProfessionals()])
      .then(([procs, profs]) => {
        setProcedures(procs.filter(p => p.isActive !== false));
        setProfessionals(profs.filter(p => p.isActive !== false));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scheduledTotal = useMemo(() => {
    return booking.items.reduce((acc, item) => acc + (item.amountCharged || item.procedure.price || 0), 0);
  }, [booking]);

  const filteredProcedures = useMemo(() => {
    if (!searchTerm) return [];
    return procedures.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, procedures]);

  const availableProfessionalsForExtra = useMemo(() => {
    if (!selectedExtraProc) return [];
    return professionals.filter(p => p.specialties?.includes(selectedExtraProc.category) || p.specialty === selectedExtraProc.category);
  }, [selectedExtraProc, professionals]);

  const extraTotal = 
    (selectedExtraProc?.price || 0) + 
    extraProceduresList.reduce((acc, p) => acc + (p.procedure.price || 0), 0);
  const subtotal = scheduledTotal + extraTotal;
  const discountAmount = typeof discountPercentage === 'number' ? subtotal * (discountPercentage / 100) : 0;
  const finalTotal = subtotal - discountAmount;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const discount = typeof discountPercentage === 'number' ? discountPercentage : undefined;
      const extraList = extraProceduresList.map(ep => ({
        procedureId: ep.procedure.id,
        professionalId: ep.professionalId
      }));
      await onConfirm(
        selectedExtraProc?.id, 
        selectedExtraProfId || undefined, 
        discount,
        extraList.length > 0 ? extraList : undefined
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-lg p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b border-border pb-4">
          <h3 className="font-display font-bold text-lg flex items-center gap-2 text-black">
            <CheckCheck className="text-gold" size={24} /> Concluir Atendimento
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin text-gold" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Itens Agendados */}
            <div>
              <h4 className="text-sm font-semibold mb-2 text-black">Itens Agendados</h4>
              <div className="bg-muted/30 rounded-lg p-3 space-y-2 border border-border">
                {booking.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.procedure.name}</span>
                    <span className="font-medium text-black">{formatCurrency(item.amountCharged || item.procedure.price || 0)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Procedimento Avulso */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-black">Adicionar Procedimentos Avulsos</h4>
              
              {extraProceduresList.map((ep, idx) => {
                const profName = professionals.find(p => p.id === ep.professionalId)?.name || '';
                return (
                  <div key={idx} className="bg-gold/5 border border-gold/10 rounded-lg p-3 flex justify-between items-center text-sm">
                    <div>
                      <div className="font-medium text-gold-dark">{ep.procedure.name}</div>
                      <div className="text-xs text-muted-foreground">Profissional: {profName}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-black">{formatCurrency(ep.procedure.price || 0)}</span>
                      <button onClick={() => {
                        const newList = [...extraProceduresList];
                        newList.splice(idx, 1);
                        setExtraProceduresList(newList);
                      }} className="text-muted-foreground hover:text-red-500">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {!selectedExtraProc ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar procedimento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 ring-gold outline-none text-black"
                  />
                  {searchTerm && filteredProcedures.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredProcedures.map(p => (
                        <li
                          key={p.id}
                          className="px-3 py-2 text-sm hover:bg-muted cursor-pointer flex justify-between text-black"
                          onClick={() => {
                            setSelectedExtraProc(p);
                            setSearchTerm('');
                          }}
                        >
                          <span>{p.name}</span>
                          <span className="text-muted-foreground">{formatCurrency(p.price || 0)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {searchTerm && filteredProcedures.length === 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-lg shadow-lg px-3 py-2 text-sm text-muted-foreground">
                      Nenhum procedimento encontrado.
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gold/10 border border-gold/20 rounded-lg p-3 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gold-dark">{selectedExtraProc.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-black">{formatCurrency(selectedExtraProc.price || 0)}</span>
                      <button onClick={() => { setSelectedExtraProc(null); setSelectedExtraProfId(''); }} className="text-muted-foreground hover:text-red-500">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Profissional que realizou</label>
                    <div className="flex gap-2 items-end">
                      <select
                        value={selectedExtraProfId}
                        onChange={(e) => setSelectedExtraProfId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 ring-gold outline-none text-black flex-1"
                      >
                        <option value="">Selecione o profissional</option>
                        {availableProfessionalsForExtra.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      {selectedExtraProfId && (
                        <button 
                          onClick={() => {
                            setExtraProceduresList([...extraProceduresList, { procedure: selectedExtraProc, professionalId: selectedExtraProfId }]);
                            setSelectedExtraProc(null);
                            setSelectedExtraProfId('');
                            setSearchTerm('');
                          }}
                          className="px-3 py-2 rounded-lg bg-gold text-white hover:bg-gold-dark flex items-center justify-center transition-colors"
                          title="Adicionar outro procedimento avulso"
                        >
                          <Plus size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Resumo de Valores e Desconto */}
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Desconto (%)</span>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value ? Number(e.target.value) : '')}
                  className="w-20 px-3 py-1 rounded-lg border border-input bg-background text-sm text-right focus:ring-2 ring-gold outline-none text-black"
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-black">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>Desconto aplicado ({discountPercentage}%)</span>
                  <span>- {formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="font-bold text-black">Total a Pagar</span>
                <span className="text-xl font-bold text-gold-dark">{formatCurrency(finalTotal)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted text-black"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting || (!!selectedExtraProc && !selectedExtraProfId)}
            className="btn-gold !py-2 !text-sm min-w-[140px] flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Confirmar Conclusão
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useBooking } from '@/hooks/useBooking';
import { Professional, BookingItemSelection } from '@/types';
import { getProfessionals } from '@/services/professionalService';
import { User, Loader2 } from 'lucide-react';
import { formatTimeFromIso } from '@/utils';

export default function StepProfessional() {
  const { state, dispatch } = useBooking();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfessionals()
      .then((d) => setProfessionals(d.filter((p) => p.isActive !== false)))
      .catch(() => setProfessionals([]))
      .finally(() => setLoading(false));
  }, []);

  const updateItem = (procedureId: string, patch: Partial<BookingItemSelection>) => {
    const items = state.form.items.map((it) =>
      it.procedure.id === procedureId ? { ...it, ...patch } : it
    );
    dispatch({ type: 'SET_ITEMS', payload: items });
  };

  const matchingFor = (procedureCategory: string) =>
    professionals.filter((p) => (p.specialties || []).some((s) => s.toLowerCase().includes(procedureCategory.toLowerCase())) || p.specialty === procedureCategory);

  if (loading) {
    return <div className="flex justify-center py-8"><Loader2 className="animate-spin text-gold" /></div>;
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <p className="text-sm text-muted-foreground">
        {state.form.items.length === 1
          ? 'Confirme ou altere o profissional:'
          : 'Confirme ou altere o profissional para cada procedimento:'}
      </p>

      {state.form.items.map((item) => {
        const matches = matchingFor(item.procedure.category);
        return (
          <div key={item.procedure.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-display font-bold text-gold">{item.procedure.name}</h4>
              {item.startTime && (
                <span className="text-xs text-muted-foreground">{formatTimeFromIso(item.startTime)}</span>
              )}
            </div>

            <button
              onClick={() => updateItem(item.procedure.id, {
                noPreference: true, professionalId: undefined, professionalName: undefined, startTime: undefined, endTime: undefined,
              })}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all w-full ${
                item.noPreference ? 'border-gold bg-gold/10' : 'border-border hover:border-gold/50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-muted-foreground" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Sem preferência</p>
                <p className="text-xs text-muted-foreground">Sistema escalará um profissional disponível</p>
              </div>
            </button>

            {matches.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matches.map((prof) => {
                  const selected = !item.noPreference && item.professionalId === prof.id;
                  return (
                    <button
                      key={prof.id}
                      onClick={() => updateItem(item.procedure.id, {
                        noPreference: false,
                        professionalId: prof.id,
                        professionalName: prof.name,
                      })}
                      className={`flex flex-col items-center p-4 rounded-xl border transition-all text-center ${
                        selected ? 'border-gold bg-gold/10' : 'border-border hover:border-gold/50'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-2 overflow-hidden">
                        {prof.avatarUrl ? <img src={prof.avatarUrl} alt={prof.name} className="w-full h-full object-cover" /> : <User size={20} className="text-muted-foreground" />}
                      </div>
                      <p className="font-medium text-sm">{prof.name}</p>
                      <p className="text-xs text-gold">{(prof.specialties || []).join(', ')}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

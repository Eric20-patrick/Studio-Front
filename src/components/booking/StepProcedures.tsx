import { useState, useEffect } from 'react';
import { useBooking } from '@/hooks/useBooking';
import { Procedure } from '@/types';
import { getProcedures } from '@/services/procedureService';
import { Search, X, Loader2 } from 'lucide-react';
import { formatDuration } from '@/utils';

export default function StepProcedures() {
  const { state, dispatch } = useBooking();
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    getProcedures()
      .then((d) => setProcedures(d.filter((p) => p.isActive !== false)))
      .catch(() => setProcedures([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? procedures.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    : showAll ? procedures : procedures.slice(0, 10);

  const isSelected = (p: Procedure) => state.form.procedures.some((s) => s.id === p.id);

  const toggle = (p: Procedure) => {
    const next = isSelected(p)
      ? state.form.procedures.filter((s) => s.id !== p.id)
      : [...state.form.procedures, p];
    
    if (next.length > 5) {
      alert('Você pode selecionar no máximo 5 procedimentos.');
      return;
    }

    dispatch({ type: 'SET_PROCEDURES', payload: next });
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <p className="text-sm text-muted-foreground">Selecione um ou mais procedimentos:</p>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar procedimento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 ring-gold"
        />
      </div>

      {state.form.procedures.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {state.form.procedures.map((p) => (
            <span key={p.id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold/20 text-gold-dark text-xs font-medium">
              {p.name}
              <button onClick={() => toggle(p)}><X size={12} /></button>
            </span>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-gold" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          {search ? 'Nenhum procedimento encontrado' : 'Nenhum procedimento disponível'}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {filtered.map((p) => (
            <button
              key={p.id}
              data-testid="procedure-chip"
              onClick={() => toggle(p)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                isSelected(p) ? 'bg-gold text-primary border-gold' : 'border-border hover:border-gold/50 hover:bg-gold/5'
              }`}
            >
              {p.name} <span className="text-xs opacity-60">({formatDuration(p.duration)})</span>
            </button>
          ))}
        </div>
      )}

      {!search && !showAll && procedures.length > 10 && (
        <button onClick={() => setShowAll(true)} className="text-sm text-gold font-medium hover:underline self-start">
          Ver mais procedimentos
        </button>
      )}
    </div>
  );
}

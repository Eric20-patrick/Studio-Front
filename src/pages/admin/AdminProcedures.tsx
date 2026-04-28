import { useEffect, useState } from 'react';
import { Procedure } from '@/types';
import {
  getAdminProcedures, createProcedure, updateProcedure, updateProcedurePrice,
  deactivateProcedure, reactivateProcedure,
} from '@/services/procedureService';
import { Loader2, Plus, Pencil, Power, DollarSign } from 'lucide-react';
import { formatDuration, formatCurrency } from '@/utils';

interface FormState {
  id?: string;
  name: string;
  category: string;
  description: string;
  duration: number;
  interval: number;
  price: number;
}

const empty: FormState = { name: '', category: '', description: '', duration: 60, interval: 15, price: 0 };

export default function AdminProcedures() {
  const [items, setItems] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<FormState | null>(null);
  const [priceTarget, setPriceTarget] = useState<Procedure | null>(null);
  const [priceValue, setPriceValue] = useState(0);

  useEffect(() => { document.title = 'Procedimentos | Studio Neo'; }, []);

  const refresh = () => {
    setLoading(true); setError('');
    getAdminProcedures().then(setItems).catch((e) => setError(e?.message || 'Erro')).finally(() => setLoading(false));
  };
  useEffect(refresh, []);

  const save = async () => {
    if (!editing) return;
    try {
      if (editing.id) await updateProcedure(editing.id, editing);
      else await createProcedure(editing);
      setEditing(null); refresh();
    } catch (e: any) { alert(e?.message); }
  };

  const savePrice = async () => {
    if (!priceTarget) return;
    try { await updateProcedurePrice(priceTarget.id, priceValue); setPriceTarget(null); refresh(); }
    catch (e: any) { alert(e?.message); }
  };

  const toggleActive = async (p: Procedure) => {
    try {
      if (p.isActive === false) await reactivateProcedure(p.id);
      else await deactivateProcedure(p.id);
      refresh();
    } catch (e: any) { alert(e?.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-display font-bold">Procedimentos</h1>
        <button onClick={() => setEditing({ ...empty })} className="btn-gold !py-2 !text-sm inline-flex items-center gap-2">
          <Plus size={14} /> Novo procedimento
        </button>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold" /></div> :
        error ? <p className="text-destructive text-center py-12">{error}</p> : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3">Nome</th>
                <th className="text-left p-3">Categoria</th>
                <th className="text-left p-3">Duração</th>
                <th className="text-left p-3">Preço</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-muted-foreground">{p.category}</td>
                  <td className="p-3">{formatDuration(p.duration)}</td>
                  <td className="p-3">
                    <button onClick={() => { setPriceTarget(p); setPriceValue(p.price || 0); }} className="text-gold-dark font-semibold hover:underline inline-flex items-center gap-1">
                      <DollarSign size={12} />{formatCurrency(p.price)}
                    </button>
                  </td>
                  <td className="p-3">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${p.isActive === false ? 'bg-muted text-muted-foreground' : 'bg-emerald-500/15 text-emerald-700'}`}>
                      {p.isActive === false ? 'INATIVO' : 'ATIVO'}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    <button onClick={() => setEditing({
                      id: p.id, name: p.name, category: p.category, description: p.description || '',
                      duration: Number(p.duration) || 60, interval: p.interval || 15, price: p.price || 0,
                    })} className="p-1.5 hover:bg-muted rounded"><Pencil size={14} /></button>
                    <button onClick={() => toggleActive(p)} className="p-1.5 hover:bg-muted rounded"><Power size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? 'Editar procedimento' : 'Novo procedimento'}>
          <div className="space-y-3">
            <Field label="Nome"><input className="inp" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="Categoria"><input className="inp" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></Field>
            <Field label="Descrição"><textarea className="inp resize-none" rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
            <div className="grid grid-cols-3 gap-2">
              <Field label="Duração (min)"><input type="number" className="inp" value={editing.duration} onChange={(e) => setEditing({ ...editing, duration: Number(e.target.value) })} /></Field>
              <Field label="Intervalo (min)"><input type="number" className="inp" value={editing.interval} onChange={(e) => setEditing({ ...editing, interval: Number(e.target.value) })} /></Field>
              <Field label="Preço (R$)"><input type="number" step="0.01" className="inp" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} /></Field>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm rounded-lg border border-border">Cancelar</button>
              <button onClick={save} className="btn-gold !py-2 !text-sm">Salvar</button>
            </div>
          </div>
        </Modal>
      )}

      {priceTarget && (
        <Modal onClose={() => setPriceTarget(null)} title={`Atualizar preço — ${priceTarget.name}`}>
          <div className="space-y-3">
            <Field label="Novo preço (R$)">
              <input type="number" step="0.01" autoFocus className="inp" value={priceValue} onChange={(e) => setPriceValue(Number(e.target.value))} />
            </Field>
            <div className="flex justify-end gap-2">
              <button onClick={() => setPriceTarget(null)} className="px-4 py-2 text-sm rounded-lg border border-border">Cancelar</button>
              <button onClick={savePrice} className="btn-gold !py-2 !text-sm">Salvar</button>
            </div>
          </div>
        </Modal>
      )}

      <style>{`.inp{width:100%;padding:.5rem .75rem;border-radius:.5rem;border:1px solid hsl(var(--input));background:hsl(var(--background));font-size:.875rem;outline:none;}.inp:focus{box-shadow:0 0 0 2px hsl(var(--gold))}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-xs font-medium mb-1">{label}</span>{children}</label>;
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display font-bold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import {
  listReceptionUsers,
  updateUserDelegation,
  ReceptionUserRow,
} from '@/services/userAdminService';
import type { DelegatedPermissions } from '@/types';
import { Loader2 } from 'lucide-react';
import { getFieldErrorsFromUnknown, formatValidationLines } from '@/utils/apiErrors';

const KEYS: {
  key: keyof DelegatedPermissions;
  label: string;
}[] = [
  { key: 'canViewAdminDashboard', label: 'Ver dashboard admin (faturamento)' },
  { key: 'canExportReports', label: 'Exportar relatórios PDF / Excel' },
  { key: 'canManageProfessionals', label: 'Gerir profissionais' },
  { key: 'canManageProcedures', label: 'Gerir procedimentos' },
];

function flagsFrom(u: ReceptionUserRow): DelegatedPermissions {
  return { ...(u.delegatedPermissions || {}) };
}

export default function AdminDelegation() {
  const [users, setUsers] = useState<ReceptionUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, DelegatedPermissions>>({});

  useEffect(() => {
    document.title = 'Delegar funções | Salão de Beleza';
  }, []);

  const load = () => {
    setLoading(true);
    setError('');
    listReceptionUsers()
      .then((list) => {
        setUsers(list);
        const d: Record<string, DelegatedPermissions> = {};
        list.forEach((u) => {
          d[u.id] = flagsFrom(u);
        });
        setDrafts(d);
      })
      .catch((e) => setError(e?.message || 'Erro ao carregar usuários'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = (userId: string, key: keyof DelegatedPermissions) => {
    setDrafts((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [key]: !prev[userId]?.[key],
      },
    }));
  };

  const save = async (userId: string) => {
    setSavingId(userId);
    setError('');
    try {
      await updateUserDelegation(userId, drafts[userId] || {});
      await load();
    } catch (e: unknown) {
      const details = getFieldErrorsFromUnknown(e);
      if (details && Object.keys(details).length > 0) {
        setError(formatValidationLines(details).join(' · '));
      } else {
        setError(e instanceof Error ? e.message : 'Erro ao salvar');
      }
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-bold">Delegar funções</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Defina o que cada usuário de <strong>recepção</strong> pode fazer além da fila e dos
          agendamentos. O perfil <strong>admin</strong> mantém acesso total. Após alterar
          permissões, peça ao usuário para <strong>sair e entrar de novo</strong> (ou aguardar o
          refresh do token) para aplicar no menu.
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {users.length === 0 ? (
        <p className="text-muted-foreground text-sm">Nenhum usuário com perfil RECEPCION ativo.</p>
      ) : (
        <div className="space-y-4">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-white shadow-lg border border-border rounded-xl p-5 space-y-4"
            >
              <div>
                <p className="font-display font-bold">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
              <div className="grid gap-2">
                {KEYS.map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-input"
                      checked={Boolean(drafts[u.id]?.[key])}
                      onChange={() => toggle(u.id, key)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                disabled={savingId === u.id}
                onClick={() => save(u.id)}
                className="btn-gold !py-2 !text-sm disabled:opacity-50"
              >
                {savingId === u.id ? 'Salvando…' : 'Salvar permissões'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


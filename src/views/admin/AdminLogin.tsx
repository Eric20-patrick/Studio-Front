'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { getFieldErrorsFromUnknown, collapseFieldErrors } from '@/utils/apiErrors';

function AdminLoginForm() {
  const { user, login, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Login | Salão de Beleza Admin';
  }, []);

  useEffect(() => {
    if (user && !loading) {
      const from = searchParams.get('from');
      if (from && from.startsWith('/')) {
        router.replace(from);
        return;
      }
      if (user.role === 'ADMIN') {
        router.replace('/admin');
        return;
      }
      if (user.delegatedPermissions?.canViewAdminDashboard) {
        router.replace('/admin');
        return;
      }
      router.replace('/admin/recepcao');
    }
  }, [user, loading, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err: unknown) {
      const details = getFieldErrorsFromUnknown(err);
      if (details && Object.keys(details).length > 0) {
        setFieldErrors(collapseFieldErrors(details));
        setError('Preencha os campos conforme indicado abaixo.');
      } else {
        setError(err instanceof Error ? err.message : 'Credenciais inválidas');
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-scale-in"
      >
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold">Salão de Beleza</h1>
          <p className="text-sm text-muted-foreground mt-1">Acesso administrativo</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setFieldErrors((p) => {
                  const n = { ...p };
                  delete n.email;
                  return n;
                });
                setEmail(e.target.value);
              }}
              required
              autoComplete="email"
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 ring-gold"
              placeholder="seu@email.com"
            />
            {fieldErrors.email && (
              <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setFieldErrors((p) => {
                  const n = { ...p };
                  delete n.password;
                  return n;
                });
                setPassword(e.target.value);
              }}
              required
              autoComplete="current-password"
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 ring-gold"
              placeholder="••••••••"
            />
            {fieldErrors.password && (
              <p className="text-xs text-destructive mt-1">{fieldErrors.password}</p>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-destructive text-center">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-primary">
          <Loader2 className="animate-spin text-gold" size={32} />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}

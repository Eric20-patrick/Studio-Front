import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { api, getAccessToken, setAccessToken } from '@/services/api';
import { AuthUser, DelegatedPermissions, UserRole } from '@/types';

interface LoginResp {
  accessToken: string;
  user: AuthUser;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  /** Admin sempre; recepção só se o admin delegou a permissão */
  canDelegated: (key: keyof DelegatedPermissions) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!getAccessToken()) {
          if (!cancelled) setLoading(false);
          return;
        }
        const me = await api.get<AuthUser>('/auth/me');
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) {
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<LoginResp>('/auth/login', { email, password }, { auth: false });
    setAccessToken(data.accessToken);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout', undefined); } catch { /* ignore */ }
    setAccessToken(null);
    setUser(null);
  }, []);

  const hasRole = useCallback((role: UserRole | UserRole[]) => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  }, [user]);

  const canDelegated = useCallback(
    (key: keyof DelegatedPermissions) => {
      if (!user) return false;
      if (user.role === 'ADMIN') return true;
      return Boolean(user.delegatedPermissions?.[key]);
    },
    [user],
  );

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole, canDelegated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

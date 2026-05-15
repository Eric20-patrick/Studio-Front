import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth, AuthProvider } from './useAuth';
import * as apiModule from '@/services/api';

vi.mock('@/services/api');

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (apiModule.getAccessToken as any).mockReturnValue(null);
    (apiModule.setAccessToken as any).mockImplementation(() => {});
  });

  it('deve lançar erro se usado fora de AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within AuthProvider');
  });

  it('deve retornar user null quando não está autenticado', () => {
    (apiModule.api as any) = {
      get: vi.fn().mockRejectedValue(new Error('Unauthorized')),
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('deve fazer login com credenciais válidas', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'ADMIN',
    };

    (apiModule.api as any) = {
      post: vi.fn().mockResolvedValue({
        accessToken: 'token123',
        user: mockUser,
      }),
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(apiModule.setAccessToken).toHaveBeenCalledWith('token123');
  });

  it('deve fazer logout com sucesso', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'ADMIN',
    };

    (apiModule.api as any) = {
      post: vi.fn().mockResolvedValue({
        accessToken: 'token123',
        user: mockUser,
      }),
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    (apiModule.api as any).post.mockResolvedValueOnce({});

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(apiModule.setAccessToken).toHaveBeenCalledWith(null);
  });

  it('deve verificar role do usuário', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'ADMIN',
    };

    (apiModule.api as any) = {
      post: vi.fn().mockResolvedValue({
        accessToken: 'token123',
        user: mockUser,
      }),
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.hasRole('ADMIN')).toBe(true);
    expect(result.current.hasRole('RECEPTION')).toBe(false);
  });

  it('deve verificar múltiplas roles', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'RECEPTION',
    };

    (apiModule.api as any) = {
      post: vi.fn().mockResolvedValue({
        accessToken: 'token123',
        user: mockUser,
      }),
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.hasRole(['ADMIN', 'RECEPTION'])).toBe(true);
    expect(result.current.hasRole(['ADMIN'])).toBe(false);
  });

  it('deve verificar permissão delegada', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'RECEPTION',
      delegatedPermissions: {
        canManageProfessionals: true,
      },
    };

    (apiModule.api as any) = {
      post: vi.fn().mockResolvedValue({
        accessToken: 'token123',
        user: mockUser,
      }),
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.canDelegated('canManageProfessionals')).toBe(true);
    expect(result.current.canDelegated('canExportReports')).toBe(false);
  });

  it('deve permitir todas as permissões para ADMIN', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'ADMIN',
    };

    (apiModule.api as any) = {
      post: vi.fn().mockResolvedValue({
        accessToken: 'token123',
        user: mockUser,
      }),
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.canDelegated('canManageProfessionals')).toBe(true);
    expect(result.current.canDelegated('canExportReports')).toBe(true);
  });
});

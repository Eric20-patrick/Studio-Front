import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useRouter, usePathname } from 'next/navigation';
import ProtectedRoute from './ProtectedRoute';
import * as AuthHook from '@/hooks/useAuth';

vi.mock('next/navigation');
vi.mock('@/hooks/useAuth');

describe('ProtectedRoute', () => {
  const mockPush = vi.fn();
  const mockReplace = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
    (usePathname as any).mockReturnValue('/admin/test');
  });

  it('deve renderizar conteúdo quando usuário está autenticado', () => {
    (AuthHook.useAuth as any).mockReturnValue({
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'ADMIN',
      },
      loading: false,
      canDelegated: vi.fn(() => true),
    });

    render(
      <ProtectedRoute>
        <div>Conteúdo protegido</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Conteúdo protegido')).toBeInTheDocument();
  });

  it('deve exibir loader enquanto estiver carregando', () => {
    (AuthHook.useAuth as any).mockReturnValue({
      user: null,
      loading: true,
      canDelegated: vi.fn(),
    });

    const { container } = render(
      <ProtectedRoute>
        <div>Conteúdo protegido</div>
      </ProtectedRoute>
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('deve redirecionar para login quando usuário não está autenticado', () => {
    (AuthHook.useAuth as any).mockReturnValue({
      user: null,
      loading: false,
      canDelegated: vi.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Conteúdo protegido</div>
      </ProtectedRoute>
    );

    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining('/admin/login')
    );
  });

  it('deve verificar role quando roles prop é fornecido', () => {
    (AuthHook.useAuth as any).mockReturnValue({
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'RECEPTION',
      },
      loading: false,
      canDelegated: vi.fn(() => true),
    });

    render(
      <ProtectedRoute roles={['ADMIN']}>
        <div>Conteúdo protegido</div>
      </ProtectedRoute>
    );

    expect(mockReplace).toHaveBeenCalledWith('/admin/recepcao');
  });

  it('deve verificar permissão delegada quando delegated prop é fornecido', () => {
    (AuthHook.useAuth as any).mockReturnValue({
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'RECEPTION',
      },
      loading: false,
      canDelegated: vi.fn(() => false),
    });

    render(
      <ProtectedRoute delegated="canManageProfessionals">
        <div>Conteúdo protegido</div>
      </ProtectedRoute>
    );

    expect(mockReplace).toHaveBeenCalledWith('/admin/recepcao');
  });

  it('deve permitir acesso quando permissão delegada está ativa', () => {
    (AuthHook.useAuth as any).mockReturnValue({
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'RECEPTION',
        delegatedPermissions: { canManageProfessionals: true },
      },
      loading: false,
      canDelegated: vi.fn(() => true),
    });

    render(
      <ProtectedRoute delegated="canManageProfessionals">
        <div>Conteúdo protegido</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Conteúdo protegido')).toBeInTheDocument();
  });
});

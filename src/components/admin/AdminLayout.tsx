"use client";

import React, { useMemo, useCallback } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  LogOut,
  ClipboardList,
  UserCircle,
} from "lucide-react";

function navClass(isActive: boolean) {
  return `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 whitespace-nowrap ${
    isActive
      ? "bg-gold/15 text-gold-dark font-semibold shadow-sm"
      : "text-foreground/70 hover:bg-muted hover:text-foreground"
  }`;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, hasRole, canDelegated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.replace("/admin/login");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  }, [logout, router]);

  const sidebar = useMemo(() => (
    <aside id="admin-sidebar" className="fixed md:sticky top-0 left-0 h-screen bg-card border-r border-border flex flex-col overflow-hidden w-16 md:w-full z-50 shadow-2xl md:shadow-none">
        <div className="p-6 border-b border-border whitespace-nowrap flex items-center overflow-hidden">
          <Link
            href="/admin"
            className="font-display font-bold text-xl tracking-tight flex items-center gap-2"
          >
            <div className="w-2 h-6 bg-gold rounded-full shrink-0" />
            <span className="hidden md:inline">Salão de Beleza</span>
          </Link>
        </div>

        <nav 
          className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden"
          onClick={(e) => {
            if (window.innerWidth < 768) {
              const target = e.target as HTMLElement;
              const link = target.closest('a');
              if (link) {
                link.blur();
                const aside = document.getElementById('admin-sidebar');
                if (aside) {
                  aside.style.display = 'none';
                  setTimeout(() => { aside.style.display = ''; }, 50);
                }
              }
            }
          }}
        >
          {canDelegated("canViewAdminDashboard") && (
            <Link
              href="/admin"
              className={navClass(pathname === "/admin")}
            >
              <LayoutDashboard size={18} className="shrink-0" /> <span className="hidden md:inline">Dashboard</span>
            </Link>
          )}

          <Link
            href="/admin/recepcao"
            className={navClass(pathname === "/admin/recepcao")}
          >
            <ClipboardList size={18} className="shrink-0" /> <span className="hidden md:inline">Fila do dia</span>
          </Link>

          <Link
            href="/admin/agendamentos"
            className={navClass(pathname === "/admin/agendamentos")}
          >
            <Calendar size={18} className="shrink-0" /> <span className="hidden md:inline">Agendamentos</span>
          </Link>

          {hasRole("ADMIN") && (
            <Link
              href="/admin/clientes"
              className={navClass(pathname === "/admin/clientes")}
            >
              <Users size={18} className="shrink-0" /> <span className="hidden md:inline">Clientes</span>
            </Link>
          )}

          {(hasRole("ADMIN") ||
            canDelegated("canManageProfessionals") ||
            canDelegated("canManageProcedures")) && (
            <div className="pt-4 pb-2 px-3">
              <p className="text-[10px] font-bold uppercase text-muted-foreground/50 tracking-tighter hidden md:block">
                Configurações
              </p>
            </div>
          )}
          {canDelegated("canManageProfessionals") && (
            <Link
              href="/admin/profissionais"
              className={navClass(pathname === "/admin/profissionais")}
            >
              <Users size={18} className="shrink-0" /> <span className="hidden md:inline">Profissionais</span>
            </Link>
          )}
          {canDelegated("canManageProcedures") && (
            <Link
              href="/admin/procedimentos"
              className={navClass(pathname === "/admin/procedimentos")}
            >
              <Scissors size={18} className="shrink-0" /> <span className="hidden md:inline">Procedimentos</span>
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-border bg-muted/30 overflow-hidden whitespace-nowrap">
          <div className="grid grid-cols-[auto_1fr] items-center gap-3 px-1 mb-4">
            <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-gold-dark border border-gold/20 shrink-0">
              <UserCircle size={24} />
            </div>
            <div className="flex-1 min-w-0 transition-opacity duration-300 md:opacity-100 opacity-0 group-hover:opacity-100">
              <p className="text-sm font-bold truncate leading-none mb-1">
                {user?.name || "Usuário"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate opacity-80">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1 transition-opacity duration-300 md:opacity-100 opacity-0 group-hover:opacity-100">
            <div className="px-2 pb-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-gold/20 text-gold-dark font-black uppercase tracking-tighter">
                {user?.role}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-2 py-2 mt-1 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors font-medium whitespace-nowrap"
          >
            <LogOut size={18} className="shrink-0" /> <span className="hidden md:inline">Sair do sistema</span>
          </button>
        </div>
      </aside>
  ), [pathname, user, canDelegated, hasRole, handleLogout]);

  return (
    <div className="min-h-screen bg-background flex md:grid md:grid-cols-[16rem_1fr]">
      {/* Spacer para o menu absolute no mobile */}
      <div className="w-16 md:hidden flex-shrink-0" />

      {sidebar}

      <main className="flex-1 overflow-auto relative bg-[#fafafa] w-full min-w-0">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto min-h-full">{children}</div>
      </main>
    </div>
  );
}

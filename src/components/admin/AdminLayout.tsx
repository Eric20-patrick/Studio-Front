import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  LogOut,
  ClipboardList,
} from "lucide-react";

export default function AdminLayout() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive
        ? "bg-gold/15 text-gold-dark font-semibold"
        : "text-foreground/70 hover:bg-muted"
    }`;

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-60 bg-card border-r border-border flex flex-col">
        <div className="p-5 border-b border-border">
          <Link to="/admin" className="font-display font-bold text-lg">
            Studio Neo
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">
            Painel administrativo
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {hasRole("ADMIN") && (
            <NavLink to="/admin" end className={linkClass}>
              <LayoutDashboard size={16} /> Dashboard
            </NavLink>
          )}
          <NavLink to="/admin/recepcao" className={linkClass}>
            <ClipboardList size={16} /> Fila do dia
          </NavLink>
          <NavLink to="/admin/agendamentos" className={linkClass}>
            <Calendar size={16} /> Agendamentos
          </NavLink>
          {hasRole("ADMIN") && (
            <>
              <NavLink to="/admin/profissionais" className={linkClass}>
                <Users size={16} /> Profissionais
              </NavLink>
              <NavLink to="/admin/procedimentos" className={linkClass}>
                <Scissors size={16} /> Procedimentos
              </NavLink>
            </>
          )}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-[10px] text-muted-foreground">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-gold/20 text-gold-dark font-bold">
              {user?.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

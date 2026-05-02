import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
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

export default function AdminLayout() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
      isActive
        ? "bg-gold/15 text-gold-dark font-semibold shadow-sm"
        : "text-foreground/70 hover:bg-muted hover:text-foreground"
    }`;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-border">
          <Link
            to="/admin"
            className="font-display font-bold text-xl tracking-tight flex items-center gap-2"
          >
            <div className="w-2 h-6 bg-gold rounded-full" />
            Studio Neo
          </Link>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mt-1 opacity-70">
            Painel de Gestão
          </p>
        </div>

        {/* Navegação Principal */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {hasRole("ADMIN") && (
            <NavLink to="/admin" end className={linkClass}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
          )}

          <NavLink to="/admin/recepcao" className={linkClass}>
            <ClipboardList size={18} /> Fila do dia
          </NavLink>

          <NavLink to="/admin/agendamentos" className={linkClass}>
            <Calendar size={18} /> Agendamentos
          </NavLink>

          {hasRole("ADMIN") && (
            <>
              <div className="pt-4 pb-2 px-3">
                <p className="text-[10px] font-bold uppercase text-muted-foreground/50 tracking-tighter">
                  Configurações
                </p>
              </div>
              <NavLink to="/admin/profissionais" className={linkClass}>
                <Users size={18} /> Profissionais
              </NavLink>
              <NavLink to="/admin/procedimentos" className={linkClass}>
                <Scissors size={18} /> Procedimentos
              </NavLink>
            </>
          )}
        </nav>

        {/* Rodapé da Sidebar - Usuário */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-gold-dark border border-gold/20">
              <UserCircle size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate leading-none mb-1">
                {user?.name || "Usuário"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate opacity-80">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="px-2 pb-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-gold/20 text-gold-dark font-black uppercase tracking-tighter">
                {user?.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors font-medium"
            >
              <LogOut size={16} /> Sair do sistema
            </button>
          </div>
        </div>
      </aside>

      {/* Área de Conteúdo */}
      <main className="flex-1 overflow-auto relative bg-[#fafafa]">
        {/* Background sutil para dar contraste com os cards brancos */}
        <div className="p-6 lg:p-10 max-w-7xl mx-auto min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import {
  getAdminDashboard,
  AdminDashboardData,
} from "@/services/dashboardService";
import { Loader2, TrendingUp, Calendar, Users, Scissors } from "lucide-react";

const FILTERS = [
  { id: "day", label: "Dia" },
  { id: "week", label: "Semana" },
  { id: "month", label: "Mês" },
  { id: "year", label: "Ano" },
] as const;

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [filter, setFilter] = useState<"day" | "week" | "month" | "year">(
    "month",
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Dashboard | Studio Neo Admin";
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    // O seu back espera 'revenueFilter' via query param (verifique se seu service passa assim)
    getAdminDashboard(filter)
      .then((res: any) => {
        if (isMounted) {
          // IMPORTANTE: Seu back encapsula tudo em .data
          const dashboardData = res.data || res;
          console.log("Back-end Payload:", dashboardData);
          setData(dashboardData);
        }
      })
      .catch((e) => {
        if (isMounted) setError(e?.message || "Erro ao carregar dashboard");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filter]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-gold" />
      </div>
    );

  if (error)
    return <p className="text-destructive text-center py-12">{error}</p>;
  if (!data) return null;

  // --- MAPEAMENTO SEGURO DOS DADOS DO SEU BACKEND ---
  const revenue = data.revenue || {};
  const summary = data.summary || {};
  const proceduresList = Array.isArray(data.topProcedures)
    ? data.topProcedures
    : [];
  const professionalsList = Array.isArray(data.topProfessionals)
    ? data.topProfessionals
    : [];

  return (
    <div className="space-y-6">
      {/* HEADER E FILTROS */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-display font-bold text-on-surface">
          Dashboard Admin
        </h1>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                filter === f.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* CARDS DE MÉTRICAS (REVENUE + SUMMARY) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<TrendingUp size={18} />}
          label="Faturamento"
          value={revenue.totalFormatted || "R$ 0,00"}
          sub={`${revenue.bookingCount || 0} agendamentos`}
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          label="Ticket Médio"
          value={revenue.averageTicketFormatted || "R$ 0,00"}
        />
        <StatCard
          icon={<Calendar size={18} />}
          label="Hoje"
          value={String(summary.bookings?.today ?? 0)}
          sub={`${summary.bookings?.month ?? 0} no mês`}
        />
        <StatCard
          icon={<Users size={18} />}
          label="Profissionais"
          value={String(summary.professionals ?? 0)}
          sub={`${summary.procedures ?? 0} procedimentos`}
        />
      </div>

      {/* RANKINGS (Onde estavam os erros de slice) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TOP PROCEDIMENTOS */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-display font-bold mb-4 flex items-center gap-2">
            <Scissors size={16} /> Top procedimentos
          </h3>
          <ul className="space-y-3">
            {proceduresList.length > 0 ? (
              proceduresList.slice(0, 5).map((tp: any, i: number) => (
                <li
                  key={tp.procedure?.id || i}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="truncate pr-2">
                    <span className="text-muted-foreground mr-2">{i + 1}.</span>
                    {tp.procedure?.name || "Serviço"}
                  </span>
                  <span className="text-xs text-gold-dark font-bold whitespace-nowrap">
                    {tp.count} • {tp.revenueFormatted}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-xs text-muted-foreground italic py-2">
                Sem procedimentos registrados
              </li>
            )}
          </ul>
        </div>

        {/* TOP PROFISSIONAIS */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-display font-bold mb-4 flex items-center gap-2">
            <Users size={16} /> Top profissionais
          </h3>
          <ul className="space-y-3">
            {professionalsList.length > 0 ? (
              professionalsList.slice(0, 5).map((tp: any, i: number) => (
                <li
                  key={tp.professional?.id || i}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="truncate pr-2">
                    <span className="text-muted-foreground mr-2">{i + 1}.</span>
                    {tp.professional?.name || "Profissional"}
                  </span>
                  <span className="text-xs text-gold-dark font-bold whitespace-nowrap">
                    {tp.totalAppointments || tp.count || 0} •{" "}
                    {tp.totalRevenueFormatted || tp.revenueFormatted}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-xs text-muted-foreground italic py-2">
                Sem profissionais ativos no período
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

// COMPONENTES AUXILIARES
function StatCard({ icon, label, value, sub }: any) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
        {icon}
        {label}
      </div>
      <p className="text-2xl font-display font-bold mt-2 text-on-surface">
        {value}
      </p>
      {sub && (
        <p className="text-[10px] text-muted-foreground mt-1 font-medium">
          {sub}
        </p>
      )}
    </div>
  );
}

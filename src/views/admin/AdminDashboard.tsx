import { useCallback, useEffect, useState } from 'react';
import { getAdminDashboard } from '@/services/dashboardService';
import { downloadCompletedReport } from '@/services/reportExportService';
import { useAuth } from '@/hooks/useAuth';
import {
  Loader2,
  TrendingUp,
  Calendar,
  Users,
  Scissors,
  RefreshCw,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { showApiErrorToast } from '@/utils/apiErrors';

const FILTERS = [
  { id: 'day', label: 'Dia' },
  { id: 'week', label: 'Semana' },
  { id: 'month', label: 'Mês' },
  { id: 'year', label: 'Ano' },
] as const;

export default function AdminDashboard() {
  const { canDelegated } = useAuth();
  const [data, setData] = useState<any>(null);
  const [filter, setFilter] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const now = new Date();
  const [repYear, setRepYear] = useState(now.getFullYear());
  const [repMonth, setRepMonth] = useState(now.getMonth() + 1);
  const [repDay, setRepDay] = useState('');
  const [expBusy, setExpBusy] = useState<'pdf' | 'xlsx' | null>(null);

  useEffect(() => {
    document.title = 'Dashboard | Studio Neo Admin';
  }, []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAdminDashboard(filter);
      const dashboardData = (res as { data?: unknown }).data ?? res;
      setData(dashboardData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-gold" />
      </div>
    );

  if (error) return <p className="text-destructive text-center py-12">{error}</p>;
  if (!data) return null;

  // --- MAPEAMENTO SEGURO DOS DADOS DO SEU BACKEND ---
  const revenue = data.revenue || {};
  const summary = data.summary || {};
  const proceduresList = Array.isArray(data.topProcedures) ? data.topProcedures : [];
  const professionalsList = Array.isArray(data.topProfessionals) ? data.topProfessionals : [];

  const bookingCountDisplay =
    typeof revenue.bookingCount === 'object' && revenue.bookingCount !== null
      ? ((revenue.bookingCount as { _all?: number })._all ?? 0)
      : Number(revenue.bookingCount ?? 0);

  const runExport = async (format: 'pdf' | 'xlsx') => {
    setExpBusy(format);
    try {
      if (repDay && /^\d{4}-\d{2}-\d{2}$/.test(repDay)) {
        await downloadCompletedReport({ format, date: repDay });
      } else {
        await downloadCompletedReport({
          format,
          year: repYear,
          month: repMonth,
        });
      }
    } catch (e: unknown) {
      showApiErrorToast(e, 'Não foi possível exportar o relatório');
    } finally {
      setExpBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER E FILTROS */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-display font-bold text-black">Dashboard Admin</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadDashboard()}
            className="p-2 rounded-lg border border-border hover:bg-muted"
            title="Atualizar"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin text-gold' : ''} />
          </button>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  filter === f.id
                    ? 'bg-white text-black shadow-lg'
                    : 'text-muted-foreground hover:text-black'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CARDS DE MÉTRICAS (REVENUE + SUMMARY) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<TrendingUp size={18} />}
          label="Faturamento"
          value={revenue.totalFormatted || 'R$ 0,00'}
          sub={`${bookingCountDisplay} atendimentos concluídos`}
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          label="Ticket Médio"
          value={revenue.averageTicketFormatted || 'R$ 0,00'}
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
        <div className="bg-white border border-border rounded-xl p-5 shadow-lg">
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
                    {tp.procedure?.name || 'Serviço'}
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
        <div className="bg-white border border-border rounded-xl p-5 shadow-lg">
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
                    {tp.professional?.name || 'Profissional'}
                  </span>
                  <span className="text-xs text-gold-dark font-bold whitespace-nowrap">
                    {tp.totalAppointments || tp.count || 0} •{' '}
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

      {canDelegated('canExportReports') && (
        <div className="bg-white border border-border rounded-xl p-5 shadow-lg space-y-4">
          <h3 className="font-display font-bold flex items-center gap-2">
            <FileSpreadsheet size={18} /> Relatório de faturamento (concluídos)
          </h3>
          <p className="text-xs text-muted-foreground">
            Exporta apenas itens de agendamentos <strong>concluídos</strong> (comparecimento
            confirmado na fila). Use o mês inteiro ou um dia exato.
          </p>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Ano</label>
              <input
                type="number"
                min={2020}
                max={2100}
                value={repYear}
                onChange={(e) => setRepYear(Number(e.target.value))}
                className="w-24 px-3 py-2 rounded-lg border border-input bg-background text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Mês</label>
              <select
                value={repMonth}
                onChange={(e) => setRepMonth(Number(e.target.value))}
                className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {String(m).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                Dia exato (opcional)
              </label>
              <input
                type="date"
                value={repDay}
                onChange={(e) => setRepDay(e.target.value)}
                className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!!expBusy}
              onClick={() => runExport('xlsx')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted disabled:opacity-50"
            >
              <FileSpreadsheet size={16} />
              {expBusy === 'xlsx' ? 'Gerando…' : 'Baixar Excel'}
            </button>
            <button
              type="button"
              disabled={!!expBusy}
              onClick={() => runExport('pdf')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted disabled:opacity-50"
            >
              <FileText size={16} />
              {expBusy === 'pdf' ? 'Gerando…' : 'Baixar PDF'}
            </button>
            <button
              type="button"
              disabled={!!expBusy}
              onClick={() => {
                const lastMonthDate = new Date();
                lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
                const pYear = lastMonthDate.getFullYear();
                const pMonth = lastMonthDate.getMonth() + 1;
                
                setExpBusy('pdf');
                downloadCompletedReport({ format: 'pdf', year: pYear, month: pMonth })
                  .catch((e) => showApiErrorToast(e, 'Não foi possível exportar o relatório'))
                  .finally(() => setExpBusy(null));
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gold text-gold-dark bg-gold/10 text-sm font-medium hover:bg-gold/20 disabled:opacity-50 ml-auto"
              title="A dashboard zera os contadores no dia 01. Use este botão para baixar o resumo do mês que passou."
            >
              <FileText size={16} />
              Baixar Mês Passado
            </button>
            {repDay && (
              <button
                type="button"
                className="text-xs text-gold-dark hover:underline self-center"
                onClick={() => setRepDay('')}
              >
                Limpar dia (usar mês)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// COMPONENTES AUXILIARES
function StatCard({ icon, label, value, sub }: any) {
  return (
    <div className="bg-white border border-border rounded-xl p-5 shadow-lg">
      <div className="flex items-center gap-2 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
        {icon}
        {label}
      </div>
      <p className="text-2xl font-display font-bold mt-2 text-black">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-1 font-medium">{sub}</p>}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  listBookings,
  confirmBooking,
  cancelBooking,
  completeBooking,
} from '@/services/bookingService';
import { STALE_TIME_BOOKINGS } from '@/constants/queryCache';
import { Booking, BookingStatus, Professional } from '@/types';
import { getProfessionals } from '@/services/professionalService';
import { Loader2, Check, X, MessageCircle, RefreshCw, Search } from 'lucide-react';
import { formatTimeFromIso, formatCurrency } from '@/utils';
import {
  getFieldErrorsFromUnknown,
  showApiErrorToast,
  showValidationToast,
} from '@/utils/apiErrors';
import FinishBookingModal from '@/components/admin/FinishBookingModal';

const STATUSES: { id: BookingStatus | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'Todos' },
  { id: 'PENDING', label: 'Pendentes' },
  { id: 'CONFIRMED', label: 'Confirmados' },
  { id: 'COMPLETED', label: 'Concluídos' },
  { id: 'CANCELLED', label: 'Cancelados' },
];

export default function AdminBookings() {
  const [status, setStatus] = useState<BookingStatus | 'ALL'>('ALL');
  const [filterDate, setFilterDate] = useState('');
  const [filterProfessionalId, setFilterProfessionalId] = useState('');
  const [searchClient, setSearchClient] = useState('');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [page, setPage] = useState(1);
  const [actionId, setActionId] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelFormError, setCancelFormError] = useState('');
  const [finishTarget, setFinishTarget] = useState<string | null>(null);

  useEffect(() => {
    getProfessionals()
      .then(setProfessionals)
      .catch(() => {});
    document.title = 'Agendamentos | Studio Neo';
  }, []);

  const params = {
    page,
    limit: 20,
    status: status !== 'ALL' ? status : undefined,
    date: filterDate || undefined,
    professionalId: filterProfessionalId || undefined,
    search: searchClient || undefined,
  };

  const {
    data: queryData,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ['adminBookings', params],
    queryFn: async (): Promise<{ data: Booking[]; meta: { totalPages: number } }> => {
      const res: any = await listBookings(params);
      if (Array.isArray(res)) return { data: res as Booking[], meta: { totalPages: 1 } };
      return { data: (res.data || []) as Booking[], meta: res.meta || { totalPages: 1 } };
    },
    staleTime: STALE_TIME_BOOKINGS,
  });

  const error = queryError ? (queryError as Error).message : '';
  const bookingsList = queryData?.data || [];
  const meta = queryData?.meta || { totalPages: 1 };

  const refresh = refetch;

  const doAction = async (fn: () => Promise<unknown>, id: string) => {
    setActionId(id);
    try {
      await fn();
      refresh();
    } catch (e: unknown) {
      showApiErrorToast(e, 'Não foi possível realizar a ação');
    } finally {
      setActionId(null);
    }
  };

  const handleComplete = async (
    extraProcedureId?: string,
    extraProfessionalId?: string,
    discountPercentage?: number,
    extraProcedures?: { procedureId: string; professionalId?: string }[],
    paymentMethod?: string,
  ) => {
    if (!finishTarget) return;
    setActionId(finishTarget);
    try {
      await completeBooking(
        finishTarget,
        extraProcedureId,
        extraProfessionalId,
        discountPercentage,
        extraProcedures,
        paymentMethod,
      );
      setFinishTarget(null);
      refresh();
    } catch (e: unknown) {
      showApiErrorToast(e, 'Não foi possível concluir o atendimento');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-black">Agendamentos</h1>
        <button
          onClick={() => refresh()}
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin text-gold' : ''} />
        </button>
      </div>

      <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-border shadow-sm">
        <div className="flex flex-wrap gap-1 bg-muted rounded-lg p-1 w-full sm:w-fit">
          {STATUSES.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setStatus(s.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                status === s.id
                  ? 'bg-white text-black shadow-lg'
                  : 'text-muted-foreground hover:text-black'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col gap-1.5">
            <label className="text-muted-foreground text-xs font-bold uppercase tracking-tighter">
              Buscar Cliente
            </label>
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <input
                type="text"
                placeholder="Digite o nome..."
                value={searchClient}
                onChange={(e) => {
                  setSearchClient(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 ring-gold outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-booking-prof"
              className="text-muted-foreground text-xs font-bold uppercase tracking-tighter flex justify-between"
            >
              Profissional
              {filterProfessionalId && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterProfessionalId('');
                    setPage(1);
                  }}
                  className="text-[10px] text-gold-dark hover:underline lowercase font-medium"
                >
                  limpar
                </button>
              )}
            </label>
            <select
              id="admin-booking-prof"
              value={filterProfessionalId}
              onChange={(e) => {
                setFilterProfessionalId(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 ring-gold outline-none"
            >
              <option value="">Todos</option>
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-booking-date"
              className="text-muted-foreground text-xs font-bold uppercase tracking-tighter flex justify-between"
            >
              Dia do atendimento
              {filterDate && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterDate('');
                    setPage(1);
                  }}
                  className="text-[10px] text-gold-dark hover:underline lowercase font-medium"
                >
                  limpar
                </button>
              )}
            </label>
            <input
              id="admin-booking-date"
              type="date"
              value={filterDate}
              onChange={(e) => {
                setFilterDate(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 ring-gold outline-none"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-gold" size={32} />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive mb-2 font-medium">{error}</p>
          <button
            onClick={() => refresh()}
            className="text-sm underline text-muted-foreground hover:text-black"
          >
            Tentar novamente
          </button>
        </div>
      ) : bookingsList.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-xl border-muted">
          <p className="text-muted-foreground">Nenhum agendamento encontrado para este filtro.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {bookingsList.map((b) => (
              <BookingRow
                key={b.id}
                b={b}
                actionId={actionId}
                onConfirm={() => doAction(() => confirmBooking(b.id), b.id)}
                onComplete={() => setFinishTarget(b.id)} // 👈 Corrigido: repassando a ação do modal de conclusão
                onCancel={() => {
                  setCancelFormError('');
                  setCancelReason('');
                  setCancelTarget(b.id);
                }}
              />
            ))}
          </div>

          {meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm rounded-lg border bg-white shadow-lg hover:bg-muted transition-colors disabled:opacity-30"
              >
                Anterior
              </button>
              <span className="text-sm font-medium">
                Página {page} de {meta.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="px-4 py-2 text-sm rounded-lg border bg-white shadow-lg hover:bg-muted transition-colors disabled:opacity-30"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal de Cancelamento */}
      {cancelTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => {
            setCancelFormError('');
            setCancelTarget(null);
          }}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">Motivo do Cancelamento</h3>
            <textarea
              value={cancelReason}
              onChange={(e) => {
                setCancelFormError('');
                setCancelReason(e.target.value);
              }}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:ring-2 ring-gold outline-none resize-none"
              placeholder="Descreva o motivo para o cliente saber por que foi cancelado..."
            />
            {cancelFormError && <p className="text-sm text-destructive mt-2">{cancelFormError}</p>}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setCancelFormError('');
                  setCancelTarget(null);
                }}
                className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={async () => {
                  setCancelFormError('');
                  if (cancelReason.trim().length < 5) {
                    setCancelFormError('Por favor, digite um motivo com pelo menos 5 caracteres.');
                    return;
                  }
                  const id = cancelTarget!;
                  setActionId(id);
                  try {
                    await cancelBooking(id, cancelReason.trim());
                    setCancelTarget(null);
                    setCancelReason('');
                    refresh();
                  } catch (e: unknown) {
                    const details = getFieldErrorsFromUnknown(e);
                    if (details && Object.keys(details).length > 0) {
                      const r = details.reason?.[0];
                      if (r) setCancelFormError(r);
                      showValidationToast('Não foi possível cancelar', details);
                    } else {
                      showApiErrorToast(e, 'Não foi possível cancelar');
                    }
                  } finally {
                    setActionId(null);
                  }
                }}
                disabled={actionId === cancelTarget}
                className="px-4 py-2 text-sm font-bold rounded-lg bg-destructive text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}

      {finishTarget && bookingsList.find((b) => b.id === finishTarget) && (
        <FinishBookingModal
          booking={bookingsList.find((b) => b.id === finishTarget) as any}
          onConfirm={handleComplete}
          onClose={() => setFinishTarget(null)}
        />
      )}
    </div>
  );
}

function bookingCalendarDaySp(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-CA', {
    timeZone: 'America/Sao_Paulo',
  });
}

interface BookingRowProps {
  b: Booking;
  actionId: string | null;
  onConfirm: () => void;
  onComplete: () => void; // 👈 Mapeado corretamente na interface
  onCancel: () => void;
}

function BookingRow({ b, actionId, onConfirm, onComplete, onCancel }: BookingRowProps) {
  const phoneDigits = b.clientPhone?.replace(/\D/g, '') || '';
  const firstStart = b.items?.[0]?.startTime as string | undefined;
  const todaySp = new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Sao_Paulo',
  });
  const allowComplete = !!firstStart && bookingCalendarDaySp(firstStart) === todaySp;

  const formatAdminDate = (isoString: string) => {
    if (!isoString) return '--/--/----';
    try {
      const d = new Date(isoString);
      if (Number.isNaN(d.getTime())) return '--/--/----';
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'America/Sao_Paulo',
      });
    } catch {
      return '--/--/----';
    }
  };

  return (
    <div className="bg-white shadow-lg border rounded-xl p-5 hover:shadow-xl transition-all border-border/50 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-bold text-base text-black group-hover:text-gold-dark transition-colors">
            {b.clientName}
          </p>
          <div className="flex flex-col gap-0.5 mt-1">
            <a
              href={`https://wa.me/55${phoneDigits}`}
              target="_blank"
              className="text-xs text-emerald-600 flex items-center gap-1 hover:underline font-semibold"
            >
              <MessageCircle size={14} /> {b.clientPhone}
            </a>
            <p className="text-[11px] text-muted-foreground">{b.clientEmail}</p>
            {b.observations ? (
              <p className="text-[11px] text-black/90 mt-1.5 border-l-2 border-gold pl-2">
                <span className="font-semibold">Observações:</span> {b.observations}
              </p>
            ) : null}
            {b.status === 'CANCELLED' && b.cancellationReason ? (
              <p className="text-[11px] text-destructive mt-1">
                <span className="font-semibold">Cancelado:</span> {b.cancellationReason}
              </p>
            ) : null}
          </div>
        </div>
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-lg ${
            b.status === 'PENDING'
              ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
              : b.status === 'CONFIRMED'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : b.status === 'COMPLETED'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-red-100 text-red-700 border border-red-200'
          }`}
        >
          {b.status}
        </span>
      </div>

      <div className="bg-muted/30 rounded-lg p-3 space-y-2 mb-4 border border-border/40">
        {b.items?.map((it, i: number) => (
          <div
            key={i}
            className="text-xs flex justify-between border-b border-border/30 last:border-0 pb-1.5 last:pb-0"
          >
            <div>
              <p className="font-bold text-black/90">{it.procedure?.name || 'Serviço'}</p>
              <p className="text-[10px] text-muted-foreground font-medium">
                Profissional: {it.professional?.name || 'Qualquer disponível'}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">{formatAdminDate(it.startTime)}</p>
              <p className="font-black text-gold-dark text-[13px]">
                {formatTimeFromIso(it.startTime)}
              </p>
            </div>
          </div>
        ))}
        {b.status === 'COMPLETED' && (
          <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
            <p className="mb-0.5">
              <span className="font-semibold text-black">Forma de Pagamento:</span>{' '}
              {b.paymentMethod || 'Não informado'}
            </p>
            <p>
              <span className="font-semibold text-black">Concluído em:</span>{' '}
              {b.completedAt ? new Date(b.completedAt).toLocaleString('pt-BR') : 'Não informado'}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex flex-col">
          <span className="text-[9px] text-muted-foreground uppercase font-bold">
            {b.status === 'COMPLETED' ? 'Total recebido' : 'Total a receber'}
          </span>
          <p className="font-bold text-lg text-gold-dark leading-tight">
            {b.totalAmountFormatted || formatCurrency(b.totalAmount)}
          </p>
          {b.discountAmount ? (
            <p className="text-[10px] text-green-600 font-medium mt-0.5">
              Desconto: {b.discountPercentage}% (- {formatCurrency(b.discountAmount)})
            </p>
          ) : null}
        </div>

        <div className="flex gap-2">
          {b.status === 'PENDING' && (
            <>
              <button
                disabled={actionId === b.id}
                onClick={onConfirm}
                title="Confirmar Agendamento"
                className="p-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                <Check size={18} strokeWidth={3} />
              </button>
              <button
                disabled={actionId === b.id}
                onClick={onCancel}
                title="Recusar/Cancelar"
                className="p-2.5 bg-destructive text-white rounded-lg hover:bg-destructive/90 shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                <X size={18} strokeWidth={3} />
              </button>
            </>
          )}

          {b.status === 'CONFIRMED' && (
            <>
              {/* 🚀 Corrigido: Agora sim o allowComplete exibe e usa o onComplete de verdade! */}
              {allowComplete && (
                <button
                  disabled={actionId === b.id}
                  onClick={onComplete}
                  title="Concluir Atendimento"
                  className="px-3 py-2 bg-gold hover:bg-gold-dark text-black font-bold text-xs rounded-lg shadow transition-all active:scale-95 disabled:opacity-50"
                >
                  Concluir
                </button>
              )}
              <button
                disabled={actionId === b.id}
                onClick={onCancel}
                title="Cancelar Confirmado"
                className="p-2.5 border border-destructive text-destructive rounded-lg hover:bg-destructive/5 transition-all"
              >
                <X size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

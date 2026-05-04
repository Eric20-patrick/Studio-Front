import { useEffect, useState, useCallback } from 'react';
import {
  listBookings,
  confirmBooking,
  cancelBooking,
  completeBooking,
} from '@/services/bookingService';
import { Booking, BookingStatus } from '@/types';
import { Loader2, Check, X, CheckCheck, MessageCircle, RefreshCw } from 'lucide-react';
import { formatTimeFromIso, formatCurrency } from '@/utils';
import {
  getFieldErrorsFromUnknown,
  showApiErrorToast,
  showValidationToast,
} from '@/utils/apiErrors';

const STATUSES: { id: BookingStatus | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'Todos' },
  { id: 'PENDING', label: 'Pendentes' },
  { id: 'CONFIRMED', label: 'Confirmados' },
  { id: 'COMPLETED', label: 'Concluídos' },
  { id: 'CANCELLED', label: 'Cancelados' },
];

export default function AdminBookings() {
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [meta, setMeta] = useState({ totalPages: 1 });
  const [status, setStatus] = useState<BookingStatus | 'ALL'>('ALL');
  const [filterDate, setFilterDate] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelFormError, setCancelFormError] = useState('');

  useEffect(() => {
    document.title = 'Agendamentos | Studio Neo';
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    setError('');

    const params: Record<string, unknown> = { page, limit: 20 };
    if (status !== 'ALL') params.status = status;
    if (filterDate) params.date = filterDate;

    listBookings(params)
      .then((res: any) => {
        if (Array.isArray(res)) {
          setBookingsList(res);
          setMeta({ totalPages: 1 });
        } else if (res && res.data) {
          setBookingsList(res.data);
          setMeta(res.meta || { totalPages: 1 });
        } else {
          setBookingsList([]);
        }
      })
      .catch((e) => {
        setError(e?.message || 'Erro ao carregar agendamentos');
      })
      .finally(() => setLoading(false));
  }, [status, page, filterDate]);

  useEffect(() => {
    refresh();
  }, [refresh]);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-black">Agendamentos</h1>
        <button onClick={refresh} className="p-2 hover:bg-muted rounded-full transition-colors">
          <RefreshCw size={20} className={loading ? 'animate-spin text-gold' : ''} />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit overflow-x-auto">
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
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="admin-booking-date" className="text-muted-foreground whitespace-nowrap">
            Dia do atendimento
          </label>
          <input
            id="admin-booking-date"
            type="date"
            value={filterDate}
            onChange={(e) => {
              setFilterDate(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
          />
          {filterDate && (
            <button
              type="button"
              onClick={() => {
                setFilterDate('');
                setPage(1);
              }}
              className="text-xs text-gold-dark hover:underline"
            >
              Limpar
            </button>
          )}
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
            onClick={refresh}
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
                onComplete={() => doAction(() => completeBooking(b.id), b.id)}
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
    </div>
  );
}

function bookingCalendarDaySp(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-CA', {
    timeZone: 'America/Sao_Paulo',
  });
}

function BookingRow({ b, actionId, onConfirm, onComplete, onCancel }: any) {
  const phoneDigits = b.clientPhone?.replace(/\D/g, '') || '';
  const firstStart = b.items?.[0]?.startTime as string | undefined;
  const todaySp = new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Sao_Paulo',
  });
  const allowComplete = !!firstStart && bookingCalendarDaySp(firstStart) === todaySp;

  // Mesmo instante que o e-mail (Intl em America/Sao_Paulo), não a parte da data em UTC
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
        {b.items?.map((it: any, i: number) => (
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
              {/* Aqui está a exibição corrigida que não muda o dia */}
              <p className="font-medium">{formatAdminDate(it.startTime)}</p>
              <p className="font-black text-gold-dark text-[13px]">
                {formatTimeFromIso(it.startTime)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex flex-col">
          <span className="text-[9px] text-muted-foreground uppercase font-bold">
            Total a receber
          </span>
          <p className="font-bold text-lg text-gold-dark leading-tight">
            {b.totalAmountFormatted || formatCurrency(b.totalAmount)}
          </p>
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

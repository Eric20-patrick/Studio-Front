import { useEffect, useState } from "react";
import {
  getReceptionDashboard,
  ReceptionDashboardData,
} from "@/services/dashboardService";
import {
  confirmBooking,
  cancelBooking,
  completeBooking,
} from "@/services/bookingService";
import { Loader2, MessageCircle, Check, X, CheckCheck } from "lucide-react";
import { formatTimeFromIso, toIsoDate } from "@/utils";

export default function ReceptionDashboard() {
  const [data, setData] = useState<ReceptionDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [date, setDate] = useState(toIsoDate(new Date()));
  const [actionId, setActionId] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    document.title = "Fila do dia | Studio Neo";
  }, []);

  const refresh = () => {
    setLoading(true);
    setError("");
    getReceptionDashboard(date)
      .then(setData)
      .catch((e) => setError(e?.message || "Erro ao carregar agenda"))
      .finally(() => setLoading(false));
  };
  useEffect(refresh, [date]);

  const handleConfirm = async (id: string) => {
    setActionId(id);
    try {
      await confirmBooking(id);
      refresh();
    } catch (e: any) {
      alert(e?.message);
    } finally {
      setActionId(null);
    }
  };
  const handleComplete = async (id: string) => {
    setActionId(id);
    try {
      await completeBooking(id);
      refresh();
    } catch (e: any) {
      alert(e?.message);
    } finally {
      setActionId(null);
    }
  };
  const handleCancel = async () => {
    if (!cancelTarget || cancelReason.trim().length < 5) {
      alert("Motivo precisa ter pelo menos 5 caracteres");
      return;
    }
    setActionId(cancelTarget);
    try {
      await cancelBooking(cancelTarget, cancelReason.trim());
      setCancelTarget(null);
      setCancelReason("");
      refresh();
    } catch (e: any) {
      alert(e?.message);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-display font-bold">Fila do dia</h1>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-gold" />
        </div>
      ) : error ? (
        <p className="text-destructive text-center py-12">{error}</p>
      ) : (
        data && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Mini label="Total" value={data.summary.total} />
              <Mini
                label="Pendentes"
                value={data.summary.pending}
                color="text-yellow-700"
              />
              <Mini
                label="Confirmados"
                value={data.summary.confirmed}
                color="text-blue-700"
              />
              <Mini
                label="Receita prevista"
                value={data.summary.expectedRevenueFormatted}
              />
            </div>

            {data.bookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                Nenhum agendamento para este dia.
              </p>
            ) : (
              <div className="space-y-3">
                {data.bookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-card border border-border rounded-xl p-5"
                  >
                    <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                      <div>
                        <p className="font-display font-bold">
                          {b.client.name}
                        </p>
                        <a
                          href={b.client.whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gold-dark inline-flex items-center gap-1 hover:underline"
                        >
                          <MessageCircle size={12} /> {b.client.phoneFormatted}
                        </a>
                        {b.client.email && (
                          <p className="text-xs text-muted-foreground">
                            {b.client.email}
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          b.status === "PENDING"
                            ? "bg-yellow-500/15 text-yellow-700"
                            : b.status === "CONFIRMED"
                              ? "bg-blue-500/15 text-blue-700"
                              : b.status === "COMPLETED"
                                ? "bg-emerald-500/15 text-emerald-700"
                                : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 mb-4">
                      {b.items.map((it, i) => (
                        <div
                          key={i}
                          className="text-sm flex items-center justify-between border-b border-border/50 pb-1.5 last:border-0"
                        >
                          <div>
                            <span className="font-medium">
                              {it.procedure.name}
                            </span>
                            <span className="text-muted-foreground">
                              {" "}
                              • {it.professional.name}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatTimeFromIso(it.startTime)}–
                            {formatTimeFromIso(it.endTime)}
                            {it.amountChargedFormatted && (
                              <span className="ml-2 text-gold-dark font-semibold">
                                {it.amountChargedFormatted}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p className="text-sm font-bold text-gold-dark">
                        Total: {b.totalAmountFormatted}
                      </p>
                      <div className="flex gap-2">
                        {b.status === "PENDING" && (
                          <>
                            <button
                              disabled={actionId === b.id}
                              onClick={() => handleConfirm(b.id)}
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 inline-flex items-center gap-1"
                            >
                              <Check size={12} /> Confirmar
                            </button>
                            <button
                              disabled={actionId === b.id}
                              onClick={() => setCancelTarget(b.id)}
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-destructive text-white hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-1"
                            >
                              <X size={12} /> Recusar
                            </button>
                          </>
                        )}
                        {b.status === "CONFIRMED" && (
                          <>
                            <button
                              disabled={actionId === b.id}
                              onClick={() => handleComplete(b.id)}
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-foreground text-background hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-1"
                            >
                              <CheckCheck size={12} /> Concluir
                            </button>
                            <button
                              disabled={actionId === b.id}
                              onClick={() => setCancelTarget(b.id)}
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-destructive text-white hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-1"
                            >
                              <X size={12} /> Cancelar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )
      )}

      {cancelTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm"
          onClick={() => setCancelTarget(null)}
        >
          <div
            className="bg-card rounded-xl p-6 w-full max-w-md space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-bold">Motivo do cancelamento</h3>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={4}
              minLength={5}
              maxLength={500}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 ring-gold resize-none"
              placeholder="Explique o motivo (mínimo 5 caracteres)"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setCancelTarget(null);
                  setCancelReason("");
                }}
                className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted"
              >
                Voltar
              </button>
              <button
                onClick={handleCancel}
                disabled={
                  cancelReason.trim().length < 5 || actionId === cancelTarget
                }
                className="px-4 py-2 text-sm rounded-lg bg-destructive text-white disabled:opacity-50"
              >
                Confirmar cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Mini({
  label,
  value,
  color = "",
}: {
  label: string;
  value: number | string;
  color?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

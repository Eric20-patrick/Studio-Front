import { useState } from "react";
import { useBooking } from "@/hooks/useBooking";
import { createBooking } from "@/services/bookingService";
import { formatPhone, formatDate, formatTimeFromIso } from "@/utils";
import { Loader2 } from "lucide-react";

export default function StepUserData() {
  const { state, dispatch } = useBooking();
  const [error, setError] = useState("");

  const phoneDigits = state.form.phone.replace(/\D/g, "");
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.form.email.trim());

  const canSubmit =
    state.form.name.trim().length > 0 &&
    phoneDigits.length >= 10 &&
    emailValid &&
    state.form.items.length > 0;

  const handleSubmit = async () => {
    setError("");
    if (!canSubmit) return;
    if (!navigator.onLine) {
      setError(
        "Sem conexão com a internet. Verifique sua rede e tente novamente.",
      );
      return;
    }
    dispatch({ type: "SET_SUBMITTING", payload: true });
    try {
      await createBooking({
        clientName: state.form.name.trim(),
        clientPhone: phoneDigits,
        clientEmail: state.form.email.trim(),
        observations: state.form.observations.trim() || undefined,
        items: state.form.items.map((it) => ({
          procedureId: it.procedure.id,
          professionalId: it.noPreference ? undefined : it.professionalId,
          date: it.date,
          period: it.period,
          startTime: it.startTime,
        })),
      });
      dispatch({ type: "SET_SUCCESS" });
    } catch (e: any) {
      setError(e?.message || "Erro ao enviar agendamento. Tente novamente.");
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="bg-muted rounded-xl p-4 space-y-2 text-sm">
        <h4 className="font-display font-bold mb-3">Resumo do Agendamento</h4>
        {state.form.items.map((it) => (
          <div
            key={it.procedure.id}
            className="border-b border-border/50 last:border-0 pb-2 last:pb-0"
          >
            <p className="font-medium">{it.procedure.name}</p>
            <p className="text-xs text-muted-foreground">
              📅 {formatDate(it.date)}
              {it.startTime && ` • ⏰ ${formatTimeFromIso(it.startTime)}`}
            </p>
            <p className="text-xs text-muted-foreground">
              💇 {it.noPreference ? "Sem preferência" : it.professionalName}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Nome *</label>
          <input
            type="text"
            value={state.form.name}
            onChange={(e) =>
              dispatch({ type: "SET_NAME", payload: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 ring-gold"
            placeholder="Seu nome completo"
            maxLength={100}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Telefone *</label>
          <input
            type="tel"
            value={state.form.phone}
            onChange={(e) =>
              dispatch({
                type: "SET_PHONE",
                payload: formatPhone(e.target.value),
              })
            }
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 ring-gold"
            placeholder="(11) 99999-9999"
            maxLength={15}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">E-mail *</label>
          <input
            type="email"
            value={state.form.email}
            onChange={(e) =>
              dispatch({ type: "SET_EMAIL", payload: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 ring-gold"
            placeholder="seu@email.com"
            maxLength={150}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Usado para enviar a confirmação do agendamento.
          </p>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Observações</label>
          <textarea
            value={state.form.observations}
            onChange={(e) =>
              dispatch({ type: "SET_OBSERVATIONS", payload: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 ring-gold resize-none"
            rows={3}
            placeholder="Alguma observação especial?"
            maxLength={500}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Cancelamentos devem ser feitos com até 2h de antecedência via WhatsApp.
      </p>

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={!canSubmit || state.isSubmitting}
        className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state.isSubmitting && <Loader2 size={16} className="animate-spin" />}
        {state.isSubmitting ? "Enviando..." : "Enviar Agendamento"}
      </button>
    </div>
  );
}

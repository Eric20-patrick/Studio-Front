import { useState } from "react";
import { useBooking } from "@/hooks/useBooking";
import { createBooking } from "@/services/bookingService";
import { formatPhone, formatDate, formatTimeFromIso } from "@/utils";
import { Loader2, XCircle } from "lucide-react";
import {
  getFieldErrorsFromUnknown,
  collapseFieldErrors,
  showValidationToast,
} from "@/utils/apiErrors";

export default function StepUserData() {
  const { state, dispatch } = useBooking();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const phoneDigits = state.form.phone.replace(/\D/g, "");
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.form.email.trim());

  const canSubmit =
    state.form.name.trim().length > 0 &&
    phoneDigits.length >= 10 &&
    emailValid &&
    state.form.items.length > 0 &&
    state.form.marketingConsent;

  const handleSubmit = async () => {
    setError("");
    setFieldErrors({});
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
        items: state.form.items
          .filter((it) => it.startTime) // Apenas itens com horário selecionado
          .map((it) => ({
            procedureId: it.procedure.id,
            professionalId: it.noPreference ? undefined : it.professionalId,
            date: it.date,
            period: it.period,
            startTime: it.startTime,
          })),
        marketingConsent: state.form.marketingConsent,
      });
      dispatch({ type: "SET_SUCCESS" });
    } catch (e: unknown) {
      const details = getFieldErrorsFromUnknown(e);
      if (details && Object.keys(details).length > 0) {
        setFieldErrors(collapseFieldErrors(details));
        showValidationToast("Não foi possível concluir o agendamento", details);
        setError("");
      } else {
        setFieldErrors({});
        setError(
          e instanceof Error
            ? e.message
            : "Erro ao enviar agendamento. Tente novamente.",
        );
      }
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="bg-muted rounded-xl p-4 space-y-2 text-sm">
        <h4 className="font-display font-bold mb-3">Resumo do Agendamento</h4>
        {state.form.items
          .filter((it) => it.startTime) // Apenas itens com horário selecionado
          .map((it) => (
            <div
              key={it.procedure.id}
              className="border-b border-border/50 last:border-0 pb-2 last:pb-0"
            >
              <p className="font-medium">{it.procedure.name}</p>
              <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-1">
                <span>📅 {formatDate(it.date)}</span>
                <span>• ⏰ {formatTimeFromIso(it.startTime!)}</span>
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {it.noPreference ? (
                  <span>💇 Sem preferência</span>
                ) : it.professionalName ? (
                  <span>💇 {it.professionalName}</span>
                ) : null}
              </p>
            </div>
          ))}
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium mb-1 flex items-center gap-1">
            Nome *
            {!state.form.name.trim() && (
              <XCircle className="text-destructive" size={14} aria-label="Obrigatório" />
            )}
          </label>
          <input
            type="text"
            value={state.form.name}
            onChange={(e) => {
              setFieldErrors((p) => {
                const n = { ...p };
                delete n.clientName;
                return n;
              });
              dispatch({ type: "SET_NAME", payload: e.target.value });
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 ring-gold"
            placeholder="Seu nome completo"
            maxLength={100}
          />
          {fieldErrors.clientName && (
            <p className="text-xs text-destructive mt-1">{fieldErrors.clientName}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium mb-1 flex items-center gap-1">
            Telefone *
            {phoneDigits.length < 10 && (
              <XCircle className="text-destructive" size={14} aria-label="Inválido" />
            )}
          </label>
          <input
            type="tel"
            value={state.form.phone}
            onChange={(e) => {
              setFieldErrors((p) => {
                const n = { ...p };
                delete n.clientPhone;
                return n;
              });
              dispatch({
                type: "SET_PHONE",
                payload: formatPhone(e.target.value),
              });
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 ring-gold"
            placeholder="(11) 99999-9999"
            maxLength={15}
          />
          {fieldErrors.clientPhone && (
            <p className="text-xs text-destructive mt-1">{fieldErrors.clientPhone}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium mb-1 flex items-center gap-1">
            E-mail *
            {!emailValid && (
              <XCircle className="text-destructive" size={14} aria-label="Inválido" />
            )}
          </label>
          <input
            type="email"
            value={state.form.email}
            onChange={(e) => {
              setFieldErrors((p) => {
                const n = { ...p };
                delete n.clientEmail;
                return n;
              });
              dispatch({ type: "SET_EMAIL", payload: e.target.value });
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 ring-gold"
            placeholder="seu@email.com"
            maxLength={150}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Usado para enviar a confirmação do agendamento.
          </p>
          {fieldErrors.clientEmail && (
            <p className="text-xs text-destructive mt-1">{fieldErrors.clientEmail}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Observações</label>
          <textarea
            value={state.form.observations}
            onChange={(e) => {
              setFieldErrors((p) => {
                const n = { ...p };
                delete n.observations;
                return n;
              });
              dispatch({ type: "SET_OBSERVATIONS", payload: e.target.value });
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 ring-gold resize-none"
            rows={3}
            placeholder="Alguma observação especial?"
            maxLength={500}
          />
          {fieldErrors.observations && (
            <p className="text-xs text-destructive mt-1">{fieldErrors.observations}</p>
          )}
        </div>

        <div className="flex items-start gap-2 bg-muted/50 p-3 rounded-lg border border-border">
          <input
            type="checkbox"
            id="marketingConsent"
            checked={state.form.marketingConsent}
            onChange={(e) => dispatch({ type: "SET_CONSENT", payload: e.target.checked })}
            className="mt-1 h-4 w-4 rounded border-input bg-background text-gold focus:ring-gold"
          />
          <label htmlFor="marketingConsent" className="text-xs text-muted-foreground leading-tight">
            * Concordo que o Salão de Beleza armazene meus dados para este agendamento e aceito receber comunicações e ofertas sobre os serviços por e-mail ou WhatsApp, conforme a LGPD.
          </label>
        </div>
      </div>

      {fieldErrors.items && (
        <p className="text-sm text-destructive text-center bg-destructive/10 rounded-lg px-3 py-2">
          {fieldErrors.items}
        </p>
      )}

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


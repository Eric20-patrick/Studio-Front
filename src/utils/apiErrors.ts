import { ApiError } from "@/services/api";
import { toast } from "sonner";

export type FieldErrorMap = Record<string, string[] | undefined>;

/** Extrai `details` de respostas `{ success: false, details?: Record<string, string[]> }` */
export function getFieldErrorsFromUnknown(err: unknown): FieldErrorMap | null {
  if (!(err instanceof ApiError) || err.data == null || typeof err.data !== "object") {
    return null;
  }
  const d = err.data as Record<string, unknown>;
  const details = d.details;
  if (details == null || typeof details !== "object" || Array.isArray(details)) {
    return null;
  }
  return details as FieldErrorMap;
}

/** Agrupa erros Zod por primeiro segmento do path (ex.: `workingHours.0.startTime` → `workingHours`) */
export function collapseFieldErrors(details: FieldErrorMap): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [path, msgs] of Object.entries(details)) {
    if (!msgs?.length) continue;
    const top = path.split(".")[0];
    const line = msgs.filter(Boolean).join(" ");
    if (!out[top]) out[top] = line;
    else if (!out[top].includes(line)) out[top] = `${out[top]} · ${line}`;
  }
  return out;
}

const PATH_LABELS: Record<string, string> = {
  name: "Nome",
  avatarUrl: "Foto",
  email: "E-mail",
  phone: "Telefone",
  specialties: "Especialidades",
  workingHours: "Horários de trabalho",
  weekDay: "Dia da semana",
  startTime: "Horário de início",
  endTime: "Horário de término",
  category: "Categoria",
  description: "Descrição",
  duration: "Duração",
  interval: "Intervalo",
  price: "Preço",
  clientName: "Nome",
  clientPhone: "Telefone",
  clientEmail: "E-mail",
  observations: "Observações",
  items: "Serviços agendados",
  procedureId: "Procedimento",
  professionalId: "Profissional",
  date: "Data",
  period: "Período",
  password: "Senha",
  reason: "Motivo do cancelamento",
  delegatedPermissions: "Permissões",
};

function friendlyPath(path: string): string {
  return path
    .split(".")
    .map((seg) => (/^\d+$/.test(seg) ? `#${Number(seg) + 1}` : PATH_LABELS[seg] || seg))
    .join(" → ");
}

/** Lista legível para toasts / caixas de erro */
export function formatValidationLines(details: FieldErrorMap): string[] {
  const lines: string[] = [];
  for (const [path, msgs] of Object.entries(details)) {
    if (!msgs?.length) continue;
    const label = friendlyPath(path);
    for (const m of msgs) {
      if (m) lines.push(`${label}: ${m}`);
    }
  }
  return lines;
}

export function showValidationToast(
  title: string,
  details: FieldErrorMap,
  duration = 7000,
): void {
  const lines = formatValidationLines(details);
  toast.error(title, {
    description: lines.length ? lines.join("\n") : undefined,
    duration,
  });
}

/** Toast genérico: usa `details` se existir, senão a mensagem da ApiError */
export function showApiErrorToast(err: unknown, title = "Algo deu errado"): void {
  const details = getFieldErrorsFromUnknown(err);
  if (details && Object.keys(details).length > 0) {
    showValidationToast(title, details);
    return;
  }
  const msg =
    err instanceof ApiError
      ? err.message
      : err instanceof Error
        ? err.message
        : "Tente novamente.";
  toast.error(title, { description: msg, duration: 5000 });
}

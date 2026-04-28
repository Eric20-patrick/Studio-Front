import { WorkingHourBlock } from "@/types";

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

// CORREÇÃO: Usar Intl para garantir que ele não mude o dia baseado em horas
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;

  // Força o uso dos métodos "getUTC" para evitar o fuso horário local
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export function toIsoDate(date: Date): string {
  // CORREÇÃO: Em vez de pegar getFullYear/Month/Date (que depende do fuso local),
  // usamos o ISOString e pegamos apenas a parte da data.
  // Se a data foi salva com Meio-Dia (como sugeri no Contexto), isso nunca falha.
  return date.toISOString().split("T")[0];
}

export function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day >= 1 && day <= 6;
}

export function formatDuration(min: number | string | undefined): string {
  if (min === undefined || min === null) return "";
  if (typeof min === "string") return min;
  if (min < 60) return `${min}min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h${m}`;
}

const WEEKDAY_LABEL: Record<string, string> = {
  MONDAY: "Seg",
  TUESDAY: "Ter",
  WEDNESDAY: "Qua",
  THURSDAY: "Qui",
  FRIDAY: "Sex",
  SATURDAY: "Sáb",
  SUNDAY: "Dom",
};
const WEEKDAY_ORDER: Record<string, number> = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
};

export function formatWorkingHours(
  blocks: WorkingHourBlock[] | undefined,
): string {
  if (!blocks || blocks.length === 0) return "";
  const byDay = new Map<string, string[]>();
  blocks.forEach((b) => {
    const list = byDay.get(b.weekDay) || [];
    list.push(`${b.startTime}-${b.endTime}`);
    byDay.set(b.weekDay, list);
  });
  const days = Array.from(byDay.keys()).sort(
    (a, b) => (WEEKDAY_ORDER[a] || 0) - (WEEKDAY_ORDER[b] || 0),
  );
  if (days.length === 0) return "";

  const first = byDay.get(days[0])!.join(", ");
  const allSame = days.every((d) => byDay.get(d)!.join(", ") === first);
  if (allSame && days.length > 1) {
    return `${WEEKDAY_LABEL[days[0]]} a ${WEEKDAY_LABEL[days[days.length - 1]]}, ${first}`;
  }
  return days
    .map((d) => `${WEEKDAY_LABEL[d]} ${byDay.get(d)!.join(", ")}`)
    .join(" • ");
}

// CORREÇÃO: formatTimeFromIso não deve criar um novo Date se o objetivo for apenas ler o tempo
export function formatTimeFromIso(iso: string): string {
  if (!iso) return "";
  // Se for uma string ISO completa, pega a parte do tempo
  const timePart = iso.includes("T") ? iso.split("T")[1].substring(0, 5) : iso;
  return timePart;
}

export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null) return "";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function getPeriodFromTime(iso: string): "manha" | "tarde" {
  const date = new Date(iso);
  const h = date.getHours();
  return h < 12 ? "manha" : "tarde";
}

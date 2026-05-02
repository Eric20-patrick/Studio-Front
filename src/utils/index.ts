import { WorkingHourBlock } from "@/types";

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

/**
 * REPARO: formatDate
 * Em vez de new Date(date), que falha com strings "YYYY-MM-DD",
 * usamos o parseDateLocal que você já tem para garantir que o dia seja preservado.
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? parseDateLocal(date) : date;
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    // Removido timeZone aqui para usar o objeto "ajustado" localmente
  });
}

// ─── Converte Date para YYYY-MM-DD sem bug de timezone ───
export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * REPARO: parseDateLocal
 * Esta função é a sua melhor amiga. Ela quebra a string e monta a data
 * baseada nos números literais, evitando que o JS tente converter fuso.
 */
export function parseDateLocal(dateStr: string): Date {
  if (!dateStr) return new Date();
  // Se vier um ISO completo, pega só a parte da data
  const cleanDate = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const [year, month, day] = cleanDate.split("-").map(Number);
  // Criamos a data no horário local, evitando o fallback para UTC
  return new Date(year!, month! - 1, day!, 12, 0, 0, 0);
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
    const list = byDay.get(b.weekDay) ?? [];
    list.push(`${b.startTime}-${b.endTime}`);
    byDay.set(b.weekDay, list);
  });
  const days = Array.from(byDay.keys()).sort(
    (a, b) => (WEEKDAY_ORDER[a] ?? 0) - (WEEKDAY_ORDER[b] ?? 0),
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

/**
 * REPARO: formatTimeFromIso
 * Se a hora está vindo "uma hora antes", é porque a data de referência no Objeto Date
 * pode estar caindo em período de Horário de Verão histórico ou fuso errado.
 */
export function formatTimeFromIso(iso: string | undefined | null): string {
  if (!iso) return "";
  const date = new Date(iso);

  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
    hour12: false,
  });
}

/**
 * REPARO: formatDateLong
 * Usa o parseDateLocal para evitar erro de 1 dia atrás.
 */
export function formatDateLong(date: Date | string): string {
  const d = typeof date === "string" ? parseDateLocal(date) : date;
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/**
 * REPARO: formatDateShort
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? parseDateLocal(date) : date;
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null) return "";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function getPeriodFromTime(iso: string): "manha" | "tarde" {
  const date = new Date(iso);
  const h = date.toLocaleString("pt-BR", {
    hour: "numeric",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  });
  return parseInt(h) < 12 ? "manha" : "tarde";
}

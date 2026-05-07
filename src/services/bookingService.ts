import { api } from "@/services/api";
import {
  Booking,
  BookingStatus,
  ProfessionalAvailability,
  AvailabilitySlot,
} from "@/types";

// ─── Types ────────────────────────────────────────────────

export interface CreateBookingPayload {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  observations?: string;
  items: {
    procedureId: string;
    professionalId?: string;
    date: string; // YYYY-MM-DD gerado com toIsoDate()
    period: "manha" | "tarde";
    startTime?: string; // ISO se conhecido
  }[];
  marketingConsent?: boolean;
}

export interface ListBookingsParams {
  status?: BookingStatus;
  date?: string;
  professionalId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedBookings {
  data: Booking[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Helper — serializa Date para YYYY-MM-DD local ────────
// Evita o bug de -1 dia causado por toISOString() que usa UTC
function toLocalDateString(date: Date | string): string {
  if (typeof date === "string") {
    // Se já é YYYY-MM-DD, retorna como está
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    // Se é ISO string completa, converte sem toISOString()
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ─── API calls ────────────────────────────────────────────

export function getAvailability(params: {
  procedureId: string;
  date: string;
  professionalId?: string;
}): Promise<
  | ProfessionalAvailability[]
  | { professionalId: string; slots: AvailabilitySlot[] }
> {
  return api.get("/bookings/availability", {
    query: params,
    auth: false,
  });
}

export function createBooking(payload: CreateBookingPayload): Promise<{
  id: string;
  status: string;
  clientName: string;
  totalAmount: number;
}> {
  // Garante que todas as datas estão no formato local correto
  const safePayload: CreateBookingPayload = {
    ...payload,
    items: payload.items.map((item) => ({
      ...item,
      date: toLocalDateString(item.date),
    })),
  };

  return api.post("/bookings", safePayload, { auth: false });
}

export function listBookings(
  params: ListBookingsParams = {},
): Promise<PaginatedBookings> {
  return api.get<PaginatedBookings>("/bookings", {
    query: params as Record<string, unknown>,
  });
}

export function getBooking(id: string): Promise<Booking> {
  return api.get<Booking>(`/bookings/${id}`);
}

export function confirmBooking(id: string): Promise<Booking> {
  return api.patch<Booking>(`/bookings/${id}/confirm`);
}

export function cancelBooking(id: string, reason: string): Promise<Booking> {
  return api.patch<Booking>(`/bookings/${id}/cancel`, { reason });
}

export function markPresentBooking(id: string): Promise<Booking> {
  return api.patch<Booking>(`/bookings/${id}/present`);
}

export const completeBooking = async (
  id: string,
  extraProcedureId?: string,
  extraProfessionalId?: string,
  discountPercentage?: number,
  extraProcedures?: { procedureId: string; professionalId?: string }[]
): Promise<Booking> => {
  return api.patch<Booking>(
    `/bookings/${id}/complete`,
    { extraProcedureId, extraProfessionalId, discountPercentage, extraProcedures }
  );
};

// ─── Períodos fixos ───────────────────────────────────────
export function getAvailablePeriods() {
  return Promise.resolve([
    {
      id: "manha" as const,
      label: "Manhã",
      hours: "08:00 — 11:00",
      icon: "🌅",
    },
    {
      id: "tarde" as const,
      label: "Tarde",
      hours: "12:00 — 20:00",
      icon: "🌇",
    },
  ]);
}

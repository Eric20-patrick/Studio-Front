import { api } from '@/services/api';
import { Booking, BookingStatus, ProfessionalAvailability, AvailabilitySlot } from '@/types';

export interface CreateBookingPayload {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  observations?: string;
  items: {
    procedureId: string;
    professionalId?: string;
    date: string; // YYYY-MM-DD
    period: 'manha' | 'tarde';
    startTime?: string; // ISO if known
  }[];
}

export interface AvailabilityResponse {
  // when no professionalId: array
  // when professionalId: object
  professionalId?: string;
  slots?: AvailabilitySlot[];
}

export async function getAvailability(params: {
  procedureId: string;
  date: string;
  professionalId?: string;
}): Promise<ProfessionalAvailability[] | { professionalId: string; slots: AvailabilitySlot[] }> {
  return api.get('/bookings/availability', { query: params, auth: false });
}

export async function createBooking(payload: CreateBookingPayload) {
  return api.post<{ id: string; status: string; clientName: string; totalAmount: number }>(
    '/bookings',
    payload,
    { auth: false }
  );
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
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export async function listBookings(params: ListBookingsParams = {}): Promise<PaginatedBookings> {
  return api.get<PaginatedBookings>('/bookings', { query: params as Record<string, unknown> });
}

export async function getBooking(id: string): Promise<Booking> {
  return api.get<Booking>(`/bookings/${id}`);
}

export async function confirmBooking(id: string): Promise<Booking> {
  return api.patch<Booking>(`/bookings/${id}/confirm`);
}

export async function cancelBooking(id: string, reason: string): Promise<Booking> {
  return api.patch<Booking>(`/bookings/${id}/cancel`, { reason });
}

export async function completeBooking(id: string): Promise<Booking> {
  return api.patch<Booking>(`/bookings/${id}/complete`);
}

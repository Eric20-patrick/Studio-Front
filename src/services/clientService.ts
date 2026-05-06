import { api } from './api';

export interface ClientHistoryBooking {
  bookingId: string;
  date: string;
  status: string;
  procedures: { name: string; professional: string; amount: number }[];
  totalAmount: number;
}

export interface ClientListItem {
  originalPhone?: string;
  clientPhone: string;
  clientName: string;
  clientEmail: string | null;
  marketingConsent: boolean;
  consentDate: string | null;
  totalVisits: number;
  totalSpent: number;
  totalSpentFormatted: string;
  lastVisit: {
    date: string;
    procedureName: string;
    professionalName: string;
    amount: number;
    amountFormatted: string;
  } | null;
  history: ClientHistoryBooking[];
}

export interface ClientFull extends ClientListItem {
  clientPhoneFull: string;
  clientEmailFull: string;
}

export interface ClientListResponse {
  data: ClientListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getClients(page = 1, search = ''): Promise<ClientListResponse> {
  return api.get<ClientListResponse>('/clients', {
    query: { page, search, limit: 20 },
  });
}

export async function getClientFull(phoneFull: string, confirmPassword: string): Promise<ClientFull> {
  return api.post<ClientFull>(`/clients/${encodeURIComponent(phoneFull)}/full`, {
    confirmPassword,
  });
}

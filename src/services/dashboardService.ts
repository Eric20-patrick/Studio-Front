import { api } from '@/services/api';

export interface AdminDashboardData {
  summary: {
    bookings: {
      today: number; week: number; month: number;
      byStatus: { pending: number; confirmed: number; completed: number; cancelled: number };
    };
    professionals: number;
    procedures: number;
  };
  revenue: {
    total: number;
    totalFormatted: string;
    bookingCount: number;
    averageTicket: number;
    averageTicketFormatted: string;
    byDay: Record<string, number>;
  };
  topProcedures: Array<{ procedure: { id: string; name: string; category: string }; count: number; revenueFormatted: string }>;
  topProfessionals: Array<{ professional: { id: string; name: string }; totalAppointments: number; totalRevenueFormatted: string; procedures: { name: string; count: number }[] }>;
  procedures: Array<{ id: string; name: string; category: string; price: number; duration: number; interval: number }>;
}

export interface ReceptionDashboardData {
  date: string;
  summary: {
    total: number;
    pending: number;
    confirmed: number;
    expectedRevenue: number;
    expectedRevenueFormatted: string;
  };
  bookings: Array<{
    id: string;
    status: string;
    client: { name: string; phoneFormatted: string; whatsappLink: string; email?: string };
    items: Array<{
      procedure: { name: string; category: string; duration: number; price?: number; priceFormatted?: string };
      professional: { name: string; phone?: string };
      startTime: string;
      endTime: string;
      amountChargedFormatted?: string;
    }>;
    totalAmount: number;
    totalAmountFormatted: string;
  }>;
}

export async function getAdminDashboard(revenueFilter: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<AdminDashboardData> {
  return api.get<AdminDashboardData>('/dashboard/admin', { query: { revenueFilter } });
}

export async function getReceptionDashboard(date?: string): Promise<ReceptionDashboardData> {
  return api.get<ReceptionDashboardData>('/dashboard/reception', { query: { date } });
}

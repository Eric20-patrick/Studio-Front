export type Period = "manha" | "tarde";

export type WeekDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type UserRole = "ADMIN" | "RECEPTION";

export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface PeriodOption {
  id: Period;
  label: string;
  hours: string;
  icon: string;
}

export interface WorkingHourBlock {
  weekDay: WeekDay;
  startTime: string; // "HH:MM"
  endTime: string;
  lunchStart?: string; // "HH:MM"
  lunchEnd?: string;
}

// ─── Professional ─────────────────────────────────────────
// workingHours é opcional porque alguns endpoints não retornam
// (ex: GET /professionals sem include explícito)
export interface Professional {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  specialties: string[];
  workingHours?: WorkingHourBlock[]; // ← opcional
  avatarUrl?: string | null;
  isActive?: boolean;
  description?: string | null;
  // campos de compatibilidade com mocks antigos
  specialty?: string;
  bio?: string;
  photo?: string;
}

// ─── Procedure ────────────────────────────────────────────
export interface Procedure {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  duration: number | string; // number da API, string em mocks legados
  interval?: number;
  isActive?: boolean;
  price?: number; // só em endpoints admin
}

// ─── Booking form (front-end state) ──────────────────────
export interface ProcedureProfessional {
  procedure: Procedure;
  professional: Professional | null;
  noPreference: boolean;
}

export interface AvailabilitySlot {
  startTime: string; // ISO string
  endTime: string; // ISO string
}

export interface ProfessionalAvailability {
  professional: { id: string; name: string };
  slots: AvailabilitySlot[];
}

export interface BookingItemSelection {
  procedure: Procedure;
  professionalId?: string;
  professionalName?: string;
  noPreference: boolean;
  date: string; // YYYY-MM-DD
  period: Period;
  startTime?: string; // ISO
  endTime?: string;
  hasAvailability?: boolean; // Indica se há profissionais disponíveis para este procedimento
}

export interface BookingForm {
  name: string;
  phone: string;
  email: string;
  observations: string;
  procedures: Procedure[];
  selectedDates: Date[];
  selectedPeriods: Period[];
  procedureProfessionals: ProcedureProfessional[];
  items: BookingItemSelection[];
  marketingConsent: boolean;
}

export interface BookingResponse {
  success: boolean;
  bookingId: string;
  message?: string;
}

// ─── Auth ─────────────────────────────────────────────────
export interface UserPermissions {
  canManageProfessionals: boolean;
  canManageProcedures: boolean;
  canViewRevenue: boolean;
  canExportData: boolean;
}

/** Permissões delegadas pelo admin para perfil RECEPCION */
export interface DelegatedPermissions {
  canManageProfessionals?: boolean;
  canManageProcedures?: boolean;
  canViewAdminDashboard?: boolean;
  canExportReports?: boolean;
  canViewClients?: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  permissions?: UserPermissions | null;
  delegatedPermissions?: DelegatedPermissions;
}

// ─── Booking (API response) ───────────────────────────────
export interface BookingItem {
  id?: string;
  procedure: {
    id: string;
    name: string;
    category: string;
    duration: number;
    price?: number;
    priceFormatted?: string;
  };
  professional: {
    id: string;
    name: string;
    phone?: string | null;
    email?: string | null;
  };
  startTime: string;
  endTime: string;
  amountCharged?: number;
  amountChargedFormatted?: string;
}

export interface Booking {
  id: string;
  status: BookingStatus;
  clientName: string;
  clientPhone: string;
  clientEmail?: string | null;
  totalAmount: number;
  totalAmountFormatted?: string;
  discountPercentage?: number | null;
  discountAmount?: number | null;
  paymentMethod?: string | null;
  completedAt?: string | null;
  items: BookingItem[];
  cancellationReason?: string | null;
  observations?: string | null;
  createdAt: string;
  // campo do dashboard da recepção
  client?: {
    name: string;
    phone: string;
    phoneFormatted: string;
    whatsappLink: string;
    email?: string | null;
  };
}

// ─── Time / Slots ─────────────────────────────────────────
export interface TimeSlot {
  time: string;
  available: boolean;
}

// ─── Blog ─────────────────────────────────────────────────
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  /** Texto completo exibido no modal “Ler mais” */
  content: string;
  date: string;
  photo: string;
  slug: string;
}

// ─── Testimonial ──────────────────────────────────────────
export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  photo?: string;
  role?: string;
}

// ─── Promotion ────────────────────────────────────────────
export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
}

// ─── Gallery ──────────────────────────────────────────────
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

// ─── Dashboard ────────────────────────────────────────────
export interface ReceptionSummary {
  total: number;
  pending: number;
  confirmed: number;
  expectedRevenue: number;
  expectedRevenueFormatted: string;
  confirmedRevenue?: number;
  confirmedRevenueFormatted?: string;
  realizedRevenue?: number;
  realizedRevenueFormatted?: string;
}

export interface ProfessionalSummaryItem {
  procedureName: string;
  startTime: string;
  clientName: string;
}

export interface ProfessionalSummary {
  professional: { id: string; name: string };
  totalAppointments: number;
  items: ProfessionalSummaryItem[];
}

export interface ReceptionDashboardData {
  date: string;
  summary: ReceptionSummary;
  bookings: Booking[];
  byProfessional: ProfessionalSummary[];
}

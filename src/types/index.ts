export type Period = 'manha' | 'tarde';

export type WeekDay = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export type UserRole = 'ADMIN' | 'RECEPTION';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

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
}

export interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  specialties: string[];
  workingHours: WorkingHourBlock[];
  avatarUrl?: string;
  isActive?: boolean;
  // legacy/compat fields used by some UI
  specialty?: string;
  bio?: string;
  photo?: string;
}

export interface Procedure {
  id: string;
  name: string;
  category: string;
  description?: string;
  duration: number | string; // minutes from API; some legacy strings
  interval?: number;
  isActive?: boolean;
  price?: number; // only available in admin endpoints
}

export interface ProcedureProfessional {
  procedure: Procedure;
  professional: Professional | null;
  noPreference: boolean;
}

export interface AvailabilitySlot {
  startTime: string;
  endTime: string;
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
}

export interface BookingForm {
  name: string;
  phone: string;
  email: string;
  observations: string;
  // procedures kept for compat
  procedures: Procedure[];
  selectedDates: Date[];
  selectedPeriods: Period[];
  procedureProfessionals: ProcedureProfessional[];
  // new structured items sent to backend
  items: BookingItemSelection[];
}

export interface BookingResponse {
  success: boolean;
  bookingId: string;
  message?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
}

export interface BookingItem {
  procedure: { id: string; name: string; category: string; duration: number; price?: number; priceFormatted?: string };
  professional: { id: string; name: string; phone?: string };
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
  clientEmail?: string;
  totalAmount: number;
  totalAmountFormatted?: string;
  items: BookingItem[];
  cancellationReason?: string | null;
  observations?: string;
  createdAt: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  photo: string;
  slug: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  photo?: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
}

import { Professional, AvailabilitySlot, WorkingHourBlock } from '@/types';
import { api, BASE_URL } from '@/services/api';

/**
 * Resolve uma URL de avatar para uma URL absoluta exibível pelo browser.
 * - URLs absolutas (https://...) são retornadas como estão.
 * - URLs relativas internas (/api/uploads/...) são prefixadas com BASE_URL.
 * - Strings vazias / undefined → null.
 */
export function resolveAvatarUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/')) return `${BASE_URL}${trimmed}`;
  return trimmed;
}

export async function getProfessionals(params?: { specialty?: string }): Promise<Professional[]> {
  return api.get<Professional[]>('/professionals', { query: params, auth: false });
}

export async function getProfessionalById(id: string): Promise<Professional> {
  return api.get<Professional>(`/professionals/${id}`, { auth: false });
}

export async function getProfessionalAvailability(
  id: string,
  date: string,
  procedureId?: string,
): Promise<{
  professional: { id: string; name: string; specialties: string[] };
  date: string;
  slots: AvailabilitySlot[];
}> {
  return api.get(`/professionals/${id}/availability`, {
    query: { date, procedureId },
    auth: false,
  });
}

export async function getProfessionalSchedule(id: string, startDate: string, endDate: string) {
  return api.get(`/professionals/${id}/schedule`, { query: { startDate, endDate } });
}

// ===== Admin =====
export async function createProfessional(data: Partial<Professional>): Promise<Professional> {
  return api.post<Professional>('/professionals', data);
}

export async function updateProfessional(
  id: string,
  data: Partial<Professional>,
): Promise<Professional> {
  return api.patch<Professional>(`/professionals/${id}`, data);
}

export async function updateProfessionalWorkingHours(
  id: string,
  workingHours: WorkingHourBlock[],
): Promise<Professional> {
  return api.patch<Professional>(`/professionals/${id}/working-hours`, { workingHours });
}

export async function deactivateProfessional(id: string): Promise<void> {
  await api.patch(`/professionals/${id}/deactivate`);
}

export async function reactivateProfessional(id: string): Promise<void> {
  await api.patch(`/professionals/${id}/reactivate`);
}

export const AVATAR_UPLOAD_LIMITS = {
  maxSizeBytes: 2 * 1024 * 1024,
  minDimension: 64,
  maxInputDimension: 8192,
  allowedMime: ['image/jpeg', 'image/png', 'image/webp'] as const,
  allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'] as const,
} as const;

/** Faz upload da foto do profissional via multipart/form-data. */
export async function uploadProfessionalAvatar(
  id: string,
  file: File,
): Promise<Professional> {
  const formData = new FormData();
  formData.append('avatar', file);
  return api.upload<Professional>(`/professionals/${id}/avatar`, formData, 'POST');
}

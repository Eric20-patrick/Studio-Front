import { Professional, ProfessionalAvailability, AvailabilitySlot, WorkingHourBlock } from '@/types';
import { api } from '@/services/api';

export async function getProfessionals(params?: { specialty?: string }): Promise<Professional[]> {
  return api.get<Professional[]>('/professionals', { query: params, auth: false });
}

export async function getProfessionalById(id: string): Promise<Professional> {
  return api.get<Professional>(`/professionals/${id}`, { auth: false });
}

export async function getProfessionalAvailability(id: string, date: string, procedureId?: string): Promise<{
  professional: { id: string; name: string; specialties: string[] };
  date: string;
  slots: AvailabilitySlot[];
}> {
  return api.get(`/professionals/${id}/availability`, { query: { date, procedureId }, auth: false });
}

export async function getProfessionalSchedule(id: string, startDate: string, endDate: string) {
  return api.get(`/professionals/${id}/schedule`, { query: { startDate, endDate } });
}

// ===== Admin =====
export async function createProfessional(data: Partial<Professional>): Promise<Professional> {
  return api.post<Professional>('/professionals', data);
}

export async function updateProfessional(id: string, data: Partial<Professional>): Promise<Professional> {
  return api.patch<Professional>(`/professionals/${id}`, data);
}

export async function updateProfessionalWorkingHours(id: string, workingHours: WorkingHourBlock[]): Promise<Professional> {
  return api.patch<Professional>(`/professionals/${id}/working-hours`, { workingHours });
}

export async function deactivateProfessional(id: string): Promise<void> {
  await api.patch(`/professionals/${id}/deactivate`);
}

export async function reactivateProfessional(id: string): Promise<void> {
  await api.patch(`/professionals/${id}/reactivate`);
}

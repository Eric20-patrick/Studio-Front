import { Procedure } from '@/types';
import { api } from '@/services/api';

export async function getProcedures(params?: { search?: string; category?: string }): Promise<Procedure[]> {
  return api.get<Procedure[]>('/procedures', { query: params, auth: false });
}

export async function searchProcedures(query: string): Promise<Procedure[]> {
  return getProcedures({ search: query });
}

export async function getProcedureCategories(): Promise<string[]> {
  return api.get<string[]>('/procedures/categories', { auth: false });
}

export async function getProcedureById(id: string): Promise<Procedure> {
  return api.get<Procedure>(`/procedures/${id}`, { auth: false });
}

// ===== Admin =====
export async function getAdminProcedures(): Promise<Procedure[]> {
  return api.get<Procedure[]>('/procedures/admin/list');
}

export async function getAdminProcedureById(id: string): Promise<Procedure> {
  return api.get<Procedure>(`/procedures/admin/${id}`);
}

export async function createProcedure(data: Partial<Procedure>): Promise<Procedure> {
  return api.post<Procedure>('/procedures', data);
}

export async function updateProcedure(id: string, data: Partial<Procedure>): Promise<Procedure> {
  return api.patch<Procedure>(`/procedures/${id}`, data);
}

export async function updateProcedurePrice(id: string, price: number): Promise<Procedure> {
  return api.patch<Procedure>(`/procedures/${id}/price`, { price });
}

export async function deactivateProcedure(id: string): Promise<void> {
  await api.patch(`/procedures/${id}/deactivate`);
}

export async function reactivateProcedure(id: string): Promise<void> {
  await api.patch(`/procedures/${id}/reactivate`);
}

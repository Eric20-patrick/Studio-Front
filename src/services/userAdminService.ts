import { api } from '@/services/api';
import type { DelegatedPermissions } from '@/types';

export interface ReceptionUserRow {
  id: string;
  name: string;
  email: string;
  delegatedPermissions?: DelegatedPermissions;
}

export function listReceptionUsers(): Promise<ReceptionUserRow[]> {
  return api.get<ReceptionUserRow[]>('/users/reception');
}

export function updateUserDelegation(
  userId: string,
  delegatedPermissions: DelegatedPermissions,
): Promise<ReceptionUserRow> {
  return api.patch<ReceptionUserRow>(`/users/${userId}/delegation`, {
    delegatedPermissions,
  });
}

import apiClient from './client';
import type { Commission, CommissionStats } from '@/types/commissions';

export const commissionsApi = {
  getMyCommissions: () =>
    apiClient.get<Commission[]>('/commissions/my'),

  getCommissionStats: () =>
    apiClient.get<CommissionStats>('/commissions/my/stats'),

  payCommission: (id: string) =>
    apiClient.post<{ clientSecret: string }>(`/commissions/${id}/pay`),
};

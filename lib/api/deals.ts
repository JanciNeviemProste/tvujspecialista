import apiClient from './client';
import type { Deal, UpdateDealStatusDto, UpdateDealValueDto, CloseDealDto, DealEvent, DealAnalyticsData } from '@/types/deals';
import { dealArraySchema, dealSchema, dealAnalyticsSchema, validateResponse } from './schemas';

export const dealsApi = {
  getMyDeals: async () => {
    const response = await apiClient.get<Deal[]>('/deals/my');
    response.data = validateResponse(dealArraySchema, response.data) as Deal[];
    return response;
  },

  updateDealStatus: (id: string, data: UpdateDealStatusDto) =>
    apiClient.patch<Deal>(`/deals/${id}/status`, data),

  updateDealValue: (id: string, data: UpdateDealValueDto) =>
    apiClient.patch<Deal>(`/deals/${id}/value`, data),

  closeDeal: (id: string, data: CloseDealDto) =>
    apiClient.patch<Deal>(`/deals/${id}/close`, data),

  reopenDeal: (id: string) =>
    apiClient.post<Deal>(`/deals/${id}/reopen`),

  addNote: (id: string, note: string) =>
    apiClient.post(`/deals/${id}/notes`, { note }),

  getMyEvents: (dealId: string) =>
    apiClient.get<DealEvent[]>(`/deals/my/events/${dealId}`),

  getMyAnalytics: async () => {
    const response = await apiClient.get<DealAnalyticsData>('/deals/my/analytics');
    response.data = validateResponse(dealAnalyticsSchema, response.data) as DealAnalyticsData;
    return response;
  },
};

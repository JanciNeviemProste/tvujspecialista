import apiClient from './client';
import type { Deal, UpdateDealStatusDto, DealEvent } from '@/types/deals';
import { dealArraySchema, validateResponse } from './schemas';

export const dealsApi = {
  getMyDeals: async () => {
    const response = await apiClient.get<Deal[]>('/deals/my');
    response.data = validateResponse(dealArraySchema, response.data) as Deal[];
    return response;
  },

  updateDealStatus: (id: string, data: UpdateDealStatusDto) =>
    apiClient.patch<Deal>(`/deals/${id}/status`, data),

  addNote: (id: string, note: string) =>
    apiClient.post(`/deals/${id}/notes`, { note }),

  getMyEvents: (dealId: string) =>
    apiClient.get<DealEvent[]>(`/deals/my/events/${dealId}`),
};

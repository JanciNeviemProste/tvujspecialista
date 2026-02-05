import apiClient from './client';

export interface LeadFormData {
  specialistId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  gdprConsent: boolean;
}

export interface LeadFilters {
  status?: 'new' | 'contacted' | 'qualified' | 'closed_won' | 'closed_lost';
  page?: number;
  limit?: number;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'closed_won' | 'closed_lost';

export const leadsApi = {
  create: (data: LeadFormData) =>
    apiClient.post('/leads', data),

  getMyLeads: (filters: LeadFilters = {}) =>
    apiClient.get('/leads/my', { params: filters }),

  updateStatus: (id: string, status: LeadStatus) =>
    apiClient.patch(`/leads/${id}/status`, { status }),

  addNote: (id: string, note: string) =>
    apiClient.post(`/leads/${id}/notes`, { note }),
};

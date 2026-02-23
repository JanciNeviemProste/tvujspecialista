import apiClient from './client';

export const adminApi = {
  getStats: () => apiClient.get('/admin/stats'),
  getUsers: (page = 1, limit = 20) => apiClient.get('/admin/users', { params: { page, limit } }),
  getSpecialists: (page = 1, limit = 20) => apiClient.get('/admin/specialists', { params: { page, limit } }),
  getLeads: (page = 1, limit = 20) => apiClient.get('/admin/leads', { params: { page, limit } }),
  verifySpecialist: (id: string) => apiClient.patch(`/admin/specialists/${id}/verify`),
  getEventAttendees: (eventId: string) => apiClient.get(`/admin/events/${eventId}/attendees`),
  updateRSVPStatus: (rsvpId: string, status: string) => apiClient.patch(`/admin/rsvps/${rsvpId}/status`, { status }),
};

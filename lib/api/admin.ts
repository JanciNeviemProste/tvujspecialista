import apiClient from './client';

export const adminApi = {
  getStats: () => apiClient.get('/admin/stats'),
  getUsers: (page = 1, limit = 20) => apiClient.get('/admin/users', { params: { page, limit } }),
  getSpecialists: (page = 1, limit = 20) => apiClient.get('/admin/specialists', { params: { page, limit } }),
  getLeads: (page = 1, limit = 20) => apiClient.get('/admin/leads', { params: { page, limit } }),
  verifySpecialist: (id: string) => apiClient.patch(`/admin/specialists/${id}/verify`),
  getCourses: () => apiClient.get('/admin/courses'),
  publishCourse: (courseId: string, published: boolean) =>
    apiClient.patch(`/admin/courses/${courseId}/publish`, { published }),
  getEvents: () => apiClient.get('/admin/events'),
  publishEvent: (eventId: string, published: boolean) =>
    apiClient.post(`/admin/events/${eventId}/publish`, { published }),
  uploadEventBanner: (file: File) => {
    const formData = new FormData();
    formData.append('banner', file);
    return apiClient.post<{ bannerImage: string }>('/upload/event-banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getEventAttendees: (eventId: string) => apiClient.get(`/admin/events/${eventId}/attendees`),
  updateRSVPStatus: (rsvpId: string, status: string) => apiClient.patch(`/admin/rsvps/${rsvpId}/status`, { status }),
};

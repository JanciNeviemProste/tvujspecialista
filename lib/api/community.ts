import apiClient from './client';
import type { Event, RSVP, EventFilters, EventListResponse } from '@/types/community';

export const communityApi = {
  // Events
  getEvents: (filters: EventFilters = {}) =>
    apiClient.get<EventListResponse>('/community/events', { params: filters }),

  getUpcomingEvents: () =>
    apiClient.get<Event[]>('/community/events/upcoming'),

  getEventBySlug: (slug: string) =>
    apiClient.get<Event>(`/community/events/${slug}`),

  createEvent: (data: Partial<Event>) =>
    apiClient.post<Event>('/community/events', data),

  updateEvent: (id: string, data: Partial<Event>) =>
    apiClient.patch<Event>(`/community/events/${id}`, data),

  deleteEvent: (id: string) =>
    apiClient.delete(`/community/events/${id}`),

  publishEvent: (id: string, published: boolean) =>
    apiClient.post(`/community/events/${id}/publish`, { published }),

  cancelEvent: (id: string) =>
    apiClient.post(`/community/events/${id}/cancel`),

  getAttendees: (id: string) =>
    apiClient.get<RSVP[]>(`/community/events/${id}/attendees`),

  // RSVPs
  rsvpToEvent: (eventId: string) =>
    apiClient.post<RSVP>(`/community/events/${eventId}/rsvp`),

  getMyRSVPs: () =>
    apiClient.get<RSVP[]>('/community/rsvps/my'),

  confirmRSVP: (id: string) =>
    apiClient.patch(`/community/rsvps/${id}/confirm`),

  cancelRSVP: (id: string) =>
    apiClient.patch(`/community/rsvps/${id}/cancel`),

  checkInRSVP: (id: string) =>
    apiClient.post(`/community/rsvps/${id}/check-in`),
};

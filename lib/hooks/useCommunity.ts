import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communityApi } from '@/lib/api/community';
import type { EventFilters, Event } from '@/types/community';

// Queries
export function useEvents(filters: EventFilters = {}) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => communityApi.getEvents(filters).then((res) => res.data),
  });
}

export function useUpcomingEvents() {
  return useQuery({
    queryKey: ['events', 'upcoming'],
    queryFn: () => communityApi.getUpcomingEvents().then((res) => res.data),
  });
}

export function useEvent(slug: string | undefined) {
  return useQuery({
    queryKey: ['event', slug],
    queryFn: () => communityApi.getEventBySlug(slug!).then((res) => res.data),
    enabled: !!slug,
  });
}

export function useMyRSVPs() {
  return useQuery({
    queryKey: ['myRSVPs'],
    queryFn: () => communityApi.getMyRSVPs().then((res) => res.data),
  });
}

export function useAttendees(eventId: string | undefined) {
  return useQuery({
    queryKey: ['attendees', eventId],
    queryFn: () => communityApi.getAttendees(eventId!).then((res) => res.data),
    enabled: !!eventId,
  });
}

// Mutations
export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Event>) => communityApi.createEvent(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) =>
      communityApi.updateEvent(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event'] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => communityApi.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useRSVP() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => communityApi.rsvpToEvent(eventId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRSVPs'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event'] });
    },
  });
}

export function useCancelRSVP() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rsvpId: string) => communityApi.cancelRSVP(rsvpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRSVPs'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event'] });
    },
  });
}

export function useConfirmRSVP() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rsvpId: string) => communityApi.confirmRSVP(rsvpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRSVPs'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

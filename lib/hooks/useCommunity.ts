import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communityApi } from '@/lib/api/community';
import type { EventFilters, Event } from '@/types/community';
import { queryKeys } from '@/lib/queryKeys';
import { toast } from 'sonner';

// Queries
export function useEvents(filters: EventFilters = {}) {
  return useQuery({
    queryKey: [...queryKeys.community.events, filters],
    queryFn: () => communityApi.getEvents(filters).then((res) => res.data),
  });
}

export function useUpcomingEvents() {
  return useQuery({
    queryKey: [...queryKeys.community.events, 'upcoming'],
    queryFn: () => communityApi.getUpcomingEvents().then((res) => res.data),
  });
}

export function useEvent(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.community.event(slug!),
    queryFn: () => communityApi.getEventBySlug(slug!).then((res) => res.data),
    enabled: !!slug,
  });
}

export function useMyRSVPs() {
  return useQuery({
    queryKey: queryKeys.community.myRSVPs,
    queryFn: () => communityApi.getMyRSVPs().then((res) => res.data),
  });
}

export function useAttendees(eventId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.community.attendees(eventId!),
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
      queryClient.invalidateQueries({ queryKey: queryKeys.community.events });
      toast.success('Udalosť bola vytvorená');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Chyba pri vytváraní udalosti');
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) =>
      communityApi.updateEvent(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.events });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.event('') });
      toast.success('Udalosť bola aktualizovaná');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Chyba pri aktualizácii udalosti');
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => communityApi.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.events });
      toast.success('Udalosť bola zmazaná');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Chyba pri mazaní udalosti');
    },
  });
}

export function useRSVP() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => communityApi.rsvpToEvent(eventId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.myRSVPs });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.events });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.event('') });
      toast.success('Registrácia potvrdená');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Chyba pri registrácii na udalosť');
    },
  });
}

export function useCancelRSVP() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rsvpId: string) => communityApi.cancelRSVP(rsvpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.myRSVPs });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.events });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.event('') });
      toast.success('Registrácia zrušená');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Chyba pri zrušení registrácie');
    },
  });
}

export function useConfirmRSVP() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rsvpId: string) => communityApi.confirmRSVP(rsvpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.myRSVPs });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.events });
      toast.success('Účasť potvrdená');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Chyba pri potvrdení účasti');
    },
  });
}

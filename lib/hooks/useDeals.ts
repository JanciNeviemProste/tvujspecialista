import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { dealsApi } from '@/lib/api/deals';
import type { UpdateDealStatusDto, UpdateDealValueDto, CloseDealDto, Deal } from '@/types/deals';
import { toast } from 'sonner';

// Retry configuration
const RETRY_CONFIG = {
  retry: 3,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

export function useMyDeals() {
  return useQuery({
    queryKey: ['myDeals'],
    queryFn: () => dealsApi.getMyDeals().then((res) => res.data),
    ...RETRY_CONFIG,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (previously cacheTime)
  });
}

export function useUpdateDealStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDealStatusDto }) =>
      dealsApi.updateDealStatus(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDeals'] });
      toast.success('Status dealu aktualizován');
    },
    onError: () => {
      toast.error('Chyba při aktualizaci statusu dealu');
    },
  });
}

export function useUpdateDealValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDealValueDto }) =>
      dealsApi.updateDealValue(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDeals'] });
      toast.success('Hodnota dealu aktualizována');
    },
    onError: () => {
      toast.error('Chyba při aktualizaci hodnoty dealu');
    },
  });
}

export function useCloseDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CloseDealDto }) =>
      dealsApi.closeDeal(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDeals'] });
      queryClient.invalidateQueries({ queryKey: ['myCommissions'] });
      queryClient.invalidateQueries({ queryKey: ['commissionStats'] });
      toast.success('Deal uzavřen');
    },
    onError: () => {
      toast.error('Chyba při uzavírání dealu');
    },
  });
}

export function useReopenDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      dealsApi.reopenDeal(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDeals'] });
      toast.success('Deal znovu otevřen');
    },
    onError: () => {
      toast.error('Chyba při znovuotevření dealu');
    },
  });
}

export function useAddDealNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      dealsApi.addNote(id, note).then((res) => res.data),
    // Optimistic update
    onMutate: async ({ id, note }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['myDeals'] });

      // Snapshot previous value
      const previousDeals = queryClient.getQueryData<Deal[]>(['myDeals']);

      // Optimistically update
      if (previousDeals) {
        queryClient.setQueryData<Deal[]>(['myDeals'], (old) => {
          if (!old) return old;
          return old.map((deal) =>
            deal.id === id
              ? {
                  ...deal,
                  notes: [
                    ...(deal.notes || []),
                    {
                      id: `temp-${Date.now()}`,
                      content: note,
                      createdAt: new Date().toISOString(),
                      author: { name: 'You' },
                    },
                  ],
                }
              : deal
          );
        });
      }

      toast.success('Poznámka bola pridaná');
      return { previousDeals };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousDeals) {
        queryClient.setQueryData(['myDeals'], context.previousDeals);
      }
      toast.error('Nepodarilo sa pridať poznámku');
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['myDeals'] });
    },
  });
}

export function useDealEvents(dealId: string) {
  return useQuery({
    queryKey: ['dealEvents', dealId],
    queryFn: () => dealsApi.getMyEvents(dealId).then((res) => res.data),
    enabled: !!dealId, // Only run if dealId is provided
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useDealAnalytics() {
  return useQuery({
    queryKey: ['dealAnalytics'],
    queryFn: () => dealsApi.getMyAnalytics().then((res) => res.data),
    staleTime: 60 * 1000, // 1 minute - analytics don't change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...RETRY_CONFIG,
  });
}

/**
 * Prefetch analytics data
 * Call this before user navigates to analytics view
 */
export function prefetchDealAnalytics(queryClient: QueryClient) {
  return queryClient.prefetchQuery({
    queryKey: ['dealAnalytics'],
    queryFn: () => dealsApi.getMyAnalytics().then((res) => res.data),
    staleTime: 60 * 1000,
  });
}

/**
 * Prefetch deal events
 * Call this when user hovers over deal card
 */
export function prefetchDealEvents(queryClient: QueryClient, dealId: string) {
  return queryClient.prefetchQuery({
    queryKey: ['dealEvents', dealId],
    queryFn: () => dealsApi.getMyEvents(dealId).then((res) => res.data),
    staleTime: 30 * 1000,
  });
}

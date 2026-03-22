import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { dealsApi } from '@/lib/api/deals';
import type { UpdateDealStatusDto, Deal } from '@/types/deals';
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
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useUpdateDealStatus() {
  const t = useTranslations('dashboard.deals');
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDealStatusDto }) =>
      dealsApi.updateDealStatus(id, data).then((res) => res.data),
    onSuccess: () => {
      toast.success(t('toasts.statusUpdated'));
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const message =
        apiError?.response?.data?.message || t('toasts.statusUpdateError');
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['myDeals'] });
    },
  });
}

export function useAddDealNote() {
  const t = useTranslations('dashboard.deals');
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      dealsApi.addNote(id, note).then((res) => res.data),
    onMutate: async ({ id, note }) => {
      await queryClient.cancelQueries({ queryKey: ['myDeals'] });
      const previousDeals = queryClient.getQueryData<Deal[]>(['myDeals']);

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

      toast.success(t('toasts.noteAdded'));
      return { previousDeals };
    },
    onError: (err, variables, context) => {
      if (context?.previousDeals) {
        queryClient.setQueryData(['myDeals'], context.previousDeals);
      }
      toast.error(t('toasts.noteAddError'));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['myDeals'] });
    },
  });
}

export function useDealEvents(dealId: string) {
  return useQuery({
    queryKey: ['dealEvents', dealId],
    queryFn: () => dealsApi.getMyEvents(dealId).then((res) => res.data),
    enabled: !!dealId,
    staleTime: 30 * 1000,
  });
}

/**
 * Prefetch deal events
 */
export function prefetchDealEvents(queryClient: QueryClient, dealId: string) {
  return queryClient.prefetchQuery({
    queryKey: ['dealEvents', dealId],
    queryFn: () => dealsApi.getMyEvents(dealId).then((res) => res.data),
    staleTime: 30 * 1000,
  });
}

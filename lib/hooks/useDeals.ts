import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealsApi } from '@/lib/api/deals';
import type { UpdateDealStatusDto, UpdateDealValueDto, CloseDealDto } from '@/types/deals';
import { toast } from 'sonner';

export function useMyDeals() {
  return useQuery({
    queryKey: ['myDeals'],
    queryFn: () => dealsApi.getMyDeals().then((res) => res.data),
  });
}

export function useUpdateDealStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDealStatusDto }) =>
      dealsApi.updateDealStatus(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDeals'] });
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
    },
  });
}

export function useAddDealNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      dealsApi.addNote(id, note).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDeals'] });
      toast.success('Poznámka bola úspešne pridaná');
    },
    onError: () => {
      toast.error('Nepodarilo sa pridať poznámku');
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
  });
}

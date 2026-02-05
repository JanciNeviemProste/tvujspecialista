import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealsApi } from '@/lib/api/deals';
import type { UpdateDealStatusDto, UpdateDealValueDto, CloseDealDto } from '@/types/deals';

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

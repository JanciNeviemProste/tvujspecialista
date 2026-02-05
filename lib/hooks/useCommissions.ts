import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commissionsApi } from '@/lib/api/commissions';

export function useMyCommissions() {
  return useQuery({
    queryKey: ['myCommissions'],
    queryFn: () => commissionsApi.getMyCommissions().then((res) => res.data),
  });
}

export function useCommissionStats() {
  return useQuery({
    queryKey: ['commissionStats'],
    queryFn: () => commissionsApi.getCommissionStats().then((res) => res.data),
  });
}

export function usePayCommission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commissionId: string) =>
      commissionsApi.payCommission(commissionId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCommissions'] });
      queryClient.invalidateQueries({ queryKey: ['commissionStats'] });
    },
  });
}

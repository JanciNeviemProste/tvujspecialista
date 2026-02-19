import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commissionsApi } from '@/lib/api/commissions';
import { queryKeys } from '@/lib/queryKeys';
import { toast } from 'sonner';

export function useMyCommissions() {
  return useQuery({
    queryKey: queryKeys.commissions.all,
    queryFn: () => commissionsApi.getMyCommissions().then((res) => res.data),
  });
}

export function useCommissionStats() {
  return useQuery({
    queryKey: queryKeys.commissions.stats,
    queryFn: () => commissionsApi.getCommissionStats().then((res) => res.data),
  });
}

export function usePayCommission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commissionId: string) =>
      commissionsApi.payCommission(commissionId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.commissions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.commissions.stats });
      toast.success('Provízia bola úspešne uhradená');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Chyba pri úhrade provízie');
    },
  });
}

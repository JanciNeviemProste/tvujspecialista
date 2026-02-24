import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('commissions');
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commissionId: string) =>
      commissionsApi.payCommission(commissionId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.commissions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.commissions.stats });
      toast.success(t('toasts.paymentCreated'));
    },
    onError: (error: Error) => {
      toast.error(error.message || t('toasts.paymentError'));
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { leadsApi, type LeadFormData } from '@/lib/api/leads';
import { queryKeys } from '@/lib/queryKeys';
import { toast } from 'sonner';

export function useCreateLead() {
  const t = useTranslations('lead');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LeadFormData) => leadsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.my });
      toast.success(t('toasts.created'));
    },
    onError: () => {
      toast.error(t('toasts.createError'));
    },
  });
}

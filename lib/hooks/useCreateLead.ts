import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi, type LeadFormData } from '@/lib/api/leads';
import { queryKeys } from '@/lib/queryKeys';
import { toast } from 'sonner';

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LeadFormData) => leadsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.my });
      toast.success('Poptávka úspěšně odeslána');
    },
    onError: () => {
      toast.error('Chyba při odesílání poptávky');
    },
  });
}

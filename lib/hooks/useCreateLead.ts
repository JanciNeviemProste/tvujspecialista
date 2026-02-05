import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi, type LeadFormData } from '@/lib/api/leads';

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LeadFormData) => leadsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myLeads'] });
    },
  });
}

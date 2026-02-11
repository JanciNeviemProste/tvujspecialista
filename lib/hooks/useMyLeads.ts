import { useQuery } from '@tanstack/react-query';
import { leadsApi, type LeadFilters } from '@/lib/api/leads';
import { queryKeys } from '@/lib/queryKeys';

export function useMyLeads(filters: LeadFilters = {}) {
  return useQuery({
    queryKey: [...queryKeys.leads.my, filters],
    queryFn: () => leadsApi.getMyLeads(filters).then((res) => res.data),
  });
}

import { useQuery } from '@tanstack/react-query';
import { leadsApi, type LeadFilters } from '@/lib/api/leads';

export function useMyLeads(filters: LeadFilters = {}) {
  return useQuery({
    queryKey: ['myLeads', filters],
    queryFn: () => leadsApi.getMyLeads(filters).then((res) => res.data),
  });
}

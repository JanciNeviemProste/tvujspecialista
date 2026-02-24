import { useQuery } from '@tanstack/react-query';
import { leadsApi, type LeadFilters } from '@/lib/api/leads';
import { queryKeys } from '@/lib/queryKeys';
import type { LeadListResponse } from '@/types/lead';

export function useMyLeads(filters: LeadFilters = {}) {
  return useQuery<LeadListResponse>({
    queryKey: [...queryKeys.leads.my, filters],
    queryFn: () => leadsApi.getMyLeads(filters).then((res) => res.data),
  });
}

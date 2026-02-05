import { useQuery } from '@tanstack/react-query';
import { specialistsApi, type SpecialistFilters } from '@/lib/api/specialists';

export function useSpecialists(filters: SpecialistFilters = {}) {
  return useQuery({
    queryKey: ['specialists', filters],
    queryFn: () => specialistsApi.getAll(filters).then((res) => res.data),
  });
}

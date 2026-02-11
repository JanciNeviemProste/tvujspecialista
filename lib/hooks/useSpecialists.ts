import { useQuery } from '@tanstack/react-query';
import { specialistsApi, type SpecialistFilters } from '@/lib/api/specialists';
import { queryKeys } from '@/lib/queryKeys';

export function useSpecialists(filters: SpecialistFilters = {}) {
  return useQuery({
    queryKey: [...queryKeys.specialists.all, filters],
    queryFn: () => specialistsApi.getAll(filters).then((res) => res.data),
  });
}

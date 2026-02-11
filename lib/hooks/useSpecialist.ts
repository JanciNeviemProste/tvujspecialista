import { useQuery } from '@tanstack/react-query';
import { specialistsApi } from '@/lib/api/specialists';
import { queryKeys } from '@/lib/queryKeys';

export function useSpecialist(slug: string) {
  return useQuery({
    queryKey: queryKeys.specialists.detail(slug),
    queryFn: () => specialistsApi.getBySlug(slug).then((res) => res.data),
    enabled: !!slug,
  });
}

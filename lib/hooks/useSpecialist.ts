import { useQuery } from '@tanstack/react-query';
import { specialistsApi } from '@/lib/api/specialists';

export function useSpecialist(slug: string) {
  return useQuery({
    queryKey: ['specialist', slug],
    queryFn: () => specialistsApi.getBySlug(slug).then((res) => res.data),
    enabled: !!slug,
  });
}

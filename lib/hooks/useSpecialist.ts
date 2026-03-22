import { useQuery } from '@tanstack/react-query';
import { specialistsApi } from '@/lib/api/specialists';
import { queryKeys } from '@/lib/queryKeys';
import type { Specialist } from '@/types/specialist';
import type { Review } from '@/types/review';

export type SpecialistDetail = Specialist & { reviews: Review[] };

export function useSpecialist(slug: string) {
  return useQuery<SpecialistDetail>({
    queryKey: queryKeys.specialists.detail(slug),
    queryFn: () => specialistsApi.getBySlug(slug).then((res) => res.data),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

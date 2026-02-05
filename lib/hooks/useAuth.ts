import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/lib/api/auth'

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.getMe().then((res) => res.data),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
  }
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { toast } from 'sonner';

export function useAdminStats() {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: () => adminApi.getStats().then((res) => res.data),
  });
}

export function useAdminUsers(page = 1) {
  return useQuery({
    queryKey: ['adminUsers', page],
    queryFn: () => adminApi.getUsers(page).then((res) => res.data),
  });
}

export function useAdminSpecialists(page = 1) {
  return useQuery({
    queryKey: ['adminSpecialists', page],
    queryFn: () => adminApi.getSpecialists(page).then((res) => res.data),
  });
}

export function useVerifySpecialist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.verifySpecialist(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSpecialists'] });
      toast.success('Špecialista bol overený');
    },
    onError: () => {
      toast.error('Nepodarilo sa overiť špecialistu');
    },
  });
}

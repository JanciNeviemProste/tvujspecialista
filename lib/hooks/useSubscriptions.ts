import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionsApi } from '@/lib/api/subscriptions';
import { SubscriptionType } from '@/types/subscriptions';
import { queryKeys } from '@/lib/queryKeys';
import { toast } from 'sonner';

export function useMySubscriptions() {
  return useQuery({
    queryKey: queryKeys.subscriptions.current,
    queryFn: () => subscriptionsApi.getMySubscriptions().then((res) => res.data),
  });
}

export function useMyActiveSubscription() {
  return useQuery({
    queryKey: queryKeys.subscriptions.active,
    queryFn: () => subscriptionsApi.getMyActiveSubscription().then((res) => res.data),
  });
}

export function useCreateCheckout(type: SubscriptionType) {
  return useMutation({
    mutationFn: async () => {
      let response;
      switch (type) {
        case SubscriptionType.EDUCATION:
          response = await subscriptionsApi.createEducationCheckout();
          break;
        case SubscriptionType.MARKETPLACE:
          response = await subscriptionsApi.createMarketplaceCheckout();
          break;
        case SubscriptionType.PREMIUM:
          response = await subscriptionsApi.createPremiumCheckout();
          break;
      }
      return response.data;
    },
    onSuccess: async (data: { sessionId?: string; url?: string }) => {
      // Use the checkout URL directly from the session (Stripe.js v8+)
      if (data.url) {
        window.location.href = data.url;
      } else if (data.sessionId) {
        // Fallback for older implementation
        window.location.href = `https://checkout.stripe.com/c/pay/${data.sessionId}`;
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Chyba pri vytváraní platby');
    },
  });
}

export function useUpgradeSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newType }: { id: string; newType: SubscriptionType }) =>
      subscriptionsApi.upgradeSubscription(id, newType).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.current });
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.active });
      toast.success('Predplatné úspešne upgradované!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Chyba pri upgrade predplatného');
    },
  });
}

export function useDowngradeSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newType }: { id: string; newType: SubscriptionType }) =>
      subscriptionsApi.downgradeSubscription(id, newType).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.current });
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.active });
      toast.success('Downgrade naplánovaný na koniec obdobia');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Chyba pri downgrade predplatného');
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.cancelSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.current });
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.active });
      toast.success('Predplatné zrušené. Prístup máte do konca plateného obdobia.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Chyba pri zrušení predplatného');
    },
  });
}

export function useResumeSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.resumeSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.current });
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.active });
      toast.success('Predplatné obnovené!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Chyba pri obnovení predplatného');
    },
  });
}

export function useCustomerPortal() {
  return useMutation({
    mutationFn: () => subscriptionsApi.getCustomerPortal().then((res) => res.data),
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Chyba pri otváraní portálu');
    },
  });
}

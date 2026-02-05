import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionsApi } from '@/lib/api/subscriptions';
import { SubscriptionType } from '@/types/subscriptions';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function useMySubscriptions() {
  return useQuery({
    queryKey: ['mySubscriptions'],
    queryFn: () => subscriptionsApi.getMySubscriptions().then((res) => res.data),
  });
}

export function useMyActiveSubscription() {
  return useQuery({
    queryKey: ['myActiveSubscription'],
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
    onSuccess: async (data) => {
      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Chyba pri vytváraní platby');
    },
  });
}

export function useUpgradeSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newType }: { id: string; newType: SubscriptionType }) =>
      subscriptionsApi.upgradeSubscription(id, newType).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['myActiveSubscription'] });
      toast.success('Predplatné úspešne upgradované!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Chyba pri upgrade predplatného');
    },
  });
}

export function useDowngradeSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newType }: { id: string; newType: SubscriptionType }) =>
      subscriptionsApi.downgradeSubscription(id, newType).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['myActiveSubscription'] });
      toast.success('Downgrade naplánovaný na koniec obdobia');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Chyba pri downgrade predplatného');
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.cancelSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['myActiveSubscription'] });
      toast.success('Predplatné zrušené. Prístup máte do konca plateného obdobia.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Chyba pri zrušení predplatného');
    },
  });
}

export function useResumeSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.resumeSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['myActiveSubscription'] });
      toast.success('Predplatné obnovené!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Chyba pri obnovení predplatného');
    },
  });
}

export function useCustomerPortal() {
  return useMutation({
    mutationFn: () => subscriptionsApi.getCustomerPortal().then((res) => res.data),
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Chyba pri otváraní portálu');
    },
  });
}

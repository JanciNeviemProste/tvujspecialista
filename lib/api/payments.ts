import apiClient from './client';

export type SubscriptionTier = 'basic' | 'pro' | 'premium';

export const paymentsApi = {
  createCheckout: (tier: SubscriptionTier) =>
    apiClient.post('/stripe/create-checkout', { tier }),

  getMySubscription: () =>
    apiClient.get('/subscriptions/me'),
};

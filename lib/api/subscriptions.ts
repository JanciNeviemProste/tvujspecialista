import apiClient from './client';
import { Subscription, SubscriptionType } from '@/types/subscriptions';
import { subscriptionArraySchema, subscriptionSchema, validateResponse } from './schemas';

export const subscriptionsApi = {
  // Get user's subscriptions
  getMySubscriptions: async () => {
    const response = await apiClient.get<Subscription[]>('/subscriptions/my');
    response.data = validateResponse(subscriptionArraySchema, response.data) as Subscription[];
    return response;
  },

  // Get active subscription
  getMyActiveSubscription: async () => {
    const response = await apiClient.get<Subscription | null>('/subscriptions/my/active');
    if (response.data) {
      response.data = validateResponse(subscriptionSchema, response.data) as Subscription;
    }
    return response;
  },

  // Create checkout sessions
  createEducationCheckout: () =>
    apiClient.post<{ sessionId: string }>('/subscriptions/education/checkout'),

  createMarketplaceCheckout: () =>
    apiClient.post<{ sessionId: string }>('/subscriptions/marketplace/checkout'),

  createPremiumCheckout: () =>
    apiClient.post<{ sessionId: string }>('/subscriptions/premium/checkout'),

  // Manage subscription
  upgradeSubscription: (id: string, newType: SubscriptionType) =>
    apiClient.post<Subscription>(`/subscriptions/${id}/upgrade`, { newType }),

  downgradeSubscription: (id: string, newType: SubscriptionType) =>
    apiClient.post<Subscription>(`/subscriptions/${id}/downgrade`, { newType }),

  cancelSubscription: (id: string) =>
    apiClient.post<Subscription>(`/subscriptions/${id}/cancel`),

  resumeSubscription: (id: string) =>
    apiClient.post<Subscription>(`/subscriptions/${id}/resume`),

  // Get Stripe customer portal URL
  getCustomerPortal: () =>
    apiClient.get<{ url: string }>('/subscriptions/portal'),
};

import apiClient from './client';
import { Subscription, SubscriptionType } from '@/types/subscriptions';

export const subscriptionsApi = {
  // Get user's subscriptions
  getMySubscriptions: () =>
    apiClient.get<Subscription[]>('/subscriptions/my'),

  // Get active subscription
  getMyActiveSubscription: () =>
    apiClient.get<Subscription | null>('/subscriptions/my/active'),

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

import { test as base, Page } from '@playwright/test';
import { mockUser, mockAuthResponse, mockLeads, mockSpecialistProfile, mockSubscription } from './mock-data';

/**
 * Sets up localStorage tokens and mocks the /auth/me endpoint
 * so the app thinks the user is authenticated.
 */
async function authenticateContext(page: Page) {
  // Set localStorage tokens before navigating
  await page.addInitScript(() => {
    window.localStorage.setItem('accessToken', 'mock-access-token-e2e');
    window.localStorage.setItem('refreshToken', 'mock-refresh-token-e2e');
  });
}

/**
 * Mocks common backend API endpoints so E2E tests work without a real backend.
 * Uses glob patterns for resilient URL matching regardless of API base URL.
 */
async function mockBackendAPIs(page: Page) {
  // Auth endpoints
  await page.route('**/auth/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUser),
    });
  });

  await page.route('**/auth/login', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockAuthResponse),
    });
  });

  await page.route('**/auth/register', (route) => {
    route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify(mockAuthResponse),
    });
  });

  await page.route('**/auth/logout', (route) => {
    route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });

  await page.route('**/auth/refresh', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ accessToken: 'mock-access-token-e2e' }),
    });
  });

  // Leads
  await page.route('**/leads**', (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockLeads),
      });
    } else {
      route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }
  });

  // Specialist profile
  await page.route('**/specialists/profile', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockSpecialistProfile),
    });
  });

  // Subscription
  await page.route('**/subscriptions/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockSubscription),
    });
  });

  await page.route('**/payments/**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockSubscription),
    });
  });
}

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await mockBackendAPIs(page);
    await authenticateContext(page);
    await use(page);
  },
});

export { authenticateContext, mockBackendAPIs };
export { expect } from '@playwright/test';

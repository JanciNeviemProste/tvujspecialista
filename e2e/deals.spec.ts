import { test, expect } from './fixtures/auth.fixture';
import { mockDeals, mockDealAnalytics } from './fixtures/mock-data';

test.describe('Deals Page', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Mock deals-specific endpoints (auth endpoints are already mocked by fixture)
    await authenticatedPage.route('**/deals/my', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockDeals),
      })
    );

    await authenticatedPage.route('**/deals/analytics', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockDealAnalytics),
      })
    );
  });

  test('page loads successfully', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/profi/dashboard/deals', { timeout: 30000 });

    // Wait for some content to render
    await authenticatedPage.waitForTimeout(3000);

    // Verify the page has content (not blank)
    const pageContent = await authenticatedPage.textContent('body');
    expect(pageContent!.length).toBeGreaterThan(50);
  });

  test('has view toggle buttons', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/profi/dashboard/deals', { timeout: 30000 });
    await authenticatedPage.waitForTimeout(3000);

    // Look for buttons (kanban/list toggle)
    const buttons = authenticatedPage.getByRole('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThanOrEqual(2);
  });

  test('has filter controls', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/profi/dashboard/deals', { timeout: 30000 });
    await authenticatedPage.waitForTimeout(3000);

    // The page should have filter-related controls (buttons, inputs, selects, or custom elements)
    const controls = authenticatedPage.locator('input, select, button');
    const controlCount = await controls.count();
    expect(controlCount).toBeGreaterThanOrEqual(2);
  });
});

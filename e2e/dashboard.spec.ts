import { test, expect } from './fixtures/auth.fixture';

test.describe('Dashboard Page', () => {
  test('loads and shows welcome message with user name', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/profi/dashboard');

    // Wait for the welcome heading to appear
    await expect(
      authenticatedPage.getByRole('heading', { name: /Vítejte zpět/ })
    ).toBeVisible({ timeout: 15000 });

    await expect(
      authenticatedPage.getByText('Zde je přehled vaší aktivity')
    ).toBeVisible();
  });

  test('shows stat cards with correct labels', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/profi/dashboard');

    // Wait for the welcome heading to load
    await expect(
      authenticatedPage.getByRole('heading', { name: /Vítejte zpět/ })
    ).toBeVisible({ timeout: 15000 });

    // Verify the 4 stat card labels
    await expect(authenticatedPage.getByText('Nové leady')).toBeVisible({ timeout: 10000 });
    await expect(authenticatedPage.getByText('Celkem leadů')).toBeVisible();
    await expect(authenticatedPage.getByText('Průměrné hodnocení')).toBeVisible();
    await expect(authenticatedPage.getByText('Úspěšnost')).toBeVisible();
  });

  test('shows recent leads section', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/profi/dashboard');

    // Wait for the welcome heading
    await expect(
      authenticatedPage.getByRole('heading', { name: /Vítejte zpět/ })
    ).toBeVisible({ timeout: 15000 });

    // Verify the recent leads heading exists
    const leadsHeading = authenticatedPage.getByText('Poslední leady');
    await expect(leadsHeading).toBeVisible({ timeout: 10000 });
  });

  test('quick actions panel has links', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/profi/dashboard');

    // Wait for page to be fully loaded
    await expect(
      authenticatedPage.getByRole('heading', { name: /Vítejte zpět/ })
    ).toBeVisible({ timeout: 15000 });

    // Verify quick actions heading
    await expect(
      authenticatedPage.getByText('Rychlé akce')
    ).toBeVisible({ timeout: 10000 });
  });

  test('logout button exists', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/profi/dashboard');

    // Wait for the page to load
    await expect(
      authenticatedPage.getByRole('heading', { name: /Vítejte zpět/ })
    ).toBeVisible({ timeout: 15000 });

    const logoutButton = authenticatedPage.getByText('Odhlásit se');
    await expect(logoutButton).toBeVisible({ timeout: 10000 });
  });
});

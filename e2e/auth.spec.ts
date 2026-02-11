import { test, expect } from './fixtures/auth.fixture';
import { mockAuthResponse, mockUser, mockLeads, mockSpecialistProfile, mockSubscription } from './fixtures/mock-data';

/** Mock all APIs needed by the dashboard page so redirects work */
async function mockDashboardAPIs(page: import('@playwright/test').Page) {
  await page.route('**/leads**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockLeads) })
  );
  await page.route('**/specialists/profile', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockSpecialistProfile) })
  );
  await page.route('**/subscriptions/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockSubscription) })
  );
  await page.route('**/payments/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockSubscription) })
  );
}

test.describe('Authentication — Login', () => {
  test('login page displays correctly', async ({ page }) => {
    await page.goto('/profi/prihlaseni');

    // Heading
    await expect(
      page.getByRole('heading', { name: 'Přihlášení pro specialisty' })
    ).toBeVisible();

    // Form fields
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(
      page.locator('#email')
    ).toHaveAttribute('placeholder', 'vas@email.cz');

    // Remember me checkbox
    await expect(page.getByText('Zapamatovat si mě')).toBeVisible();

    // Submit button
    await expect(
      page.getByRole('button', { name: 'Přihlásit se' })
    ).toBeVisible();

    // Register link
    await expect(
      page.getByText('Zaregistrujte se zdarma')
    ).toBeVisible();
  });

  test('login with valid credentials redirects to dashboard', async ({ page }) => {
    // Mock the login API endpoint
    await page.route('**/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAuthResponse),
      });
    });

    // Mock the /auth/me endpoint so dashboard can load the user
    await page.route('**/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUser),
      });
    });

    // Mock all dashboard APIs so the page loads after redirect
    await mockDashboardAPIs(page);

    await page.goto('/profi/prihlaseni');

    await page.fill('#email', 'test@example.cz');
    await page.fill('#password', 'heslo12345');
    await page.click('button:has-text("Přihlásit se")');

    // Should redirect to dashboard
    await page.waitForURL('**/profi/dashboard', { timeout: 15000 });
    await expect(page).toHaveURL(/\/profi\/dashboard/);
  });

  test('login with empty fields shows validation errors', async ({ page }) => {
    await page.goto('/profi/prihlaseni');

    // Click submit without filling anything
    await page.click('button:has-text("Přihlásit se")');

    // Validation errors should appear — the browser or React Hook Form + Zod
    // will show required field messages
    const errorMessages = page.locator('text=/povinné|vyplňte|required/i');
    await expect(errorMessages.first()).toBeVisible();
  });

  test('login with invalid credentials shows error message', async ({ page }) => {
    // Mock the login API to return 401
    await page.route('**/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Nesprávný email nebo heslo',
        }),
      });
    });

    await page.goto('/profi/prihlaseni');

    await page.fill('#email', 'wrong@example.cz');
    await page.fill('#password', 'wrongpassword');
    await page.click('button:has-text("Přihlásit se")');

    // Error message in red box
    const errorBox = page.locator('div:has-text("Nesprávný email nebo heslo")');
    await expect(errorBox.first()).toBeVisible();
  });
});

test.describe('Authentication — Registration', () => {
  test('registration page displays correctly', async ({ page }) => {
    await page.goto('/profi/registrace');

    // Heading
    await expect(
      page.getByRole('heading', { name: 'Staňte se naším specialistou' })
    ).toBeVisible();

    // All form fields
    await expect(page.locator('#reg-name')).toBeVisible();
    await expect(page.locator('#reg-email')).toBeVisible();
    await expect(page.locator('#reg-phone')).toBeVisible();
    await expect(page.locator('#reg-category')).toBeVisible();
    await expect(page.locator('#reg-location')).toBeVisible();
    await expect(page.locator('#reg-experience')).toBeVisible();
    await expect(page.locator('#reg-bio')).toBeVisible();
    await expect(page.locator('#reg-password')).toBeVisible();
    await expect(page.locator('#reg-confirm-password')).toBeVisible();

    // Submit button
    await expect(
      page.getByRole('button', { name: 'Zaregistrovat se zdarma' })
    ).toBeVisible();
  });

  test('registration with valid data redirects to dashboard', async ({ page }) => {
    // Mock the register API endpoint
    await page.route('**/auth/register', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(mockAuthResponse),
      });
    });

    // Mock the /auth/me endpoint
    await page.route('**/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUser),
      });
    });

    // Mock all dashboard APIs so the page loads after redirect
    await mockDashboardAPIs(page);

    await page.goto('/profi/registrace');

    // Fill all required fields
    await page.fill('#reg-name', 'Jan Testovací');
    await page.fill('#reg-email', 'jan@test.cz');
    await page.fill('#reg-phone', '+420 777 111 222');
    await page.selectOption('#reg-category', { index: 1 });
    await page.selectOption('#reg-location', { index: 1 });
    await page.fill('#reg-experience', '5');
    await page.fill('#reg-bio', 'Jsem zkušený specialista s více než 5 lety praxe v oboru.');
    await page.fill('#reg-password', 'silneheslo123');
    await page.fill('#reg-confirm-password', 'silneheslo123');

    // Check required checkboxes
    const termsCheckbox = page.locator('input[name="termsAccepted"]');
    const gdprCheckbox = page.locator('input[name="gdprAccepted"]');
    await termsCheckbox.check();
    await gdprCheckbox.check();

    await page.click('button:has-text("Zaregistrovat se zdarma")');

    // Should redirect to dashboard
    await page.waitForURL('**/profi/dashboard', { timeout: 15000 });
    await expect(page).toHaveURL(/\/profi\/dashboard/);
  });

  test('registration with short password shows validation error', async ({ page }) => {
    await page.goto('/profi/registrace');

    // Fill password with less than 8 characters
    await page.fill('#reg-name', 'Jan Testovací');
    await page.fill('#reg-email', 'jan@test.cz');
    await page.fill('#reg-phone', '+420 777 111 222');
    await page.fill('#reg-password', 'abc');
    await page.fill('#reg-confirm-password', 'abc');

    await page.click('button:has-text("Zaregistrovat se zdarma")');

    // Should show password length validation error
    const passwordError = page.locator('text=/alespoň 8|minimálně 8|min.*8/i');
    await expect(passwordError.first()).toBeVisible();
  });
});

test.describe('Authentication — Route Protection', () => {
  test('unauthenticated access to dashboard redirects to login', async ({ page }) => {
    // Do NOT set any tokens or mock /auth/me — user is not authenticated
    // Mock /auth/me to return 401 (no valid session)
    await page.route('**/auth/me', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Unauthorized' }),
      });
    });

    await page.goto('/profi/dashboard');

    // Should redirect to login page
    await page.waitForURL('**/profi/prihlaseni');
    await expect(page).toHaveURL(/\/profi\/prihlaseni/);
  });
});

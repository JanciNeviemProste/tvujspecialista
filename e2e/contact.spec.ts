import { test, expect } from '@playwright/test';

test.describe('Contact Page — Layout & Content', () => {
  test('contact page displays correctly', async ({ page }) => {
    await page.goto('/kontakt');

    // Main heading
    await expect(
      page.getByRole('heading', { name: 'Kontaktujte nás' })
    ).toBeVisible();

    // Form fields
    await expect(page.getByPlaceholder('Jan Novák')).toBeVisible();
    await expect(page.getByPlaceholder('jan@example.cz')).toBeVisible();
    await expect(page.getByPlaceholder('+420 777 123 456')).toBeVisible();
    await expect(page.getByPlaceholder('Popište svůj dotaz...')).toBeVisible();

    // Subject select should be visible
    const subjectSelect = page.locator('select').filter({ hasText: /general|specialist|dotaz/i });
    await expect(subjectSelect.first()).toBeVisible();

    // Submit button
    await expect(
      page.getByRole('button', { name: 'Odeslat zprávu' })
    ).toBeVisible();
  });

  test('contact info section shows email, phone, and address', async ({ page }) => {
    await page.goto('/kontakt');

    // Email
    await expect(page.getByText('info@tvujspecialista.cz')).toBeVisible();

    // Phone
    await expect(page.getByText('+420 777 123 456')).toBeVisible();

    // Address
    await expect(page.getByText('Vinohradská 184/2396')).toBeVisible();
  });

  test('quick links section has correct links', async ({ page }) => {
    await page.goto('/kontakt');

    // Quick links
    await expect(page.getByRole('link', { name: 'O nás' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ceník' })).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Obchodní podmínky' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Ochrana osobních údajů' })
    ).toBeVisible();
  });
});

test.describe('Contact Page — Form Submission', () => {
  test('submit valid form shows success toast', async ({ page }) => {
    // Mock the internal /api/contact endpoint
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto('/kontakt');

    // Fill out the form
    await page.fill('input[placeholder="Jan Novák"]', 'Karel Svoboda');
    await page.fill('input[placeholder="jan@example.cz"]', 'karel@example.cz');
    await page.fill('input[placeholder="+420 777 123 456"]', '+420 666 555 444');
    await page.fill('textarea[placeholder="Popište svůj dotaz..."]', 'Mám dotaz ohledně vašich služeb.');

    // Select a subject
    const subjectSelect = page.locator('select').first();
    await subjectSelect.selectOption('general');

    // Submit
    await page.click('button:has-text("Odeslat zprávu")');

    // Success toast from sonner should appear
    await expect(
      page.getByText('Zpráva byla úspěšně odeslána!')
    ).toBeVisible({ timeout: 15000 });
  });

  test('submit with missing required fields shows validation errors', async ({ page }) => {
    await page.goto('/kontakt');

    // Click submit without filling any fields
    await page.click('button:has-text("Odeslat zprávu")');

    // Validation errors should appear for required fields (name, email, message)
    const errorMessages = page.locator('text=/povinné|vyplňte|required|zadejte/i');
    await expect(errorMessages.first()).toBeVisible();
  });
});

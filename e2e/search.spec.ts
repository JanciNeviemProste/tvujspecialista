import { test, expect } from '@playwright/test';
import { mockSpecialists } from './fixtures/mock-data';

test.describe('Search Page — Layout', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the specialists API to return data by default
    await page.route(`**/specialists*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSpecialists),
      });
    });
  });

  test('search page displays correctly', async ({ page }) => {
    await page.goto('/hledat');

    // Main heading
    await expect(
      page.getByRole('heading', { name: 'Najděte svého specialistu' })
    ).toBeVisible();

    // Filter sidebar elements
    await expect(
      page.locator('[aria-label="Vyberte kategorii"]')
    ).toBeVisible();
    await expect(
      page.locator('[aria-label="Vyberte lokalitu"]')
    ).toBeVisible();

    // Sort dropdown
    await expect(
      page.locator('[aria-label="Seřadit výsledky"]')
    ).toBeVisible();

    // Verified checkbox
    await expect(
      page.getByText('Pouze ověření specialisté')
    ).toBeVisible();

    // Max price input
    await expect(page.getByPlaceholder('např. 1000')).toBeVisible();
  });
});

test.describe('Search Page — Results', () => {
  test('displays specialists from API', async ({ page }) => {
    // Mock the specialists endpoint
    await page.route(`**/specialists*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSpecialists),
      });
    });

    await page.goto('/hledat');

    // Wait for loading to finish
    await expect(page.getByText('Načítání specialistů...')).toBeHidden({
      timeout: 10000,
    });

    // Check that specialist names from mock data appear on the page
    for (const specialist of mockSpecialists.specialists.slice(0, 3)) {
      await expect(page.getByText(specialist.name).first()).toBeVisible();
    }

    // Results header should show count
    await expect(page.getByText(/Nalezeno.*\d+.*specialistů/)).toBeVisible();
  });

  test('empty state when no results', async ({ page }) => {
    // Mock the specialists endpoint to return empty array
    await page.route(`**/specialists*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ specialists: [], total: 0 }),
      });
    });

    await page.goto('/hledat');

    // Wait for loading to finish and empty state to appear
    await expect(
      page.getByText('Žádní specialisté nenalezeni')
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Search Page — Filters & Sorting', () => {
  test('filter by category sends correct API param', async ({ page }) => {
    let capturedUrl = '';

    // Intercept specialists API and capture the URL
    await page.route(`**/specialists*`, async (route) => {
      capturedUrl = route.request().url();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSpecialists),
      });
    });

    await page.goto('/hledat');

    // Wait for initial load
    await expect(page.getByText('Načítání specialistů...')).toBeHidden({
      timeout: 10000,
    });

    // Select a category
    const categorySelect = page.locator('[aria-label="Vyberte kategorii"]');
    await categorySelect.selectOption({ label: 'Finanční poradce' });

    // Wait for the new request to be made
    await page.waitForTimeout(1000);

    // Verify the API was called with a category parameter
    expect(capturedUrl).toContain('category');
  });

  test('filter by location changes select value', async ({ page }) => {
    await page.route(`**/specialists*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSpecialists),
      });
    });

    await page.goto('/hledat');

    // Wait for initial load
    await expect(page.getByText('Načítání specialistů...')).toBeHidden({
      timeout: 10000,
    });

    // Select a location
    const locationSelect = page.locator('[aria-label="Vyberte lokalitu"]');
    await locationSelect.selectOption({ label: 'Praha' });

    // Verify the select has the correct value
    await expect(locationSelect).toHaveValue(/praha/i);
  });

  test('sort dropdown changes value', async ({ page }) => {
    await page.route(`**/specialists*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSpecialists),
      });
    });

    await page.goto('/hledat');

    // Wait for initial load
    await expect(page.getByText('Načítání specialistů...')).toBeHidden({
      timeout: 10000,
    });

    // Change sort option
    const sortSelect = page.locator('[aria-label="Seřadit výsledky"]');
    await sortSelect.selectOption({ label: 'Cena: od nejnižší' });

    // Verify the select reflects the new value
    await expect(sortSelect).not.toHaveValue('');
  });
});

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const apiUrl = 'http://localhost:3001/api';

const mockSpecialists = [
  {
    id: '1',
    name: 'Jan Novák',
    email: 'jan@example.com',
    specialization: 'Realitní agent',
    rating: 4.8,
    reviewCount: 24,
    city: 'Praha',
    description: 'Zkušený realitní agent.',
    profileImage: '/images/specialist-1.jpg',
  },
  {
    id: '2',
    name: 'Petra Svobodová',
    email: 'petra@example.com',
    specialization: 'Finanční poradce',
    rating: 4.6,
    reviewCount: 18,
    city: 'Brno',
    description: 'Certifikovaná finanční poradkyně.',
    profileImage: '/images/specialist-2.jpg',
  },
];

const mockCourses = [
  {
    id: '1',
    title: 'Základy realitního trhu',
    description: 'Komplexní kurz pro začínající realitní agenty.',
    instructor: 'Jan Novák',
    duration: '8 hodin',
    price: 2990,
    featured: true,
    image: '/images/course-1.jpg',
    rating: 4.7,
    studentsCount: 120,
  },
];

test.describe('Accessibility Tests', () => {
  test('homepage has no critical accessibility violations', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('contact page has no critical accessibility violations', async ({
    page,
  }) => {
    await page.goto('/kontakt');
    await page.waitForTimeout(2000);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast', 'label', 'select-name'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('login page has no critical accessibility violations', async ({
    page,
  }) => {
    await page.goto('/profi/prihlaseni');
    await page.waitForTimeout(2000);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('search page has no critical accessibility violations', async ({
    page,
  }) => {
    // Mock the specialists API to prevent loading errors
    await page.route(`${apiUrl}/specialists*`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ specialists: mockSpecialists, total: mockSpecialists.length }),
      })
    );

    await page.goto('/hledat');
    await page.waitForTimeout(2000);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('academy page has no critical accessibility violations', async ({
    page,
  }) => {
    // Mock the courses API to prevent loading errors
    await page.route(`${apiUrl}/courses*`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCourses),
      })
    );

    await page.goto('/academy');
    await page.waitForTimeout(2000);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});

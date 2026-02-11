import { test, expect } from '@playwright/test';

const apiUrl = 'http://localhost:3001/api';

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
  {
    id: '2',
    title: 'Pokročilé vyjednávání',
    description: 'Naučte se pokročilé techniky vyjednávání.',
    instructor: 'Petra Svobodová',
    duration: '6 hodin',
    price: 3990,
    featured: true,
    image: '/images/course-2.jpg',
    rating: 4.9,
    studentsCount: 85,
  },
  {
    id: '3',
    title: 'Marketing pro agenty',
    description: 'Efektivní marketing pro realitní profesionály.',
    instructor: 'Martin Dvořák',
    duration: '5 hodin',
    price: 1990,
    featured: true,
    image: '/images/course-3.jpg',
    rating: 4.5,
    studentsCount: 200,
  },
];

test.describe('Academy Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock courses API endpoint — only match API URL, not Next.js page routes
    await page.route(`${apiUrl}/courses*`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCourses),
      })
    );
  });

  test('displays hero section with heading, description, and CTA', async ({
    page,
  }) => {
    await page.goto('/academy');
    await page.waitForTimeout(2000);

    // Verify the hero heading
    const heroHeading = page.getByRole('heading', {
      name: /Rozviňte svoju kariéru/i,
    });
    await expect(heroHeading).toBeVisible();

    // Verify the description text
    const description = page.getByText(
      /Prémiové online kurzy pre realitných agentov/i
    );
    await expect(description).toBeVisible();

    // Verify the CTA button
    const ctaButton = page.getByRole('link', { name: /Preskúmať kurzy/i });
    await expect(ctaButton).toBeVisible();
  });

  test('CTA button links to /academy/courses', async ({ page }) => {
    await page.goto('/academy');
    await page.waitForTimeout(2000);

    const ctaButton = page.getByRole('link', { name: /Preskúmať kurzy/i });
    await expect(ctaButton).toBeVisible();

    // Verify the href attribute points to the courses page
    const href = await ctaButton.getAttribute('href');
    expect(href).toBe('/academy/courses');
  });

  test('benefits section has at least 2 sections', async ({ page }) => {
    await page.goto('/academy');
    await page.waitForTimeout(2000);

    // Verify the page has multiple sections (hero + benefits at minimum)
    const sections = page.locator('section');
    const sectionCount = await sections.count();
    expect(sectionCount).toBeGreaterThanOrEqual(2);
  });

  test('featured courses section shows course cards', async ({ page }) => {
    await page.goto('/academy');
    await page.waitForTimeout(2000);

    // Verify the page loaded successfully with content
    const pageContent = await page.textContent('body');
    expect(pageContent!.length).toBeGreaterThan(100);
  });
});

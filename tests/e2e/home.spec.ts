import { test, expect } from '@playwright/test';

test.describe('Digital Tower', () => {
  test('homepage loads hero content', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Digital Tower' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Prenota una discovery call' })).toBeVisible();
  });

  test('services page lists offerings', async ({ page }) => {
    await page.goto('/services');
    await expect(page.getByRole('heading', { name: 'Soluzioni full-stack per brand che vogliono ascendere' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Social Media Management' })).toBeVisible();
  });
});

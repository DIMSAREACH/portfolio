import { test, expect } from '@playwright/test';

test.describe('Public Navigation Flow', () => {
  test('should display home page with branding and core sections', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Home \| Dim Sareach/i);

    // Verify brand logo text
    const brand = page.locator('header a[aria-label="Dim Sareach Portfolio Home"]');
    await expect(brand).toBeVisible();
    await expect(brand).toContainText('Sareach');

    // Check navigation links presence
    const nav = page.locator('header nav[aria-label="Desktop Navigation"]');
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: /About/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /Skills/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /Projects/i })).toBeVisible();
  });

  test('should navigate to About page', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(/About Me \| Dim Sareach/i);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to Skills page', async ({ page }) => {
    await page.goto('/skills');
    await expect(page).toHaveTitle(/Skills & Expertise \| Dim Sareach/i);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to Projects page and open a project card if available', async ({ page }) => {
    await page.goto('/projects');
    await expect(page).toHaveTitle(/Projects \| Dim Sareach/i);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to Experience, Education, and Achievements pages', async ({ page }) => {
    await page.goto('/experience');
    await expect(page).toHaveTitle(/Work Experience \| Dim Sareach/i);

    await page.goto('/education');
    await expect(page).toHaveTitle(/Education & Certifications \| Dim Sareach/i);

    await page.goto('/achievements');
    await expect(page).toHaveTitle(/Achievements \| Dim Sareach/i);
  });

  test('should show 404 page for nonexistent routes', async ({ page }) => {
    await page.goto('/non-existent-random-page-12345');
    await expect(page).toHaveTitle(/404/i);
    await expect(page.getByText(/404/)).toBeVisible();
  });
});

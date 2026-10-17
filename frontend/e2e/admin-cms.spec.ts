import { test, expect } from '@playwright/test';

test.describe('Admin Authentication & CMS Operations', () => {
  test('should display login page and reject invalid credentials', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page).toHaveTitle(/Admin Login/i);

    const emailInput = page.locator('#email');
    const passwordInput = page.locator('#password');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // Fill incorrect credentials
    await emailInput.fill('invalid@portfolio.dev');
    await passwordInput.fill('WrongPassword123!');

    const submitBtn = page.locator('#login-submit-btn');
    await submitBtn.click();

    // Verify error banner appears
    const errorAlert = page.locator('#login-error-alert');
    await expect(errorAlert).toBeVisible({ timeout: 10000 });
  });

  test('should log in successfully with valid admin credentials and navigate CMS', async ({ page }) => {
    await page.goto('/admin/login');

    // Fill valid credentials
    await page.locator('#email').fill('admin@portfolio.dev');
    await page.locator('#password').fill('Admin@123456');

    const submitBtn = page.locator('#login-submit-btn');
    await submitBtn.click();

    // Expect navigation to admin dashboard
    await expect(page).toHaveURL(/\/admin/, { timeout: 15000 });

    // Verify admin layout is loaded
    const adminSidebar = page.locator('aside');
    await expect(adminSidebar).toBeVisible({ timeout: 10000 });

    // Navigate to Projects list
    await page.goto('/admin/projects');
    await expect(page).toHaveURL(/\/admin\/projects/);
    await expect(page.locator('h1').first()).toBeVisible();

    // Navigate to Skills list
    await page.goto('/admin/skills');
    await expect(page).toHaveURL(/\/admin\/skills/);
    await expect(page.locator('h1').first()).toBeVisible();

    // Navigate to Messages list
    await page.goto('/admin/messages');
    await expect(page).toHaveURL(/\/admin\/messages/);
    await expect(page.locator('h1').first()).toBeVisible();
  });
});

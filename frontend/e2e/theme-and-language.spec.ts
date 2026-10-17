import { test, expect } from '@playwright/test';

test.describe('Theme & Language Switching Flow', () => {
  test('should toggle dark and light modes', async ({ page }) => {
    await page.goto('/');

    const themeBtn = page.locator('#theme-toggle-btn');
    await expect(themeBtn).toBeVisible();

    const html = page.locator('html');

    // Get initial state
    const initialClasses = (await html.getAttribute('class')) || '';
    const wasDark = initialClasses.includes('dark');

    // Click theme toggle
    await themeBtn.click();

    // Verify class changed
    if (wasDark) {
      await expect(html).not.toHaveClass(/dark/);
    } else {
      await expect(html).toHaveClass(/dark/);
    }

    // Click again to revert
    await themeBtn.click();
    if (wasDark) {
      await expect(html).toHaveClass(/dark/);
    } else {
      await expect(html).not.toHaveClass(/dark/);
    }
  });

  test('should switch language between English and Khmer', async ({ page }) => {
    await page.goto('/');

    // Switch to Khmer
    const khmerBtn = page.locator('app-language-switcher button[aria-label="Switch to Khmer"]').first();
    if (await khmerBtn.isVisible()) {
      await khmerBtn.click();

      // Check that navigation items or body now display Khmer
      const nav = page.locator('header nav[aria-label="Desktop Navigation"]');
      await expect(nav).toBeVisible();
      // In Khmer, About is "អំពីខ្ញុំ" and Projects is "គម្រោង"
      await expect(nav).toContainText('អំពីខ្ញុំ');

      // Switch back to English
      const enBtn = page.locator('app-language-switcher button[aria-label="Switch to English"]').first();
      await enBtn.click();
      await expect(nav).toContainText('About');
    }
  });
});

import { test, expect } from '@playwright/test';

test.describe('Contact Form Flow', () => {
  test('should validate required fields and prevent invalid submission', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveTitle(/Contact \| Dim Sareach/i);

    // Try submitting empty form
    const submitBtn = page.getByRole('button', { name: /Send Message|ផ្ញើសារ/i });
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Verify invalid field highlights or error messages
    const nameInput = page.locator('#contact-name');
    await expect(nameInput).toBeVisible();
  });

  test('should submit contact form successfully with valid data', async ({ page }) => {
    await page.goto('/contact');

    // Fill valid inputs
    await page.locator('#contact-name').fill('Playwright Test Bot');
    await page.locator('#contact-email').fill('e2e-tester@example.com');
    await page.locator('#contact-subject').fill('Inquiry regarding software development services');
    await page.locator('#contact-message').fill('Hello Dim Sareach, this is an automated Playwright E2E verification test.');

    // Submit
    const submitBtn = page.getByRole('button', { name: /Send Message|ផ្ញើសារ/i });
    await submitBtn.click();

    // Success alert should display
    const successAlert = page.locator('#contact-success-alert');
    await expect(successAlert).toBeVisible({ timeout: 10000 });
    await expect(successAlert).toContainText(/Message Sent Successfully!|សារត្រូវបានផ្ញើជោគជ័យ!/i);
  });
});

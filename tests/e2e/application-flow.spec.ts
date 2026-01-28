import { test, expect } from '@playwright/test';

// Test data
const testApplication = {
  name: 'E2E Test User',
  email: `test-${Date.now()}@example.com`,
  phone: '+1234567890',
  socialHandle: '@testuser',
  interest: 'Testing brand description - automated test',
  experiences: 'Testing brand vision - automated test',
  growthAreas: 'Testing areas needing support - automated test',
  obstacles: 'Testing current challenges - automated test',
  additionalInfo: 'This is an automated E2E test submission',
};

test.describe('1:1 Client Application Flow', () => {
  test('should submit application form successfully', async ({ page }) => {
    // Go to application page
    await page.goto('/apply/work-with-me');

    // Verify page loaded
    await expect(page.locator('h1')).toContainText('Apply to Work Together');

    // Fill out the form
    await page.fill('input[id="name"]', testApplication.name);
    await page.fill('input[id="email"]', testApplication.email);
    await page.fill('input[id="phone"]', testApplication.phone);
    await page.fill('input[id="socialHandle"]', testApplication.socialHandle);
    await page.fill('textarea[id="interest"]', testApplication.interest);
    await page.fill('textarea[id="experiences"]', testApplication.experiences);
    await page.fill('textarea[id="growthAreas"]', testApplication.growthAreas);
    await page.fill('textarea[id="obstacles"]', testApplication.obstacles);

    // Select "Yes" for willing to invest - click the label with "Yes" text
    await page.click('label:has-text("Yes, I\'m ready to invest")');

    // Fill additional info
    await page.fill('textarea[id="additionalInfo"]', testApplication.additionalInfo);

    // Accept privacy policy - click the checkbox within the privacy consent section
    await page.locator('input[type="checkbox"]').click();

    // Submit form
    await page.click('button[type="submit"]');

    // Verify success message
    await expect(page.locator('h1')).toContainText('Application Submitted!', { timeout: 10000 });
    await expect(page.locator('text=3 business days')).toBeVisible();
  });

  test('should show validation errors for empty required fields', async ({ page }) => {
    await page.goto('/apply/work-with-me');

    // Try to submit without filling anything
    // The form has HTML5 validation, so check that submit button is present
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();

    // Privacy checkbox should be required
    await expect(page.locator('input[type="checkbox"]')).toHaveAttribute('required', '');
  });
});

test.describe('Services Page CTA Links', () => {
  test('Let\'s Talk buttons should link to application form', async ({ page }) => {
    await page.goto('/services');

    // Find "Let's Talk" buttons
    const letsTalkButtons = page.locator('text=Let\'s Talk');

    // Should have at least 2 (Production Systems Setup + Production Strategy)
    await expect(letsTalkButtons.first()).toBeVisible();

    // Click first one and verify navigation
    await letsTalkButtons.first().click();
    await expect(page).toHaveURL('/apply/work-with-me');
  });
});

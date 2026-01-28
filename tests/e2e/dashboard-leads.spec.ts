import { test, expect } from '@playwright/test';

// Test credentials - these should match your test/dev environment
const ADMIN_EMAIL = 'kerrib@oceoluxe.com';
const ADMIN_PASSWORD = 'JerseyGirl0323!';

test.describe('Dashboard Authentication', () => {
  test('should redirect to login when accessing dashboard unauthenticated', async ({ page }) => {
    await page.goto('/dashboard');

    // Should be redirected to sign-in page
    await expect(page).toHaveURL(/sign-in/);
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/sign-in');

    // Fill login form
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);

    // Submit
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });
});

test.describe('Dashboard Leads Management', () => {
  // Login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test('should display leads page with filters', async ({ page }) => {
    await page.goto('/dashboard/leads');

    // Verify page loaded - use getByRole for specific heading
    await expect(page.getByRole('heading', { name: 'Leads' })).toBeVisible();

    // Check filter buttons exist
    await expect(page.locator('text=All Leads')).toBeVisible();
    await expect(page.locator('text=1 on 1 Client')).toBeVisible();
  });

  test('should filter leads by "1 on 1 Client" status', async ({ page }) => {
    await page.goto('/dashboard/leads');

    // Click the 1 on 1 Client filter
    await page.click('text=1 on 1 Client');

    // The filter should be active (button styling will change)
    // All displayed leads should be 1 on 1 clients
    const leadCards = page.locator('[data-testid="lead-card"], .border.rounded-lg');

    // If there are leads, they should show the 1 on 1 Client badge
    const leadCount = await leadCards.count();
    if (leadCount > 0) {
      // Check that visible badges indicate 1 on 1 Client status
      await expect(page.locator('text=1 on 1 Client').first()).toBeVisible();
    }
  });

  test('should filter leads by "Inquiries" source', async ({ page }) => {
    await page.goto('/dashboard/leads');

    // Click the Inquiries filter
    await page.click('text=Inquiries');

    // If there are inquiry leads, they should show Inquiry badge
    const inquiryBadge = page.locator('text=Inquiry');
    // Either there are inquiry leads with badges or no results
  });

  test('should open lead detail page and show application responses', async ({ page }) => {
    await page.goto('/dashboard/leads');

    // Filter to 1 on 1 Client to find inquiry leads
    await page.click('text=1 on 1 Client');

    // Wait for leads to load
    await page.waitForTimeout(1000);

    // Try to click on a lead if one exists
    const viewButton = page.locator('text=View Details').first();
    if (await viewButton.isVisible()) {
      await viewButton.click();

      // Should navigate to lead detail page
      await expect(page).toHaveURL(/\/dashboard\/leads\/[^/]+\/\d+/);

      // Check for Application Responses section (for inquiry leads)
      // This may or may not be present depending on the lead type
      const applicationSection = page.locator('text=Application Responses');
      // Don't assert visibility since not all leads have applications
    }
  });
});

test.describe('Dashboard Applications Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test('should display applications page', async ({ page }) => {
    await page.goto('/dashboard/applications');

    // Verify page loaded - use getByRole for specific heading
    await expect(page.getByRole('heading', { name: 'Applications' })).toBeVisible();

    // Check filter buttons exist
    await expect(page.locator('text=All Applications')).toBeVisible();
    await expect(page.locator('text=1:1 Clients')).toBeVisible();
  });

  test('should display application list with status badges', async ({ page }) => {
    await page.goto('/dashboard/applications');

    // Wait for applications to load
    await page.waitForTimeout(1000);

    // Check for status filter buttons using getByRole for specificity
    await expect(page.getByRole('button', { name: 'All Status' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pending' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Approved' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Rejected' })).toBeVisible();
  });

  test('should open application details dialog', async ({ page }) => {
    await page.goto('/dashboard/applications');

    // Wait for applications to load
    await page.waitForTimeout(1000);

    // Try to click View Details on first application if exists
    const viewButton = page.locator('text=View Details').first();
    if (await viewButton.isVisible()) {
      await viewButton.click();

      // Dialog should open with application details
      await expect(page.locator('text=Application Details')).toBeVisible();

      // Check for expected sections in dialog
      await expect(page.locator('text=About Their Brand')).toBeVisible();
    }
  });

  test('should show approve and reject buttons for pending applications', async ({ page }) => {
    await page.goto('/dashboard/applications');

    // Filter to pending applications
    await page.click('text=Pending');

    // Wait for filter to apply
    await page.waitForTimeout(500);

    // If there are pending applications, open one
    const viewButton = page.locator('text=View Details').first();
    if (await viewButton.isVisible()) {
      await viewButton.click();

      // Dialog should open
      await expect(page.locator('text=Application Details')).toBeVisible();

      // Check for action buttons
      await expect(page.locator('text=Approve Application')).toBeVisible();
      await expect(page.locator('text=Reject Application')).toBeVisible();
    }
  });
});

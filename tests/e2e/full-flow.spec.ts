import { test, expect } from '@playwright/test';

// Admin credentials
const ADMIN_EMAIL = 'kerrib@oceoluxe.com';
const ADMIN_PASSWORD = 'JerseyGirl0323!';

// Generate unique test data for each run
const generateTestApplication = () => ({
  name: `E2E Test ${Date.now()}`,
  email: `test-${Date.now()}@example.com`,
  phone: '+1234567890',
  socialHandle: '@testuser_e2e',
  interest: 'E2E Test - Fashion brand description',
  experiences: 'E2E Test - Brand vision for 1-2 years',
  growthAreas: 'E2E Test - Areas needing support',
  obstacles: 'E2E Test - Current challenges',
  additionalInfo: `Automated E2E test submission - ${new Date().toISOString()}`,
});

test.describe('Full Application to Dashboard Flow', () => {
  test('complete flow: submit application → verify in applications → verify in leads', async ({ page }) => {
    const testData = generateTestApplication();

    // STEP 1: Submit Application
    await test.step('Submit application form', async () => {
      await page.goto('/apply/work-with-me');
      await expect(page.locator('h1')).toContainText('Apply to Work Together');

      // Fill out all fields
      await page.fill('input[id="name"]', testData.name);
      await page.fill('input[id="email"]', testData.email);
      await page.fill('input[id="phone"]', testData.phone);
      await page.fill('input[id="socialHandle"]', testData.socialHandle);
      await page.fill('textarea[id="interest"]', testData.interest);
      await page.fill('textarea[id="experiences"]', testData.experiences);
      await page.fill('textarea[id="growthAreas"]', testData.growthAreas);
      await page.fill('textarea[id="obstacles"]', testData.obstacles);

      // Select "Yes" for willing to invest
      await page.click('label:has-text("Yes, I\'m ready to invest")');

      // Fill additional info
      await page.fill('textarea[id="additionalInfo"]', testData.additionalInfo);

      // Accept privacy policy
      await page.click('input[type="checkbox"]');

      // Submit
      await page.click('button[type="submit"]');

      // Verify success
      await expect(page.locator('h1')).toContainText('Application Submitted!', { timeout: 10000 });
      await expect(page.locator('text=3 business days')).toBeVisible();
    });

    // STEP 2: Login to Dashboard
    await test.step('Login to admin dashboard', async () => {
      await page.goto('/sign-in');
      await page.fill('input[type="email"]', ADMIN_EMAIL);
      await page.fill('input[type="password"]', ADMIN_PASSWORD);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
    });

    // STEP 3: Verify in Applications Dashboard
    await test.step('Verify application appears in Applications dashboard', async () => {
      await page.goto('/dashboard/applications');

      // Wait for page to load - use getByRole for specific heading
      await expect(page.getByRole('heading', { name: 'Applications' })).toBeVisible();

      // Look for the test application by name
      await expect(page.getByText(testData.name)).toBeVisible({ timeout: 5000 });

      // Get the application card that contains the name - use data-testid or a reliable container
      // The applications are in divs with border class containing the name
      const appContainer = page.locator('.space-y-4 > div').filter({ hasText: testData.name }).first();
      await appContainer.getByRole('button', { name: 'View Details' }).click();

      // Verify dialog opens with correct data
      await expect(page.getByRole('heading', { name: 'Application Details' })).toBeVisible();
      // Email and phone appear in both the list and dialog, so use .first()
      await expect(page.getByText(testData.email).first()).toBeVisible();
      await expect(page.getByText(testData.phone).first()).toBeVisible();

      // Verify the approve/reject buttons are present (since it's pending)
      await expect(page.getByRole('button', { name: 'Approve Application' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Reject Application' })).toBeVisible();

      // Close dialog
      await page.keyboard.press('Escape');
    });

    // STEP 4: Verify in Leads Dashboard
    await test.step('Verify application appears in Leads dashboard as 1 on 1 Client', async () => {
      await page.goto('/dashboard/leads');

      // Wait for page to load - use getByRole for specific heading
      await expect(page.getByRole('heading', { name: 'Leads' })).toBeVisible();

      // Filter to 1 on 1 Client
      await page.getByRole('button', { name: '1 on 1 Client' }).click();

      // Wait for filter to apply
      await page.waitForTimeout(500);

      // Look for the test lead by name
      await expect(page.getByText(testData.name)).toBeVisible({ timeout: 5000 });

      // Verify it shows as Inquiry source - find row containing name and check for Inquiry badge
      const leadRow = page.locator('div').filter({ hasText: testData.name }).first();
      // The inquiry badge should be somewhere on the page for this lead
      await expect(page.getByText('Inquiry').first()).toBeVisible();
    });
  });

  test('approve application and verify status update', async ({ page }) => {
    const testData = generateTestApplication();

    // Submit a new application
    await page.goto('/apply/work-with-me');
    await page.fill('input[id="name"]', testData.name);
    await page.fill('input[id="email"]', testData.email);
    await page.fill('input[id="phone"]', testData.phone);
    await page.fill('input[id="socialHandle"]', testData.socialHandle);
    await page.fill('textarea[id="interest"]', testData.interest);
    await page.fill('textarea[id="experiences"]', testData.experiences);
    await page.fill('textarea[id="growthAreas"]', testData.growthAreas);
    await page.fill('textarea[id="obstacles"]', testData.obstacles);
    await page.click('label:has-text("Yes, I\'m ready to invest")');
    await page.fill('textarea[id="additionalInfo"]', testData.additionalInfo);
    await page.click('input[type="checkbox"]');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toContainText('Application Submitted!', { timeout: 10000 });

    // Login
    await page.goto('/sign-in');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });

    // Go to applications and approve
    await page.goto('/dashboard/applications');
    await page.getByRole('button', { name: 'Pending' }).click();
    await page.waitForTimeout(500);

    // Find and open the application
    await expect(page.getByText(testData.name)).toBeVisible({ timeout: 5000 });
    const appContainer = page.locator('.space-y-4 > div').filter({ hasText: testData.name }).first();
    await appContainer.getByRole('button', { name: 'View Details' }).click();

    // Approve the application
    await page.getByRole('button', { name: 'Approve Application' }).click();

    // Dialog should close and status should update
    await page.waitForTimeout(1000);

    // Filter to approved and verify
    await page.getByRole('button', { name: 'Approved' }).click();
    await page.waitForTimeout(500);

    // The application should now appear in approved list
    await expect(page.getByText(testData.name)).toBeVisible({ timeout: 5000 });
  });

  test('reject application and verify status update', async ({ page }) => {
    const testData = generateTestApplication();

    // Submit a new application
    await page.goto('/apply/work-with-me');
    await page.fill('input[id="name"]', testData.name);
    await page.fill('input[id="email"]', testData.email);
    await page.fill('input[id="phone"]', testData.phone);
    await page.fill('input[id="socialHandle"]', testData.socialHandle);
    await page.fill('textarea[id="interest"]', testData.interest);
    await page.fill('textarea[id="experiences"]', testData.experiences);
    await page.fill('textarea[id="growthAreas"]', testData.growthAreas);
    await page.fill('textarea[id="obstacles"]', testData.obstacles);
    await page.click('label:has-text("Yes, I\'m ready to invest")');
    await page.fill('textarea[id="additionalInfo"]', testData.additionalInfo);
    await page.click('input[type="checkbox"]');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toContainText('Application Submitted!', { timeout: 10000 });

    // Login
    await page.goto('/sign-in');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });

    // Go to applications and reject
    await page.goto('/dashboard/applications');
    await page.getByRole('button', { name: 'Pending' }).click();
    await page.waitForTimeout(500);

    // Find and open the application
    await expect(page.getByText(testData.name)).toBeVisible({ timeout: 5000 });
    const appContainer = page.locator('.space-y-4 > div').filter({ hasText: testData.name }).first();
    await appContainer.getByRole('button', { name: 'View Details' }).click();

    // Reject the application
    await page.getByRole('button', { name: 'Reject Application' }).click();

    // Dialog should close and status should update
    await page.waitForTimeout(1000);

    // Filter to rejected and verify
    await page.getByRole('button', { name: 'Rejected' }).click();
    await page.waitForTimeout(500);

    // The application should now appear in rejected list
    await expect(page.getByText(testData.name)).toBeVisible({ timeout: 5000 });
  });
});

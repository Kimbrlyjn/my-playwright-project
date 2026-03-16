import { test, expect } from '@playwright/test';

const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;
const BASE_URL = process.env.BASE_URL!;

test('Account Details - Validate all pages are accessible', async ({ page }) => {
  test.setTimeout(120000); // 2 minutes timeout

  // Login
  await test.step('Login', async () => {
    await page.goto(`${BASE_URL}/Login`);
    await page.waitForLoadState('networkidle');

    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill(USERNAME);
    await page.getByRole('button', { name: 'Login' }).click();

    await page.locator('input[type="password"]').click();
    await page.locator('input[type="password"]').fill(PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/\/Dashboard/i, { timeout: 15000 });
  });

  // Navigate to Account Details
  await test.step('Navigate to Account Details', async () => {
    await page.getByRole('button').nth(4).click();
    await page.getByRole('button', { name: 'Account Details Account' }).click();
    await expect(page).toHaveURL(/\/Account/i, { timeout: 10000 });
    const ss = await page.screenshot({ fullPage: true });
    await test.info().attach('0. Account Details Page', { body: ss, contentType: 'image/png' });
  });

  // 1. Manage Your Account
  await test.step('1. Validate Manage Your Account', async () => {
    await page.getByText('Manage Your Account').click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/AccountDetails/i, { timeout: 10000 });
    // Wait for actual content to load
    await expect(page.getByText('INDUSTRY').first()).toBeVisible({ timeout: 15000 });
    const ss = await page.screenshot({ fullPage: true });
    await test.info().attach('1. Manage Your Account', { body: ss, contentType: 'image/png' });
    await page.goBack();
    await page.waitForLoadState('networkidle');
  });

  // 2. Manage Your Users
  await test.step('2. Validate Manage Your Users', async () => {
    await page.getByText('Manage Your Users').click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/Users/i, { timeout: 10000 });
    // Wait for table to load
    await expect(page.getByText(/Rows per page/).first()).toBeVisible({ timeout: 15000 });
    const ss = await page.screenshot({ fullPage: true });
    await test.info().attach('2. Manage Your Users', { body: ss, contentType: 'image/png' });
    await page.goBack();
    await page.waitForLoadState('networkidle');
  });

  // 3. View Your Documents
  await test.step('3. Validate View Your Documents', async () => {
    await page.getByText('View Your Documents').click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/Documents/i, { timeout: 10000 });
    // Wait for table to load
    await expect(page.getByText(/Rows per page/).first()).toBeVisible({ timeout: 15000 });
    const ss = await page.screenshot({ fullPage: true });
    await test.info().attach('3. View Your Documents', { body: ss, contentType: 'image/png' });
    await page.goBack();
    await page.waitForLoadState('networkidle');
  });

  // 4. Manage your email alerts
  await test.step('4. Validate Manage Your Email Alerts', async () => {
    await page.getByText('Manage your email alerts').click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    const ss = await page.screenshot({ fullPage: true });
    await test.info().attach('4. Manage Email Alerts', { body: ss, contentType: 'image/png' });
    await page.goBack();
    await page.waitForLoadState('networkidle');
  });

  // 5. Manage your regions and divisions
  await test.step('5. Validate Manage Your Regions and Divisions', async () => {
    await page.getByText('Manage your regions and divisions').click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    const ss = await page.screenshot({ fullPage: true });
    await test.info().attach('5. Manage Regions and Divisions', { body: ss, contentType: 'image/png' });
    await page.goBack();
    await page.waitForLoadState('networkidle');
  });

  // 6. Manage your classifications
  await test.step('6. Validate Manage Your Classifications', async () => {
    await page.getByText('Manage your classifications').click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    const ss = await page.screenshot({ fullPage: true });
    await test.info().attach('6. Manage Classifications', { body: ss, contentType: 'image/png' });
    await page.goBack();
    await page.waitForLoadState('networkidle');
  });

  // 7. Manage your system managers
  await test.step('7. Validate Manage Your System Managers', async () => {
    await page.getByText('Manage your system managers').click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    const ss = await page.screenshot({ fullPage: true });
    await test.info().attach('7. Manage System Managers', { body: ss, contentType: 'image/png' });
    await page.goBack();
    await page.waitForLoadState('networkidle');
  });

  // 8. My Service Providers
  await test.step('8. Validate My Service Providers', async () => {
    await page.getByText('My Service Providers').first().click();
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('load');
    await page.waitForTimeout(5000);
    const ss = await page.screenshot();
    await test.info().attach('8. My Service Providers', { body: ss, contentType: 'image/png' });
    await page.goBack();
    await page.waitForLoadState('networkidle');
  });

  // 9. WebHook Logs
  await test.step('9. Validate WebHook Logs', async () => {
    await page.getByText('WebHook Logs').click();
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('load');
    await page.waitForTimeout(5000);
    const ss = await page.screenshot();
    await test.info().attach('9. WebHook Logs', { body: ss, contentType: 'image/png' });
  });

});
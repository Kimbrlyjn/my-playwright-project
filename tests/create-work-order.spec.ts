import { test, expect } from '@playwright/test';

const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;
const BASE_URL = process.env.BASE_URL!;

test('Verify successful work order creation', async ({ page }) => {
  test.setTimeout(120000);

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

  // Navigate to Work Orders
  await test.step('Navigate to Work Orders', async () => {
    await page.getByRole('link', { name: 'Work Orders' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/WorkOrders/i, { timeout: 10000 });
    const ss = await page.screenshot({ fullPage: true });
    await test.info().attach('1. Work Orders Page', { body: ss, contentType: 'image/png' });
  });

  // Click Create Work Order button
  await test.step('Click Create Work Order', async () => {
    await page.getByRole('button', { name: 'Create Work Order' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/CreateWorkOrder/i, { timeout: 10000 });
    const ss = await page.screenshot({ fullPage: true });
    await test.info().attach('2. Create Work Order Form', { body: ss, contentType: 'image/png' });
  });

  // Select Work Order Type (required)
  await test.step('Select Work Order Type', async () => {
    await page.locator('#WorkOrderType_Dropdown').click();
    await page.getByRole('option', { name: 'Trouble / Problem Ticket' }).click();
    await page.waitForTimeout(1000);
  });

  // Fill in Work Order Number (optional)
  await test.step('Fill Work Order Number', async () => {
    await page.getByRole('textbox', { name: 'Work Order Number' }).click();
    await page.getByRole('textbox', { name: 'Work Order Number' }).fill('AUTO-TEST-001');
  });

  // Fill in Purchase Order Number (optional)
  await test.step('Fill Purchase Order Number', async () => {
    await page.getByRole('textbox', { name: 'Purchase Order Number' }).click();
    await page.getByRole('textbox', { name: 'Purchase Order Number' }).fill('PO-001');
  });

  // Select Location (required)
  await test.step('Select Location', async () => {
    await page.locator('#Location_Dropdown').click();
    await page.getByRole('option', { name: "KG's location" }).click();
    await page.waitForTimeout(1000);
  });

  // Select Service Company (required)
  await test.step('Select Service Company', async () => {
    await page.locator('#ServiceCompany_Dropdown').click();
    await page.getByRole('option', { name: "Casey's Refrigeration Experts" }).click();
    await page.waitForTimeout(1000);
  });

  // Set Scheduled Date (required)
  await test.step('Set Scheduled Date', async () => {
    await page.getByRole('textbox', { name: 'Scheduled Date*' }).click();
    const today = new Date().getDate().toString();
    await page.getByRole('gridcell', { name: today }).click();
  });

  // Select Priority (required)
  await test.step('Select Priority', async () => {
    await page.getByLabel('', { exact: true }).click();
    await page.getByRole('option', { name: 'High Priority / Emergency' }).click();
    await page.waitForTimeout(1000);
  });

  // Enter Problem Description (required)
  await test.step('Enter Problem Description', async () => {
    await page.getByRole('textbox', { name: 'Problem Description' }).click();
    await page.getByRole('textbox', { name: 'Problem Description' }).fill('Test work order - automated test');
  });

  // Screenshot before submitting
  await test.step('Screenshot before Create', async () => {
    const ss = await page.screenshot({ fullPage: true });
    await test.info().attach('3. Filled Work Order Form', { body: ss, contentType: 'image/png' });
  });

  // Click Create button
  await test.step('Click Create', async () => {
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
  });

  // Verify work order was created successfully
  await test.step('Verify Work Order Created', async () => {
    await expect(page.getByRole('button', { name: 'VIEW WORK ORDER' })).toBeVisible({ timeout: 15000 });
    const ss = await page.screenshot({ fullPage: true });
    await test.info().attach('4. Work Order Created Successfully', { body: ss, contentType: 'image/png' });
  });

  // Click View Work Order
  await test.step('View Work Order', async () => {
    await page.getByRole('button', { name: 'VIEW WORK ORDER' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    const ss = await page.screenshot({ fullPage: true });
    await test.info().attach('5. Work Order Details', { body: ss, contentType: 'image/png' });
  });
});

import { test, expect, Page, Locator } from '@playwright/test';
import { generateLocationData } from './data/location-data';

const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;
const BASE_URL = process.env.BASE_URL!;

/**
 * Helper: locate an MUI text input by the label text visible in the DOM.
 * Uses substring matching — for ambiguous labels, pass nth index.
 */
function muiField(page: Page, label: string, nth = 0): Locator {
  return page
    .locator(`.MuiFormControl-root:has(label:has-text("${label}")) input[type="text"], .MuiFormControl-root:has(label:has-text("${label}")) input[type="number"]`)
    .nth(nth);
}

/**
 * Helper: locate an MUI Select (combobox) by its label text.
 */
function muiSelect(page: Page, label: string): Locator {
  return page.locator(`.MuiFormControl-root:has(label:has-text("${label}")) [role="combobox"]`);
}

/**
 * Helper: locate an MUI checkbox by its label text.
 */
function muiCheckbox(page: Page, label: string): Locator {
  return page.locator(`.MuiFormControl-root:has(label:has-text("${label}")) input[type="checkbox"]`);
}

/**
 * Helper: select a dropdown option, picking the first match if duplicates exist.
 */
async function selectOption(page: Page, name: string) {
  await page.getByRole('option', { name, exact: true }).first().click();
}

/**
 * Helper: fill a visible MUI text field, skipping hidden duplicates.
 */
async function fillVisibleField(page: Page, label: string, value: string) {
  const fields = page.locator(`.MuiFormControl-root:has(label:has-text("${label}")) input[type="text"]`);
  const count = await fields.count();
  for (let i = 0; i < count; i++) {
    if (await fields.nth(i).isVisible()) {
      await fields.nth(i).click();
      await fields.nth(i).fill(value);
      return;
    }
  }
}

test('Verify successful location creation with all fields', async ({ page }) => {
  test.setTimeout(180000);

  const data = generateLocationData();
  test.info().annotations.push({ type: 'location', description: data.locationName });

  // ── Login ──────────────────────────────────────────────────────────
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

  // ── Navigate to Locations ──────────────────────────────────────────
  await test.step('Navigate to Locations', async () => {
    await page.getByRole('link', { name: 'Locations' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/Locations/i, { timeout: 10000 });
    const ss = await page.screenshot({ fullPage: true });
    await test.info().attach('1. Locations Page', { body: ss, contentType: 'image/png' });
  });

  // ── Click Create Location ──────────────────────────────────────────
  await test.step('Click Create Location', async () => {
    await page.getByRole('button', { name: 'Create Location' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/CreateLocation/i, { timeout: 10000 });
    await page.waitForTimeout(1000);
    const ss = await page.screenshot({ fullPage: true });
    await test.info().attach('2. Create Location Form', { body: ss, contentType: 'image/png' });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 1: Location Details
  // ══════════════════════════════════════════════════════════════════

  // ── Required fields ──
  await test.step('Fill Location Name', async () => {
    await muiField(page, 'Location Name').click();
    await muiField(page, 'Location Name').fill(data.locationName);
  });

  await test.step('Select Location Type', async () => {
    await muiSelect(page, 'Location Type').click();
    await selectOption(page, data.locationType);
    await page.waitForTimeout(500);
  });

  // ── Optional dropdowns ──
  await test.step('Select Region / Division', async () => {
    await muiSelect(page, 'Region / Division').click();
    await selectOption(page, data.region);
    await page.waitForTimeout(500);
  });

  await test.step('Select Preferred Vendor', async () => {
    await muiSelect(page, 'Preferred Vendor').click();
    await selectOption(page, data.preferredVendor);
    await page.waitForTimeout(500);
  });

  await test.step('Select Classification', async () => {
    await muiSelect(page, 'Classification').click();
    await selectOption(page, data.classification);
    await page.waitForTimeout(500);
  });

  await test.step('Select Usage Type', async () => {
    await muiSelect(page, 'Usage Type').click();
    await selectOption(page, data.usageType);
    await page.waitForTimeout(500);
  });

  // ── Optional text fields ──
  await test.step('Fill NAICS Business Type Code', async () => {
    await muiField(page, 'NAICS Business Type Code').click();
    await muiField(page, 'NAICS Business Type Code').fill(data.naicsCode);
  });

  await test.step('Fill SIC Code', async () => {
    await muiField(page, 'Standard Industrial Classification').click();
    await muiField(page, 'Standard Industrial Classification').fill(data.sicCode);
  });

  await test.step('Fill AQMD ID', async () => {
    await muiField(page, 'AQMD ID').click();
    await muiField(page, 'AQMD ID').fill(data.aqmdId);
  });

  await test.step('Fill EPA ID', async () => {
    await muiField(page, 'EPA ID').click();
    await muiField(page, 'EPA ID').fill(data.epaId);
  });

  await test.step('Fill Ref ID', async () => {
    await muiField(page, 'Ref ID').click();
    await muiField(page, 'Ref ID').fill(data.refId);
  });

  await test.step('Fill Operator Federal Tax ID', async () => {
    await muiField(page, 'Operator Federal Tax Identification Number').click();
    await muiField(page, 'Operator Federal Tax Identification Number').fill(data.operatorTaxId);
  });

  // ── Optional dropdowns (continued) ──
  await test.step('Select Year Built', async () => {
    await muiSelect(page, 'Year Built').click();
    await selectOption(page, data.yearBuilt);
    await page.waitForTimeout(500);
  });

  // ── Operation Date ──
  await test.step('Fill Operation Date', async () => {
    await muiField(page, 'Operation Date').click();
    await muiField(page, 'Operation Date').fill(data.operationDate);
  });

  // ── More optional text fields ──
  await test.step('Fill Gross Area Square Feet', async () => {
    await muiField(page, 'Gross Area Square Feet').click();
    await muiField(page, 'Gross Area Square Feet').fill(data.grossAreaSqFt);
  });

  await test.step('Fill Occupancy Percent', async () => {
    await muiField(page, 'Occupancy Percent').click();
    await muiField(page, 'Occupancy Percent').fill(data.occupancyPercent);
  });

  await test.step('Select Construction Status', async () => {
    await muiSelect(page, 'Construction Status').click();
    await selectOption(page, data.constructionStatus);
    await page.waitForTimeout(500);
  });

  await test.step('Fill Code', async () => {
    // "Code" label is ambiguous (also matches "NAICS Business Type Code", "SIC Code")
    // The standalone "Code" field is the 3rd match (index 2)
    await muiField(page, 'Code', 2).click();
    await muiField(page, 'Code', 2).fill(data.code);
  });

  await test.step('Fill Additional Notes', async () => {
    await muiField(page, 'Additional Notes').click();
    await muiField(page, 'Additional Notes').fill(data.additionalNotes);
  });

  // ── Toggles / checkboxes ──
  await test.step('Set toggle fields', async () => {
    if (data.temporaryBuilding) {
      await muiCheckbox(page, 'Temporary Building').check();
    }
    if (data.federalProperty) {
      await muiCheckbox(page, 'Federal Property').check();
    }
    if (data.isOffsite) {
      await muiCheckbox(page, 'Is Offsite').check();
    }
  });

  await test.step('Screenshot Step 1 - Location Details', async () => {
    const ss = await page.screenshot({ fullPage: true });
    await test.info().attach('3. Location Details Filled', { body: ss, contentType: 'image/png' });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 2: Address
  // ══════════════════════════════════════════════════════════════════
  await test.step('Click Next to Address', async () => {
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    const ss = await page.screenshot({ fullPage: true });
    await test.info().attach('4. Address Step', { body: ss, contentType: 'image/png' });
  });

  await test.step('Fill Address fields', async () => {
    const addr = data.address;

    // Select Country first since it may reset dependent fields
    await muiSelect(page, 'Country').first().click();
    await selectOption(page, addr.country);
    await page.waitForTimeout(1000);

    await muiField(page, 'Street').click();
    await muiField(page, 'Street').fill(addr.street);

    await muiField(page, 'Zip').click();
    await muiField(page, 'Zip').fill(addr.zip);

    await muiField(page, 'City').click();
    await muiField(page, 'City').fill(addr.city);

    // State/Province becomes a combobox after Country is selected
    await muiSelect(page, 'State / Province').first().click();
    await selectOption(page, addr.state);
    await page.waitForTimeout(500);
  });

  // ── Optional address fields ──
  await test.step('Fill optional Address fields', async () => {
    const opt = data.addressOptional;

    if (opt.street2) {
      await muiField(page, 'Street 2').click();
      await muiField(page, 'Street 2').fill(opt.street2);
    }

    await muiField(page, 'Latitude').click();
    await muiField(page, 'Latitude').fill(opt.latitude);

    await muiField(page, 'Longitude').click();
    await muiField(page, 'Longitude').fill(opt.longitude);
  });

  await test.step('Screenshot Step 2 - Address', async () => {
    const ss = await page.screenshot({ fullPage: true });
    await test.info().attach('5. Address Filled', { body: ss, contentType: 'image/png' });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 3: Contact
  // ══════════════════════════════════════════════════════════════════
  await test.step('Click Next to Contact', async () => {
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    const ss = await page.screenshot({ fullPage: true });
    await test.info().attach('6. Contact Step', { body: ss, contentType: 'image/png' });
  });

  await test.step('Fill Contact fields', async () => {
    const contact = data.contact;

    // There are two identical contact sections in the DOM (Main + Alternate);
    // the visible one may not be the first — use fillVisibleField helper.
    await fillVisibleField(page, 'First Name', contact.firstName);
    await fillVisibleField(page, 'Last Name', contact.lastName);
    await fillVisibleField(page, 'Email Address', contact.email);
    await fillVisibleField(page, 'Main Phone', contact.phone);
  });

  await test.step('Screenshot Step 3 - Contact', async () => {
    const ss = await page.screenshot({ fullPage: true });
    await test.info().attach('7. Contact Filled', { body: ss, contentType: 'image/png' });
  });

  // ══════════════════════════════════════════════════════════════════
  // SUBMIT & VERIFY
  // ══════════════════════════════════════════════════════════════════
  await test.step('Click Create/Save', async () => {
    // The submit button may be labeled "Create", "Save", or "Submit"
    const createBtn = page.getByRole('button', { name: 'Create' });
    const saveBtn = page.getByRole('button', { name: 'Save' });
    const submitBtn = page.getByRole('button', { name: 'Submit' });

    if (await createBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createBtn.click();
    } else if (await saveBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await saveBtn.click();
    } else if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await submitBtn.click();
    } else {
      const ss = await page.screenshot({ fullPage: true });
      await test.info().attach('Submit Button Not Found', { body: ss, contentType: 'image/png' });
      throw new Error('Could not find a submit button (Create/Save/Submit)');
    }

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
  });

  await test.step('Verify Location Created', async () => {
    // A success modal appears: "Location successfully created."
    await expect(page.getByText('Location successfully created')).toBeVisible({ timeout: 10000 });
    const ss = await page.screenshot({ fullPage: true });
    await test.info().attach('8. Location Created - Success Modal', { body: ss, contentType: 'image/png' });

    // Click "View Location Details" to confirm navigation
    await page.getByRole('button', { name: 'View Location Details' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    const detailSs = await page.screenshot({ fullPage: true });
    await test.info().attach('9. Location Detail Page', { body: detailSs, contentType: 'image/png' });
  });
});

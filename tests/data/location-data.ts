/**
 * Dynamic test data for Location creation tests.
 * No hardcoded values — generates unique data on each run.
 * Dropdown options are sourced from the staging environment.
 */

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDigits(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCoord(min: number, max: number, decimals = 6): string {
  return (Math.random() * (max - min) + min).toFixed(decimals);
}

function randomDate(startYear: number, endYear: number): string {
  const month = String(randomInt(1, 12)).padStart(2, '0');
  const day = String(randomInt(1, 28)).padStart(2, '0');
  const year = randomInt(startYear, endYear);
  return `${month}/${day}/${year}`;
}

// ── Dropdown options (sourced from staging app) ───────────────────────

export const LOCATION_TYPES = [
  'Service Location',
  'Wholesaler/Supplier',
  'Warehouse',
] as const;

export const REGIONS = [
  'New Region 4',
  'Test Bryan Region / Division',
] as const;

export const CLASSIFICATIONS = [
  'Commercial property',
  'Leased',
  'Office Space',
  'CAL',
] as const;

export const USAGE_TYPES = [
  'Office',
  'Retail Store',
  'Restaurant',
  'Hotel',
  'Hospital (General Medical & Surgical)',
  'K-12 School',
  'Manufacturing/Industrial Plant',
  'Non-Refrigerated Warehouse',
  'Supermarket/Grocery Store',
] as const;

export const CONSTRUCTION_STATUSES = [
  'Existing',
  'Project',
  'Test',
] as const;

export const PREFERRED_VENDORS = [
  "Casey's Refrigeration Experts",
  'Airplus Refrigeration',
  'Cloud Compliance Real Estate',
] as const;

export const US_STATES = [
  'California', 'Texas', 'New York', 'Florida', 'Washington',
  'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'Tennessee',
] as const;

export const YEAR_BUILT_OPTIONS = [
  '2025', '2024', '2023', '2022', '2021', '2020',
  '2019', '2018', '2017', '2016', '2015', '2010', '2005', '2000',
] as const;

// ── Data generator ────────────────────────────────────────────────────
export function generateLocationData() {
  const timestamp = Date.now();

  return {
    // Step 1: Location Details — Required
    locationName: `AUTO-LOC-${timestamp}`,
    locationType: randomFrom([...LOCATION_TYPES]),

    // Step 1: Location Details — Optional dropdowns
    region: randomFrom([...REGIONS]),
    preferredVendor: randomFrom([...PREFERRED_VENDORS]),
    classification: randomFrom([...CLASSIFICATIONS]),
    usageType: randomFrom([...USAGE_TYPES]),
    yearBuilt: randomFrom([...YEAR_BUILT_OPTIONS]),
    constructionStatus: randomFrom([...CONSTRUCTION_STATUSES]),

    // Step 1: Location Details — Optional text fields
    naicsCode: randomDigits(6),
    sicCode: randomDigits(4),
    aqmdId: `AQMD-${randomDigits(5)}`,
    epaId: `EPA-${randomDigits(8)}`,
    refId: `REF-${randomDigits(6)}`,
    operatorTaxId: `${randomDigits(2)}-${randomDigits(7)}`,
    operationDate: randomDate(2015, 2025),
    grossAreaSqFt: String(randomInt(1000, 50000)),
    occupancyPercent: String(randomInt(10, 100)),
    code: `CODE-${randomDigits(4)}`,
    additionalNotes: `Auto-generated test location at ${new Date().toISOString()}`,

    // Step 1: Location Details — Toggles
    temporaryBuilding: Math.random() > 0.5,
    federalProperty: Math.random() > 0.5,
    isOffsite: Math.random() > 0.5,

    // Step 2: Address — Required
    address: {
      country: 'United States',
      street: `${randomInt(100, 9999)} ${randomFrom(['Main St', 'Oak Ave', 'Elm Blvd', 'Pine Dr', 'Maple Ln'])}`,
      zip: randomDigits(5),
      city: randomFrom(['Austin', 'Seattle', 'Denver', 'Portland', 'Nashville', 'Phoenix']),
      state: randomFrom([...US_STATES]),
    },

    // Step 2: Address — Optional
    addressOptional: {
      street2: randomFrom(['Suite 100', 'Apt 4B', 'Floor 3', 'Unit 12', '']),
      latitude: randomCoord(25, 48),
      longitude: randomCoord(-125, -70),
    },

    // Step 3: Contact — Main
    contact: {
      firstName: randomFrom(['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley']),
      lastName: randomFrom(['Smith', 'Johnson', 'Lee', 'Garcia', 'Martinez', 'Clark']),
      email: `auto.test+${timestamp}@example.com`,
      phone: `${randomDigits(3)}-${randomDigits(3)}-${randomDigits(4)}`,
    },
  };
}

/** Use a fixed dataset when you need repeatable values */
export function generateFixedLocationData(overrides: Partial<ReturnType<typeof generateLocationData>> = {}) {
  return {
    ...generateLocationData(),
    ...overrides,
  };
}

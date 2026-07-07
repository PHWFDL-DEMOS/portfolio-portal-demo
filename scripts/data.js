export const DEMO_PROPERTY = {
  titleRef: 'PROP-DEMO-001',
  postcode: 'EC2V 7HN',
  propertyNumber: '25',
  street: 'Moorgate',
  city: 'London',
  tenancyStatus: 'Let',
  startDate: '2024-04-01',
  monthlyRent: '1850',
  mortgageProvider: 'NatWest',
  productType: 'Buy-to-Let Fixed',
  mortgageEndDate: '2029-04-01',
  mortgageBalance: '312500',
  paymentType: 'Repayment',
  monthlyPayments: '1045',
};

export const DEMO_PROPERTY_REQUIRED = {
  titleRef: 'PROP-DEMO-001',
  postcode: 'EC2V 7HN',
  propertyNumber: '25',
  street: 'Moorgate',
  city: 'London',
};

export const DEMO_MANUAL_PERFECT = {
  titleRef: 'PROP-001',
  postcode: 'EC2V 7HN',
  propertyNumber: '25',
  street: 'Moorgate',
  city: 'London',
  addressId: 'ec2v-25',
};

export const DEMO_MANUAL_IMPERFECT = {
  titleRef: '',
  postcode: 'EC2V 7HN',
  propertyNumber: '25',
  street: 'Morgate',
  city: 'London',
  addressId: '',
};

/** Registered addresses for postcode lookup (demo). Includes AVM outputs. */
export const ADDRESS_LOOKUP = [
  { id: 'ec2v-25', postcode: 'EC2V 7HN', propertyNumber: '25', street: 'Moorgate', city: 'London', avmValue: 612000, marketRent: 2450, occupancy: 'Rented' },
  { id: 'ec2v-27', postcode: 'EC2V 7HN', propertyNumber: '27', street: 'Moorgate', city: 'London', avmValue: 585000, marketRent: 2380, occupancy: 'Rented' },
  { id: 'ec2v-1', postcode: 'EC2V 7HN', propertyNumber: '1', street: "Prince's Court", city: 'London', avmValue: 720000, marketRent: 2650, occupancy: 'Rented' },
  { id: 'm1-12', postcode: 'M1 4BT', propertyNumber: '12', street: 'Deansgate', city: 'Manchester', avmValue: 285000, marketRent: 1450, occupancy: 'Rented' },
  { id: 'm1-45', postcode: 'M1 4BT', propertyNumber: '45', street: 'Deansgate', city: 'Manchester', avmValue: 310000, marketRent: 1520, occupancy: 'Vacant' },
  { id: 'bs1-14', postcode: 'BS1 4DJ', propertyNumber: '14', street: 'Harbour View', city: 'Bristol', avmValue: 335000, marketRent: 1380, occupancy: 'Vacant' },
  { id: 'bs1-2', postcode: 'BS1 4DJ', propertyNumber: '2', street: 'Queen Square', city: 'Bristol', avmValue: 420000, marketRent: 1650, occupancy: 'Rented' },
  { id: 'eh3-8', postcode: 'EH3 9AA', propertyNumber: '8', street: 'Royal Terrace', city: 'Edinburgh', avmValue: 395000, marketRent: 1580, occupancy: 'Rented' },
  { id: 'ls1-3', postcode: 'LS1 4DY', propertyNumber: '3', street: 'The Calls', city: 'Leeds', avmValue: 248000, marketRent: 1120, occupancy: 'Vacant' },
];

/** Buy-to-let sale listings for the investment marketplace demo. */
export const OPPORTUNITY_EQUITY_THRESHOLD = 50000;
export const MARKETPLACE_MAX_ASKING_PRICE = 1000000;
export const MARKETPLACE_MIN_GROSS_YIELD = 5;
export const MARKETPLACE_DEPOSIT_PCT = 25;
export const MARKETPLACE_MORTGAGE_RATE = 5.29;
export const CURRENT_BEST_MORTGAGE_RATE = 4.99;
export const REFINANCE_RATE_THRESHOLD = 0.5;
export const RENT_REVIEW_GAP_THRESHOLD = 500;
export const MORTGAGE_RENEWAL_WINDOW_MONTHS = 3;
export const POOR_EPC_RATINGS = ['D', 'E', 'F', 'G'];
export const TARGET_EPC_RATINGS = ['A', 'B', 'C'];
export const EPC_IMPROVEMENT_MORTGAGE_RATE = 4.99;

export const MARKETPLACE_LISTINGS = [
  {
    id: 'mp-mcr-1',
    propertyNumber: '8',
    street: 'Whitworth Street',
    city: 'Manchester',
    postcode: 'M1 3WE',
    propertyType: 'Apartment',
    bedrooms: 2,
    askingPrice: 265000,
    marketRent: 1350,
    epcRating: 'C',
  },
  {
    id: 'mp-mcr-2',
    propertyNumber: '22',
    street: 'Portland Street',
    city: 'Manchester',
    postcode: 'M1 3BE',
    propertyType: 'Apartment',
    bedrooms: 1,
    askingPrice: 295000,
    marketRent: 1280,
    epcRating: 'B',
    investorClub: true,
  },
  {
    id: 'mp-brs-1',
    propertyNumber: '6',
    street: 'Redcliffe Parade',
    city: 'Bristol',
    postcode: 'BS1 6SP',
    propertyType: 'Apartment',
    bedrooms: 2,
    askingPrice: 318000,
    marketRent: 1380,
    epcRating: 'D',
  },
  {
    id: 'mp-brs-2',
    propertyNumber: '11',
    street: 'Clifton Road',
    city: 'Bristol',
    postcode: 'BS8 4AF',
    propertyType: 'House',
    bedrooms: 3,
    askingPrice: 425000,
    marketRent: 1800,
    epcRating: 'C',
  },
  {
    id: 'mp-ldn-1',
    propertyNumber: '14',
    street: 'High Street',
    city: 'London',
    postcode: 'CR0 1TY',
    propertyType: 'Apartment',
    bedrooms: 2,
    askingPrice: 475000,
    marketRent: 2050,
    epcRating: 'B',
    investorClub: true,
  },
  {
    id: 'mp-ldn-2',
    propertyNumber: '3',
    street: 'Station Approach',
    city: 'London',
    postcode: 'UB8 1AB',
    propertyType: 'Apartment',
    bedrooms: 2,
    askingPrice: 499000,
    marketRent: 2100,
    epcRating: 'C',
  },
  {
    id: 'mp-leeds-1',
    propertyNumber: '7',
    street: 'The Calls',
    city: 'Leeds',
    postcode: 'LS2 7EH',
    propertyType: 'Apartment',
    bedrooms: 2,
    askingPrice: 248000,
    marketRent: 1120,
    epcRating: 'E',
  },
  {
    id: 'mp-liv-1',
    propertyNumber: '19',
    street: 'Bold Street',
    city: 'Liverpool',
    postcode: 'L1 4DN',
    propertyType: 'Apartment',
    bedrooms: 1,
    askingPrice: 185000,
    marketRent: 850,
    epcRating: 'C',
    investorClub: true,
  },
  {
    id: 'mp-bham-1',
    propertyNumber: '45',
    street: 'Broad Street',
    city: 'Birmingham',
    postcode: 'B1 2ND',
    propertyType: 'Apartment',
    bedrooms: 2,
    askingPrice: 275000,
    marketRent: 1225,
    epcRating: 'B',
    investorClub: true,
  },
  {
    id: 'mp-edi-1',
    propertyNumber: '12',
    street: 'Leith Walk',
    city: 'Edinburgh',
    postcode: 'EH6 5AA',
    propertyType: 'Flat',
    bedrooms: 2,
    askingPrice: 385000,
    marketRent: 1650,
    epcRating: 'C',
  },
  {
    id: 'mp-mcr-3',
    propertyNumber: '5',
    street: 'Oxford Road',
    city: 'Manchester',
    postcode: 'M1 7ED',
    propertyType: 'Apartment',
    bedrooms: 3,
    askingPrice: 545000,
    marketRent: 2400,
    epcRating: 'D',
  },
  {
    id: 'mp-brs-3',
    propertyNumber: '18',
    street: 'Park Street',
    city: 'Bristol',
    postcode: 'BS1 5JG',
    propertyType: 'House',
    bedrooms: 3,
    askingPrice: 580000,
    marketRent: 2550,
    epcRating: 'C',
  },
  {
    id: 'mp-ldn-3',
    propertyNumber: '42',
    street: 'Greenwich High Road',
    city: 'London',
    postcode: 'SE10 8JL',
    propertyType: 'Apartment',
    bedrooms: 2,
    askingPrice: 685000,
    marketRent: 2980,
    epcRating: 'B',
  },
  {
    id: 'mp-ldn-4',
    propertyNumber: '9',
    street: 'Wembley Park Boulevard',
    city: 'London',
    postcode: 'HA9 0FD',
    propertyType: 'Apartment',
    bedrooms: 3,
    askingPrice: 825000,
    marketRent: 3600,
    epcRating: 'C',
  },
  {
    id: 'mp-ldn-5',
    propertyNumber: '2',
    street: 'Richmond Hill',
    city: 'London',
    postcode: 'TW10 6RP',
    propertyType: 'House',
    bedrooms: 4,
    askingPrice: 950000,
    marketRent: 4100,
    epcRating: 'A',
  },
  {
    id: 'mp-edi-2',
    propertyNumber: '28',
    street: 'Morningside Road',
    city: 'Edinburgh',
    postcode: 'EH10 4DD',
    propertyType: 'Flat',
    bedrooms: 3,
    askingPrice: 520000,
    marketRent: 2280,
    epcRating: 'D',
  },
];

export function calculateGrossYield(askingPrice, marketRentPcm) {
  const price = Number(askingPrice) || 0;
  const rent = Number(marketRentPcm) || 0;
  if (price <= 0 || rent <= 0) return null;
  return (rent * 12 / price) * 100;
}

export function getQualifiedMarketplaceListings(listings = MARKETPLACE_LISTINGS) {
  return listings
    .map((listing) => ({
      ...listing,
      grossYield: calculateGrossYield(listing.askingPrice, listing.marketRent),
    }))
    .filter((listing) => (
      listing.askingPrice <= MARKETPLACE_MAX_ASKING_PRICE
      && listing.grossYield >= MARKETPLACE_MIN_GROSS_YIELD
    ))
    .sort((a, b) => b.grossYield - a.grossYield);
}

export function isCompliantEpcRating(rating) {
  return TARGET_EPC_RATINGS.includes(String(rating || '').trim().toUpperCase());
}

export function filterMarketplaceByEpc(listings, filter = 'all') {
  if (filter === 'compliant') {
    return listings.filter((listing) => isCompliantEpcRating(listing.epcRating));
  }
  return listings;
}

export function filterMarketplaceByInvestorClub(listings, filter = 'all') {
  if (filter === 'investor-club') {
    return listings.filter((listing) => listing.investorClub === true);
  }
  return listings;
}

export function applyMarketplaceFilters(listings, { epcFilter = 'all', investorClubFilter = 'all' } = {}) {
  return filterMarketplaceByInvestorClub(
    filterMarketplaceByEpc(listings, epcFilter),
    investorClubFilter,
  );
}

export function getMarketplaceListingById(id) {
  return getQualifiedMarketplaceListings().find((listing) => listing.id === id) || null;
}

export function buildMortgageQuote(listing) {
  const askingPrice = Number(listing.askingPrice) || 0;
  const deposit = Math.round(askingPrice * (MARKETPLACE_DEPOSIT_PCT / 100));
  const loanAmount = askingPrice - deposit;
  const monthlyPayment = Math.round(loanAmount * (MARKETPLACE_MORTGAGE_RATE / 100 / 12));

  return {
    askingPrice,
    deposit,
    depositPct: MARKETPLACE_DEPOSIT_PCT,
    loanAmount,
    interestRate: MARKETPLACE_MORTGAGE_RATE,
    monthlyPayment,
    grossYield: listing.grossYield ?? calculateGrossYield(askingPrice, listing.marketRent),
    estimatedMarketRent: listing.marketRent,
  };
}

export function computePortfolioMetricsAfterPurchase(properties, listing, quote) {
  const newProperty = {
    titleRef: `ACQ-${listing.city.slice(0, 3).toUpperCase()}-${listing.propertyNumber}`,
    postcode: listing.postcode,
    propertyNumber: listing.propertyNumber,
    street: listing.street,
    city: listing.city,
    avmValue: listing.askingPrice,
    purchasePrice: String(listing.askingPrice),
    purchaseDate: new Date().toISOString().slice(0, 10),
    marketRent: listing.marketRent,
    rentAgreed: String(listing.marketRent),
    mortgageBalance: String(quote.loanAmount),
    interestRate: String(quote.interestRate),
    monthlyPayments: String(quote.monthlyPayment),
    mortgageProvider: 'ACME Mortgages',
    mortgageProductType: 'Fixed rate',
    mortgageEndDate: '02/2031',
    occupancy: 'Vacant',
  };

  return computePortfolioMetrics([...properties, newProperty]);
}

export function getPortfolioMarketOpportunities(portfolioProperties = []) {
  const cities = [...new Set(
    portfolioProperties.map((property) => String(property.city || '').trim()).filter(Boolean),
  )];
  const qualified = getQualifiedMarketplaceListings();
  const localListings = cities.length === 0
    ? qualified
    : qualified.filter((listing) => cities.includes(listing.city));

  return {
    count: localListings.length,
    listings: localListings,
    cities,
  };
}

export function normalizePostcode(postcode) {
  return String(postcode || '').toUpperCase().replace(/\s+/g, ' ').trim();
}

export function searchAddressesByPostcode(postcode) {
  const normalized = normalizePostcode(postcode);
  if (normalized.length < 3) return [];
  const compact = normalized.replace(/\s/g, '');
  return ADDRESS_LOOKUP.filter((entry) => {
    const entryCompact = entry.postcode.replace(/\s/g, '');
    return entryCompact.startsWith(compact) || entry.postcode.startsWith(normalized);
  });
}

export function findRegisteredAddress(property) {
  const postcode = normalizePostcode(property.postcode);
  return ADDRESS_LOOKUP.find(
    (entry) =>
      normalizePostcode(entry.postcode) === postcode
      && entry.propertyNumber === String(property.propertyNumber || '').trim()
      && entry.street.toLowerCase() === String(property.street || '').trim().toLowerCase()
      && entry.city.toLowerCase() === String(property.city || '').trim().toLowerCase(),
  );
}

export function validateProperty(property) {
  const errors = {};

  REQUIRED_FIELDS.forEach((field) => {
    if (!String(property[field] || '').trim()) {
      errors[field] = `${FIELD_LABELS[field]} is required`;
    }
  });

  if (property.postcode && !errors.postcode) {
    const matches = searchAddressesByPostcode(property.postcode);
    if (!matches.length) {
      errors.postcode = 'Postcode not recognised — check and try again';
    }
  }

  if (!errors.postcode && !errors.propertyNumber && !errors.street && !errors.city) {
    const registered = findRegisteredAddress(property);
    if (!registered) {
      errors.street = 'Address does not match our records for this postcode';
      errors.city = 'City does not match our records for this postcode';
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/** Attach platform AVM outputs when a property is added to a portfolio. */
export function enrichPropertyWithAvm(property) {
  const registered = findRegisteredAddress(property);
  const enriched = {
    ...property,
    rentAgreed: property.rentAgreed ?? '',
    purchasePrice: property.purchasePrice ?? '',
    purchaseDate: property.purchaseDate ?? '',
    monthlyPayments: property.monthlyPayments ?? '',
    interestRate: property.interestRate ?? '',
    mortgageProvider: property.mortgageProvider ?? '',
    mortgageEndDate: property.mortgageEndDate ?? '',
    mortgageBalance: property.mortgageBalance ?? '',
    occupancy: property.occupancy ?? '',
  };

  if (registered) {
    enriched.avmValue = registered.avmValue;
    enriched.marketRent = registered.marketRent;
    if (registered.occupancy) enriched.occupancy = registered.occupancy;
  } else if (!enriched.avmValue) {
    const seed = `${property.postcode || ''}${property.propertyNumber || ''}`.length;
    enriched.avmValue = 200000 + seed * 15000;
    enriched.marketRent = 950 + seed * 40;
  }

  if (!enriched.occupancy && property.tenancyStatus) {
    enriched.occupancy = property.tenancyStatus === 'Let' ? 'Rented' : property.tenancyStatus;
  }

  return enriched;
}

export function enrichProperties(properties) {
  return properties.map(enrichPropertyWithAvm);
}

export const DEMO_PROPERTIES = [
  {
    titleRef: 'PROP-DEMO-001',
    postcode: 'EC2V 7HN',
    propertyNumber: '25',
    street: 'Moorgate',
    city: 'London',
    tenancyStatus: 'Let',
    startDate: '2024-04-01',
    monthlyRent: '1850',
    mortgageProvider: 'NatWest',
    productType: 'Buy-to-Let Fixed',
    mortgageEndDate: '2029-04-01',
    mortgageBalance: '312500',
    paymentType: 'Repayment',
    monthlyPayments: '1045',
  },
  {
    titleRef: 'PROP-DEMO-002',
    postcode: 'M1 4BT',
    propertyNumber: '12',
    street: 'Deansgate',
    city: 'Manchester',
    tenancyStatus: 'Vacant',
    startDate: '',
    monthlyRent: '',
    mortgageProvider: 'Santander',
    productType: 'Tracker',
    mortgageEndDate: '2027-11-15',
    mortgageBalance: '228000',
    paymentType: 'Interest only',
    monthlyPayments: '580',
  },
];

export const FIELD_LABELS = {
  titleRef: 'Title / Ref',
  postcode: 'Postcode',
  propertyNumber: 'Property number',
  street: 'Street',
  city: 'City',
  tenancyStatus: 'Tenancy status',
  startDate: 'Start date',
  monthlyRent: 'Monthly rent (£)',
  mortgageProvider: 'Mortgage provider',
  productType: 'Product type',
  mortgageEndDate: 'Mortgage end date',
  mortgageBalance: 'Mortgage balance (£)',
  paymentType: 'Payment type',
  monthlyPayments: 'Monthly payments (£)',
};

export const REQUIRED_FIELDS = [
  'titleRef',
  'postcode',
  'propertyNumber',
  'street',
  'city',
];

export const OPTIONAL_FIELDS = [
  'tenancyStatus',
  'startDate',
  'monthlyRent',
  'mortgageProvider',
  'productType',
  'mortgageEndDate',
  'mortgageBalance',
  'paymentType',
  'monthlyPayments',
];

export const CSV_HEADERS = [
  'Title/Ref',
  'Postcode',
  'Property number',
  'Street',
  'City',
  'Tenancy status',
  'Start date',
  'Monthly rent',
  'Mortgage provider',
  'Product type',
  'Mortgage end date',
  'Mortgage balance',
  'Payment type',
  'Monthly payments',
];

const CSV_TO_KEY = {
  'Title/Ref': 'titleRef',
  Postcode: 'postcode',
  'Property number': 'propertyNumber',
  Street: 'street',
  City: 'city',
  'Tenancy status': 'tenancyStatus',
  'Start date': 'startDate',
  'Monthly rent': 'monthlyRent',
  'Mortgage provider': 'mortgageProvider',
  'Product type': 'productType',
  'Mortgage end date': 'mortgageEndDate',
  'Mortgage balance': 'mortgageBalance',
  'Payment type': 'paymentType',
  'Monthly payments': 'monthlyPayments',
};

export function parseCsv(text) {
  return parseCsvDetailed(text).validProperties;
}

export function parseCsvDetailed(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    return { rows: [], validProperties: [], validCount: 0, invalidCount: 0 };
  }

  const headers = lines[0].split(',').map((h) => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i += 1) {
    const values = lines[i].split(',').map((v) => v.trim());
    const property = {};
    headers.forEach((header, index) => {
      const key = CSV_TO_KEY[header];
      if (key) property[key] = values[index] || '';
    });

    const { valid, errors } = validateProperty(property);
    rows.push({
      line: i + 1,
      property,
      valid,
      errors,
      summary: valid ? 'Valid' : Object.values(errors).join('; '),
    });
  }

  const validProperties = rows.filter((row) => row.valid).map((row) => enrichPropertyWithAvm(row.property));

  return {
    rows,
    validProperties,
    validCount: validProperties.length,
    invalidCount: rows.length - validProperties.length,
  };
}

/** Re-validate edited import rows (e.g. after inline corrections in the upload UI). */
export function validateImportRows(rows) {
  const validatedRows = rows.map((row) => {
    const property = { ...row.property };
    const { valid, errors } = validateProperty(property);
    return {
      line: row.line,
      property,
      valid,
      errors,
      summary: valid ? 'Valid' : Object.values(errors).join('; '),
    };
  });

  const validProperties = validatedRows
    .filter((row) => row.valid)
    .map((row) => enrichPropertyWithAvm(row.property));

  return {
    rows: validatedRows,
    validProperties,
    validCount: validProperties.length,
    invalidCount: validatedRows.length - validProperties.length,
  };
}

export function formatAddress(property) {
  return `${property.propertyNumber} ${property.street}, ${property.city}, ${property.postcode}`;
}

export function getMarketRentRange(property) {
  const marketRent = Number(property.marketRent) || 0;
  if (!marketRent) return null;
  const seed = `${property.postcode || ''}${property.propertyNumber || ''}`.length;
  return {
    low: Math.round(marketRent * (0.88 + (seed % 3) * 0.02)),
    high: Math.round(marketRent * (1.08 + (seed % 4) * 0.02)),
  };
}

/** Derived financial metrics — landlord inputs recalculate dependent fields. */
export const MORTGAGE_PRODUCT_TYPES = ['Fixed rate', 'Tracker', 'Variable'];
export const TENANCY_AGREEMENT_TYPES = ['Assured shorthold', 'Licence', 'Company let', 'Other'];

export function getPropertyTenancies(property) {
  return Array.isArray(property?.tenancies) ? property.tenancies : [];
}

export function getAchievedRentTotal(property) {
  const tenancies = getPropertyTenancies(property);
  if (tenancies.length > 0) {
    return tenancies.reduce(
      (total, tenancy) => total + (Number(String(tenancy.monthlyRent).replace(/[^0-9.]/g, '')) || 0),
      0,
    );
  }
  return Number(String(property?.rentAgreed || '').replace(/[^0-9.]/g, '')) || 0;
}

export function syncAchievedRentFromTenancies(property) {
  const tenancies = getPropertyTenancies(property);
  if (tenancies.length > 0) {
    property.rentAgreed = String(getAchievedRentTotal(property));
  }
  return property;
}

export function getCurrentBestMortgageRate() {
  return CURRENT_BEST_MORTGAGE_RATE;
}

export function hasRefinanceOpportunity(property) {
  if (!hasCompletedMortgageDetails(property)) return false;
  const fin = computePropertyFinancials(property);
  if (!fin.hasInterestRate || !fin.hasRemainingMortgage) return false;
  return fin.interestRate > getCurrentBestMortgageRate() + REFINANCE_RATE_THRESHOLD;
}

export function buildRefinanceQuote(property) {
  const fin = computePropertyFinancials(property);
  const bestRate = getCurrentBestMortgageRate();
  const currentMonthlyPayment = Math.round(fin.remainingMortgage * (fin.interestRate / 100 / 12));
  const newMonthlyPayment = Math.round(fin.remainingMortgage * (bestRate / 100 / 12));

  return {
    currentRate: fin.interestRate,
    bestRate,
    rateDifference: Number((fin.interestRate - bestRate).toFixed(2)),
    loanAmount: fin.remainingMortgage,
    currentMonthlyPayment,
    newMonthlyPayment,
    monthlySavings: Math.max(0, currentMonthlyPayment - newMonthlyPayment),
    grossYield: fin.currentValue > 0
      ? ((fin.rentAgreed * 12) / fin.currentValue) * 100
      : null,
  };
}

export function getPortfolioRefinanceOpportunities(properties) {
  return properties
    .map((property, index) => ({ property, index }))
    .filter(({ property }) => hasRefinanceOpportunity(property))
    .map(({ property, index }) => ({
      property,
      index,
      quote: buildRefinanceQuote(property),
    }))
    .slice(0, 1);
}

export function hasRentReviewOpportunity(property) {
  const marketRent = Number(property.marketRent) || 0;
  const achievedRent = getAchievedRentTotal(property);
  if (marketRent <= 0 || achievedRent <= 0) return false;
  return marketRent - achievedRent > RENT_REVIEW_GAP_THRESHOLD;
}

export function buildRentReviewQuote(property) {
  const marketRent = Number(property.marketRent) || 0;
  const currentAchievedRent = getAchievedRentTotal(property);
  const proposedAchievedRent = marketRent;
  const monthlyUplift = Math.max(0, proposedAchievedRent - currentAchievedRent);

  return {
    marketRent,
    currentAchievedRent,
    proposedAchievedRent,
    monthlyUplift,
    annualUplift: monthlyUplift * 12,
  };
}

export function getPortfolioRentReviewOpportunities(properties) {
  return properties
    .map((property, index) => ({ property, index }))
    .filter(({ property }) => hasRentReviewOpportunity(property))
    .map(({ property, index }) => ({
      property,
      index,
      quote: buildRentReviewQuote(property),
    }))
    .slice(0, 1);
}

export function parseMortgageEndDate(value) {
  const str = String(value || '').trim();
  if (!str) return null;

  const normalized = /^\d{4}-\d{2}$/.test(str) ? `${str}-01` : str.slice(0, 10);
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function hasMortgageRenewalOpportunity(property) {
  if (!hasCompletedMortgageDetails(property)) return false;

  const endDate = parseMortgageEndDate(property.mortgageEndDate);
  if (!endDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const windowEnd = new Date(today);
  windowEnd.setMonth(windowEnd.getMonth() + MORTGAGE_RENEWAL_WINDOW_MONTHS);

  const expiry = new Date(endDate);
  expiry.setHours(0, 0, 0, 0);

  return expiry >= today && expiry <= windowEnd;
}

export function buildMortgageRenewalQuote(property) {
  const fin = computePropertyFinancials(property);
  const exclusiveRate = Number((getCurrentBestMortgageRate() - 0.05).toFixed(2));
  const currentMonthlyPayment = Math.round(fin.remainingMortgage * (fin.interestRate / 100 / 12));
  const newMonthlyPayment = Math.round(fin.remainingMortgage * (exclusiveRate / 100 / 12));

  return {
    expiryDisplay: formatMortgageExpiry(property.mortgageEndDate),
    currentRate: fin.interestRate,
    exclusiveRate,
    rateDifference: Number(Math.max(0, fin.interestRate - exclusiveRate).toFixed(2)),
    loanAmount: fin.remainingMortgage,
    mortgageProvider: fin.bank,
    mortgageProductType: fin.mortgageProductType,
    currentMonthlyPayment,
    newMonthlyPayment,
    monthlySavings: Math.max(0, currentMonthlyPayment - newMonthlyPayment),
  };
}

export function getPortfolioMortgageRenewalOpportunities(properties) {
  return properties
    .map((property, index) => ({ property, index }))
    .filter(({ property }) => hasMortgageRenewalOpportunity(property))
    .map(({ property, index }) => ({
      property,
      index,
      quote: buildMortgageRenewalQuote(property),
    }))
    .slice(0, 1);
}

export function computePortfolioMetricsAfterMortgageRenewal(properties, propertyIndex, quote) {
  return computePortfolioMetricsAfterRefinance(properties, propertyIndex, {
    bestRate: quote.exclusiveRate,
    newMonthlyPayment: quote.newMonthlyPayment,
  });
}

export function computePortfolioMetricsAfterRentReview(properties, propertyIndex, quote) {
  const updated = properties.map((property, index) => {
    if (index !== propertyIndex) return property;

    const clone = { ...property };
    const tenancies = getPropertyTenancies(clone);

    if (tenancies.length > 0 && quote.currentAchievedRent > 0) {
      const ratio = quote.proposedAchievedRent / quote.currentAchievedRent;
      clone.tenancies = tenancies.map((tenancy) => {
        const currentRent = Number(String(tenancy.monthlyRent).replace(/[^0-9.]/g, '')) || 0;
        return {
          ...tenancy,
          monthlyRent: String(Math.round(currentRent * ratio)),
        };
      });
      syncAchievedRentFromTenancies(clone);
    } else {
      clone.rentAgreed = String(quote.proposedAchievedRent);
    }

    return clone;
  });

  return computePortfolioMetrics(enrichProperties(updated));
}

export function computePortfolioMetricsAfterRefinance(properties, propertyIndex, quote) {
  const updated = properties.map((property, index) => {
    if (index !== propertyIndex) return property;
    return {
      ...property,
      interestRate: String(quote.bestRate),
      monthlyPayments: String(quote.newMonthlyPayment),
    };
  });

  return computePortfolioMetrics(enrichProperties(updated));
}

function propertySeedLength(property) {
  return `${property.postcode || ''}${property.propertyNumber || ''}`.length;
}

export function getDefaultEpcDetails(property, { highlightDemo = false } = {}) {
  const seed = propertySeedLength(property);
  let currentRating = ['B', 'C', 'D', 'C'][seed % 4];
  let potentialRating = currentRating === 'D' ? 'C' : currentRating === 'C' ? 'B' : 'A';

  if (highlightDemo) {
    currentRating = 'D';
    potentialRating = 'C';
  }

  return {
    currentRating,
    potentialRating,
    improvementCost: 6500 + (seed % 8) * 1750,
  };
}

export function getPropertyEpcDetails(property, { propertyIndex } = {}) {
  const highlightDemo = propertyIndex === 0;
  const defaults = getDefaultEpcDetails(property, { highlightDemo });
  const currentRating = String(property.epcRating || defaults.currentRating).trim().toUpperCase();
  const potentialRating = String(property.epcPotential || defaults.potentialRating).trim().toUpperCase();

  return {
    currentRating,
    potentialRating,
    improvementCost: defaults.improvementCost,
  };
}

export function ensurePropertyEpcBasics(property, propertyIndex) {
  if (propertyIndex !== 0) return false;
  if (String(property.epcRating || '').trim()) return false;

  const defaults = getDefaultEpcDetails(property, { highlightDemo: true });
  property.epcRating = defaults.currentRating;
  property.epcPotential = defaults.potentialRating;
  return true;
}

export function hasEpcImprovementOpportunity(property, { propertyIndex } = {}) {
  const { currentRating } = getPropertyEpcDetails(property, { propertyIndex });
  return POOR_EPC_RATINGS.includes(currentRating);
}

export function countPropertyOptimisationOpportunities(property) {
  let count = 0;
  if (hasRefinanceOpportunity(property)) count += 1;
  if (hasMortgageRenewalOpportunity(property)) count += 1;
  if (hasRentReviewOpportunity(property)) count += 1;
  return count;
}

export function getPropertyEnvironmentalRisks(property, { propertyIndex } = {}) {
  const seed = propertySeedLength(property);
  const risks = [
    { label: 'Flood - River Sea', level: ['low', 'low', 'medium', 'high'][seed % 4] },
    { label: 'Flood - Surface Water', level: ['low', 'medium', 'medium', 'low'][(seed + 1) % 4] },
    { label: 'Chancel Liability', level: ['low', 'low', 'low', 'medium'][(seed + 2) % 4] },
    { label: 'Subsidence', level: ['low', 'medium', 'low', 'low'][(seed + 3) % 4] },
    { label: 'Cladding', level: ['low', 'low', 'low', 'medium'][seed % 4] },
  ];

  if (propertyIndex === 0) {
    return risks.map((risk) => {
      if (risk.label === 'Flood - River Sea') {
        return { ...risk, previousLevel: 'low', level: 'high' };
      }
      if (risk.label === 'Subsidence') {
        return { ...risk, previousLevel: 'low' };
      }
      return risk;
    });
  }

  return risks;
}

const RISK_LEVEL_ORDER = { low: 0, medium: 1, high: 2 };

export function isRiskWorsened(previousLevel, currentLevel) {
  const previous = RISK_LEVEL_ORDER[previousLevel];
  const current = RISK_LEVEL_ORDER[currentLevel];
  if (previous == null || current == null) return false;
  return current > previous;
}

export function hasEnvironmentalRiskAlert(property, propertyIndex) {
  return getPropertyEnvironmentalRisks(property, { propertyIndex }).some(
    (risk) => risk.previousLevel && isRiskWorsened(risk.previousLevel, risk.level),
  );
}

export function countPropertyAlerts(property, propertyIndex) {
  let count = 0;
  if (hasEpcImprovementOpportunity(property, { propertyIndex })) count += 1;
  if (hasEnvironmentalRiskAlert(property, propertyIndex)) count += 1;
  return count;
}

export function getPropertyAlertRoute(property, propertyIndex) {
  if (hasEpcImprovementOpportunity(property, { propertyIndex })) {
    return `#/portfolio/property/${propertyIndex}/esg`;
  }
  if (hasEnvironmentalRiskAlert(property, propertyIndex)) {
    return `#/portfolio/property/${propertyIndex}/risk`;
  }
  return null;
}

export function buildEpcImprovementQuote(property, { propertyIndex } = {}) {
  const epc = getPropertyEpcDetails(property, { propertyIndex });
  const fin = computePropertyFinancials(property);
  const additionalLoan = epc.improvementCost;
  const interestRate = EPC_IMPROVEMENT_MORTGAGE_RATE;
  const currentMonthlyPayment = fin.remainingMortgage > 0 && fin.interestRate > 0
    ? Math.round(fin.remainingMortgage * (fin.interestRate / 100 / 12))
    : Number(property.monthlyPayments) || 0;
  const additionalMonthlyPayment = Math.round(additionalLoan * (interestRate / 100 / 12));

  return {
    currentRating: epc.currentRating,
    targetRating: epc.potentialRating,
    improvementCost: epc.improvementCost,
    additionalLoan,
    interestRate,
    currentMonthlyPayment,
    additionalMonthlyPayment,
    newMonthlyPayment: currentMonthlyPayment + additionalMonthlyPayment,
    newMortgageBalance: (fin.remainingMortgage || 0) + additionalLoan,
  };
}

export function getPortfolioEpcImprovementOpportunities(properties) {
  const qualifying = properties
    .map((property, index) => ({ property, index }))
    .filter(({ property, index }) => hasEpcImprovementOpportunity(property, { propertyIndex: index }))
    .map(({ property, index }) => ({
      property,
      index,
      quote: buildEpcImprovementQuote(property, { propertyIndex: index }),
    }));

  const preferred = qualifying.find((item) => item.index === 0);
  return preferred ? [preferred] : qualifying.slice(0, 1);
}

export function computePortfolioMetricsAfterEpcImprovement(properties, propertyIndex, quote) {
  const updated = properties.map((property, index) => {
    if (index !== propertyIndex) return property;

    return {
      ...property,
      epcRating: quote.targetRating,
      mortgageBalance: String(quote.newMortgageBalance),
      monthlyPayments: String(quote.newMonthlyPayment),
    };
  });

  return computePortfolioMetrics(enrichProperties(updated));
}

export function getMortgageProductType(property) {
  return String(property?.mortgageProductType || property?.productType || '').trim();
}

export function hasCompletedMortgageDetails(property) {
  const balanceProvided = hasDisplayValue(property?.mortgageBalance);
  const fin = computePropertyFinancials(property);
  return balanceProvided
    && fin.hasInterestRate
    && fin.hasBank
    && fin.hasMortgageProductType
    && fin.hasMortgageExpiry;
}

export function getPropertyEquity(property) {
  if (!hasCompletedMortgageDetails(property)) return null;
  const value = Number(property.avmValue) || 0;
  const mortgage = Number(String(property.mortgageBalance).replace(/[^0-9.]/g, '')) || 0;
  if (value <= 0) return null;
  return value - mortgage;
}

export function getDemoSingleTenancy(property, { highlightRentReview = false } = {}) {
  const marketRent = Number(property.marketRent) || 1400;
  const rent = highlightRentReview
    ? Math.max(400, marketRent - 550)
    : Math.round(marketRent * 0.95);

  return [
    {
      roomNumber: '',
      tenantName: 'S. Taylor',
      startDate: '2024-01-01',
      endDate: '',
      monthlyRent: String(rent),
      agreementType: 'Assured shorthold',
    },
  ];
}

export function getDemoTenancies(property, { highlightRentReview = false } = {}) {
  const marketRent = Number(property.marketRent) || 1400;
  const totalTarget = highlightRentReview
    ? Math.max(400, marketRent - 550)
    : marketRent;

  return [
    {
      roomNumber: '1',
      tenantName: 'A. Patel',
      startDate: '2024-03-01',
      endDate: '',
      monthlyRent: String(Math.round(totalTarget * 0.35)),
      agreementType: 'Assured shorthold',
    },
    {
      roomNumber: '2',
      tenantName: 'J. Smith',
      startDate: '2023-11-15',
      endDate: '',
      monthlyRent: String(Math.round(totalTarget * 0.32)),
      agreementType: 'Assured shorthold',
    },
    {
      roomNumber: '3',
      tenantName: 'K. Lewis',
      startDate: '2024-08-01',
      endDate: '2025-07-31',
      monthlyRent: String(Math.round(totalTarget * 0.33)),
      agreementType: 'Licence',
    },
  ];
}

export function isHmoProperty(property) {
  return String(property?.propertyType || '').trim().toLowerCase() === 'hmo';
}

export function getDefaultFinancialBasics(property) {
  const base = enrichPropertyWithAvm(property);
  const seed = `${base.postcode || ''}${base.propertyNumber || ''}`.length;
  const avm = Number(base.avmValue) || 400000;
  const purchasePrice = Math.round(avm * (0.90 + (seed % 3) * 0.02));
  const purchaseYear = 2018 + (seed % 6);
  const purchaseMonth = String(3 + (seed % 9)).padStart(2, '0');
  const marketRent = Number(base.marketRent) || 1400;
  const rentAgreed = Math.round(marketRent * (0.92 + (seed % 5) * 0.02));

  return {
    purchasePrice: String(purchasePrice),
    purchaseDate: `${purchaseYear}-${purchaseMonth}-01`,
    rentAgreed: String(rentAgreed),
  };
}

/** Prefill purchase details and single-let rent when not yet recorded. */
export function ensurePropertyFinancialBasics(property) {
  const defaults = getDefaultFinancialBasics(property);
  let changed = false;

  if (!Number(String(property.purchasePrice || '').replace(/[^0-9.]/g, ''))) {
    property.purchasePrice = defaults.purchasePrice;
    changed = true;
  }

  if (!String(property.purchaseDate || '').trim()) {
    property.purchaseDate = defaults.purchaseDate;
    changed = true;
  }

  if (!isHmoProperty(property) && getAchievedRentTotal(property) <= 0) {
    property.rentAgreed = defaults.rentAgreed;
    changed = true;
  }

  return changed;
}

/** Apply a complete financials demo — mortgage details plus single-let or HMO tenancies. */
export function applyFinancialDemoScenario(property, scenario, { propertyIndex = 0 } = {}) {
  const base = enrichPropertyWithAvm(property);
  const highlightRefinance = propertyIndex === 0;
  const highlightRentReview = propertyIndex === 1;
  const highlightRenewal = propertyIndex === 1;
  const financials = getDemoFinancials(base, {
    highlightRefinance,
    highlightRenewal,
  });

  property.purchasePrice = financials.purchasePrice;
  property.purchaseDate = financials.purchaseDate;
  property.mortgageBalance = financials.remainingMortgage;
  property.interestRate = financials.interestRate;
  property.mortgageProvider = financials.bank;
  property.mortgageProductType = financials.mortgageProductType;
  property.productType = financials.mortgageProductType;
  property.mortgageEndDate = financials.mortgageExpiry ? `${financials.mortgageExpiry}-01` : '';
  property.occupancy = 'Let';
  property.tenancyStatus = 'Let';

  if (scenario === 'hmo') {
    property.propertyType = 'HMO';
    property.tenancies = getDemoTenancies(base, { highlightRentReview });
  } else {
    if (!property.propertyType || property.propertyType === 'HMO') {
      property.propertyType = 'House';
    }
    property.tenancies = getDemoSingleTenancy(base, { highlightRentReview });
  }

  syncAchievedRentFromTenancies(property);
  applyFinancialsToProperty(property);
  return property;
}

export function computePropertyFinancials(property) {
  const currentValue = Number(property.avmValue) || 0;
  const purchasePrice = Number(String(property.purchasePrice).replace(/[^0-9.]/g, '')) || 0;
  const remainingMortgage = Number(String(property.mortgageBalance).replace(/[^0-9.]/g, '')) || 0;
  const interestRate = Number(String(property.interestRate).replace(/[^0-9.]/g, '')) || 0;
  const bank = String(property.mortgageProvider || '').trim();
  const mortgageProductType = getMortgageProductType(property);
  const rentAgreed = getAchievedRentTotal(property);
  const marketRentRange = getMarketRentRange(property);

  const valueChange = purchasePrice > 0 && currentValue > 0 ? currentValue - purchasePrice : null;
  const valueChangePct = purchasePrice > 0 && valueChange != null
    ? (valueChange / purchasePrice) * 100
    : null;
  const ltv = currentValue > 0 && remainingMortgage > 0
    ? (remainingMortgage / currentValue) * 100
    : null;

  let indicativeRefinanceRate = null;
  let monthlySavings = null;
  const bestRate = getCurrentBestMortgageRate();
  if (interestRate > 0) {
    indicativeRefinanceRate = bestRate;
    if (remainingMortgage > 0 && interestRate > bestRate) {
      monthlySavings = Math.round(
        remainingMortgage * ((interestRate - bestRate) / 100 / 12),
      );
    }
  }

  const grossYield = currentValue > 0 && rentAgreed > 0
    ? (rentAgreed * 12 / currentValue) * 100
    : null;

  return {
    currentValue,
    purchasePrice,
    purchaseDate: property.purchaseDate || '',
    remainingMortgage,
    interestRate,
    bank,
    mortgageProductType,
    mortgageExpiry: property.mortgageEndDate || '',
    marketRentRange,
    rentAgreed,
    valueChange,
    valueChangePct,
    ltv,
    indicativeRefinanceRate,
    monthlySavings,
    grossYield,
    hasPurchasePrice: purchasePrice > 0,
    hasPurchaseDate: !!String(property.purchaseDate || '').trim(),
    hasCurrentValue: purchasePrice > 0 && currentValue > 0,
    hasValueChange: purchasePrice > 0 && currentValue > 0 && valueChange != null,
    hasRemainingMortgage: remainingMortgage > 0,
    hasInterestRate: interestRate > 0,
    hasBank: bank.length > 0,
    hasMortgageProductType: mortgageProductType.length > 0,
    hasMortgageExpiry: !!String(property.mortgageEndDate || '').trim(),
    hasMarketRent: marketRentRange != null,
    hasRentAgreed: rentAgreed > 0,
    hasGrossYield: grossYield != null,
    hasLtv: currentValue > 0 && remainingMortgage > 0 && ltv != null,
    hasIndicativeRefinance: interestRate > 0 && indicativeRefinanceRate != null,
  };
}

export function formatPurchaseDate(value) {
  return formatMortgageExpiry(value);
}

export function formatMortgageExpiry(value) {
  if (!value) return null;
  const str = String(value).trim();
  if (/^\d{2}\/\d{4}$/.test(str)) return str;
  const date = new Date(str);
  if (Number.isNaN(date.getTime())) return str;
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${month}/${date.getFullYear()}`;
}

/** Demo financials for a property — derived from AVM for consistent storytelling. */
export function getDemoFinancials(property, { highlightRefinance = false, highlightRenewal = false } = {}) {
  const avm = Number(property.avmValue) || 400000;
  const seed = `${property.postcode || ''}${property.propertyNumber || ''}`.length;
  const purchasePrice = Math.round(avm * (0.90 + (seed % 3) * 0.02));
  const remainingMortgage = Math.round(avm * (0.915 + (seed % 2) * 0.005));
  const interestRate = highlightRefinance
    ? '5.85'
    : highlightRenewal
      ? '5.49'
      : (4.35 + (seed % 3) * 0.1).toFixed(2);
  const banks = ['Barclays', 'NatWest', 'Santander', 'Nationwide'];
  const bank = highlightRenewal ? 'NatWest' : banks[seed % banks.length];
  let expiryYear;
  let expiryMonth;
  if (highlightRenewal) {
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 2);
    expiryYear = renewalDate.getFullYear();
    expiryMonth = String(renewalDate.getMonth() + 1).padStart(2, '0');
  } else {
    expiryYear = 2026 + (seed % 3);
    expiryMonth = String(6 + (seed % 6)).padStart(2, '0');
  }
  const purchaseYear = 2018 + (seed % 6);
  const purchaseMonth = String(3 + (seed % 9)).padStart(2, '0');
  const marketRent = Number(property.marketRent) || 1400;
  const rentAgreed = Math.round(marketRent * (0.92 + (seed % 5) * 0.02));

  const products = ['Fixed rate', 'Tracker', 'Variable'];

  return {
    purchasePrice: String(purchasePrice),
    purchaseDate: `${purchaseYear}-${purchaseMonth}-01`,
    remainingMortgage: String(remainingMortgage),
    interestRate,
    bank,
    mortgageProductType: products[seed % products.length],
    mortgageExpiry: `${expiryYear}-${expiryMonth}`,
    rentAgreed: String(rentAgreed),
  };
}

/** Sync financials edit to portfolio line items (monthly payment estimate). */
export function applyFinancialsToProperty(property) {
  const remaining = Number(String(property.mortgageBalance).replace(/[^0-9.]/g, '')) || 0;
  const rate = Number(String(property.interestRate).replace(/[^0-9.]/g, '')) || 0;

  if (remaining > 0 && rate > 0) {
    property.monthlyPayments = String(Math.round(remaining * (rate / 100 / 12)));
  }

  return property;
}

export function hasDisplayValue(value) {
  if (value == null || value === '') return false;
  if (typeof value === 'number') return !Number.isNaN(value);
  return String(value).trim() !== '';
}

const LETTING_AGENTS = [
  'Marsh & Co Lettings',
  'Marsh & Co Lettings',
  'Northgate Property Management',
];

export function getPropertyLettingAgent(propertyIndex) {
  return LETTING_AGENTS[propertyIndex % LETTING_AGENTS.length] || 'Independent Lettings';
}

export function computePropertyDataCompleteness(property) {
  const fields = [
    property.titleRef,
    property.postcode,
    property.propertyNumber,
    property.street,
    property.city,
    property.avmValue,
    property.marketRent,
    property.mortgageBalance,
    property.interestRate,
    property.mortgageProvider,
    property.mortgageEndDate,
    property.purchasePrice,
    property.rentAgreed || property.monthlyRent,
    property.occupancy,
  ];
  const filled = fields.filter(hasDisplayValue).length;
  return Math.round((filled / fields.length) * 100);
}

export function formatCurrency(value) {
  const num = Number(String(value).replace(/[^0-9.]/g, ''));
  if (!num) return '—';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatInterestRate(value) {
  const num = Number(String(value).replace(/[^0-9.]/g, ''));
  if (!num) return null;
  return `${num.toFixed(2)}%`;
}

export function formatPercent(value, decimals = 1) {
  if (value == null || Number.isNaN(value) || !Number.isFinite(value)) return '—';
  return `${value.toFixed(decimals)}%`;
}

export function isPropertyOccupied(property) {
  const occupancy = property.occupancy || property.tenancyStatus || '';
  const label = occupancy === 'Let' ? 'Rented' : occupancy;
  return label === 'Rented';
}

function computePortfolioValueChange3m(properties, totalPortfolioValue) {
  if (totalPortfolioValue <= 0 || properties.length === 0) {
    return { amount: null, pct: null };
  }

  const seed = properties.reduce(
    (acc, property) => acc + `${property.postcode || ''}${property.propertyNumber || ''}`.length,
    0,
  );
  const pct = Number((0.8 + (seed % 8) * 0.35).toFixed(1));
  const amount = Math.round(totalPortfolioValue * (pct / 100));
  return { amount, pct };
}

/** Five-year portfolio value trend ending at the current total (wavy but upward for demo). */
export function computePortfolioValueTrend5y(totalPortfolioValue) {
  const current = Math.max(Number(totalPortfolioValue) || 0, 1);
  const currentYear = new Date().getFullYear();
  const relative = [0.7, 0.76, 0.73, 0.81, 1];
  return relative.map((factor, index) => ({
    label: String(currentYear - 4 + index),
    value: Math.round(current * factor),
  }));
}

export function formatRatio(value) {
  if (value == null || Number.isNaN(value) || !Number.isFinite(value)) return '—';
  return `${value.toFixed(2)}x`;
}

/** Portfolio metrics use AVM outputs attached at import time. */
export function computePortfolioMetrics(properties) {
  const enriched = enrichProperties(properties);
  const count = enriched.length;
  let totalPortfolioValue = 0;
  let totalMarketRent = 0;
  let totalRentAgreed = 0;
  let hasRentAgreed = false;
  let totalMortgageBalance = 0;
  let totalMortgageMonthly = 0;
  let occupiedCount = 0;

  enriched.forEach((property) => {
    totalPortfolioValue += Number(property.avmValue) || 0;
    totalMarketRent += Number(property.marketRent) || 0;
    const agreed = Number(property.rentAgreed) || 0;
    if (agreed > 0) {
      hasRentAgreed = true;
      totalRentAgreed += agreed;
    }
    totalMortgageBalance += Number(String(property.mortgageBalance).replace(/[^0-9.]/g, '')) || 0;
    let monthlyPayment = Number(String(property.monthlyPayments).replace(/[^0-9.]/g, '')) || 0;
    if (monthlyPayment <= 0) {
      const balance = Number(String(property.mortgageBalance).replace(/[^0-9.]/g, '')) || 0;
      const rate = Number(String(property.interestRate).replace(/[^0-9.]/g, '')) || 0;
      if (balance > 0 && rate > 0) {
        monthlyPayment = Math.round(balance * (rate / 100 / 12));
      }
    }
    totalMortgageMonthly += monthlyPayment;
    if (isPropertyOccupied(property)) occupiedCount += 1;
  });

  const equityProperties = enriched.filter(hasCompletedMortgageDetails);
  const hasEquityData = equityProperties.length > 0;
  let equityBasisValue = 0;
  let equityBasisMortgage = 0;

  if (hasEquityData) {
    equityProperties.forEach((property) => {
      equityBasisValue += Number(property.avmValue) || 0;
      equityBasisMortgage += Number(String(property.mortgageBalance).replace(/[^0-9.]/g, '')) || 0;
    });
  }

  const totalEquity = hasEquityData ? equityBasisValue - equityBasisMortgage : null;
  const annualMarketRent = totalMarketRent * 12;
  const grossYield = totalPortfolioValue > 0 ? (annualMarketRent / totalPortfolioValue) * 100 : null;
  const incomeForIcr = hasRentAgreed ? totalRentAgreed : totalMarketRent;
  const icr = totalMortgageMonthly > 0 ? (incomeForIcr / totalMortgageMonthly) * 100 : null;
  const overallLtv = hasEquityData && equityBasisValue > 0 && equityBasisMortgage > 0
    ? (equityBasisMortgage / equityBasisValue) * 100
    : null;
  const portfolioValueChange3m = computePortfolioValueChange3m(enriched, totalPortfolioValue);
  const portfolioValueTrend5y = computePortfolioValueTrend5y(totalPortfolioValue);

  return {
    totalProperties: count,
    totalPortfolioValue,
    totalMarketRent,
    totalRentAgreed: hasRentAgreed ? totalRentAgreed : null,
    totalEquity,
    hasEquityData,
    equityPropertyCount: equityProperties.length,
    totalMortgageBalance,
    totalMortgageMonthly,
    overallLtv,
    occupiedCount,
    occupancyFraction: count > 0 ? `${occupiedCount}/${count}` : '—',
    grossYield,
    icr,
    portfolioValueChange3m,
    portfolioValueTrend5y,
    properties: enriched,
  };
}

export function loadState() {
  try {
    const raw = sessionStorage.getItem('landlord-portal-state');
    return raw ? JSON.parse(raw) : { accessGranted: false, loggedIn: false, portfolio: null };
  } catch {
    return { accessGranted: false, loggedIn: false, portfolio: null };
  }
}

export function isAccessCodeValid(code) {
  const expected = [7, 7, 7, 2, 1, 2].map((d) => String(d)).join('');
  return String(code || '').trim() === expected;
}

export function saveState(state) {
  sessionStorage.setItem('landlord-portal-state', JSON.stringify(state));
}

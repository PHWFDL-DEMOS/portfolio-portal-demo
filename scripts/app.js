import {
  DEMO_PROPERTY,
  DEMO_MANUAL_PERFECT,
  DEMO_MANUAL_IMPERFECT,
  FIELD_LABELS,
  REQUIRED_FIELDS,
  OPTIONAL_FIELDS,
  parseCsvDetailed,
  validateImportRows,
  searchAddressesByPostcode,
  validateProperty,
  formatAddress,
  formatCurrency,
  formatPercent,
  formatInterestRate,
  hasDisplayValue,
  computePropertyDataCompleteness,
  countPropertyAlerts,
  countPropertyOptimisationOpportunities,
  getPropertyAlertRoute,
  getPropertyEnvironmentalRisks,
  hasEnvironmentalRiskAlert,
  isRiskWorsened,
  getPropertyLettingAgent,
  computePortfolioMetrics,
  enrichPropertyWithAvm,
  enrichProperties,
  computePropertyFinancials,
  getMarketRentRange,
  formatMortgageExpiry,
  formatPurchaseDate,
  ensurePropertyFinancialBasics,
  isHmoProperty,
  getDemoFinancials,
  applyFinancialsToProperty,
  getPropertyTenancies,
  getAchievedRentTotal,
  syncAchievedRentFromTenancies,
  getMortgageProductType,
  getDemoTenancies,
  getDemoSingleTenancy,
  applyFinancialDemoScenario,
  MORTGAGE_PRODUCT_TYPES,
  TENANCY_AGREEMENT_TYPES,
  getQualifiedMarketplaceListings,
  filterMarketplaceByEpc,
  applyMarketplaceFilters,
  isCompliantEpcRating,
  getPortfolioMarketOpportunities,
  getMarketplaceListingById,
  buildMortgageQuote,
  buildRefinanceQuote,
  buildRentReviewQuote,
  buildMortgageRenewalQuote,
  buildEpcImprovementQuote,
  computePortfolioMetricsAfterEpcImprovement,
  getPortfolioEpcImprovementOpportunities,
  hasEpcImprovementOpportunity,
  getPropertyEpcDetails,
  ensurePropertyEpcBasics,
  computePortfolioMetricsAfterPurchase,
  computePortfolioMetricsAfterRefinance,
  computePortfolioMetricsAfterMortgageRenewal,
  computePortfolioMetricsAfterRentReview,
  getPortfolioRefinanceOpportunities,
  getPortfolioRentReviewOpportunities,
  getPortfolioMortgageRenewalOpportunities,
  hasCompletedMortgageDetails,
  hasRefinanceOpportunity,
  hasRentReviewOpportunity,
  hasMortgageRenewalOpportunity,
  getCurrentBestMortgageRate,
  REFINANCE_RATE_THRESHOLD,
  RENT_REVIEW_GAP_THRESHOLD,
  OPPORTUNITY_EQUITY_THRESHOLD,
  MARKETPLACE_MAX_ASKING_PRICE,
  loadState,
  saveState,
  isAccessCodeValid,
} from './data.js';

const PAGE_TITLES = {
  gate: 'Investor Landlord Portal — Demo Access',
  app: 'Investor Landlord Portal — Demo',
};

const PROPERTY_TABS = [
  { id: 'overview', label: 'Property overview' },
  { id: 'financials', label: 'Financials' },
  { id: 'risk', label: 'Risk assessment' },
  { id: 'esg', label: 'ESG & Renovation' },
  { id: 'local-market', label: 'Local market profile' },
];

const app = document.getElementById('app');
let manualEntryErrors = {};
let manualEntryDraft = {};
let pendingBulkImport = null;
let pendingBulkImportSuccess = null;
let marketplaceEpcFilter = 'all';
let marketplaceInvestorClubFilter = 'all';

const BRAND_LOGO_PATH = 'assets/image.png';
const BRAND_ICON_PATH = 'assets/icon.png';
const DATALOFT_LOGO_PATH = 'assets/dataloft-logo.png';
const WHENFRESH_LOGO_PATH = 'assets/WF.png';

function renderPortalLogo({ height = 32, className = 'portal-logo' } = {}) {
  return `<img src="${BRAND_LOGO_PATH}" alt="ACME Lettings" class="${className}" height="${height}">`;
}

function renderPortalIcon({ height = 20, className = 'portal-logo portal-logo--icon' } = {}) {
  return `<img src="${BRAND_ICON_PATH}" alt="" class="${className}" height="${height}" aria-hidden="true">`;
}

function renderDataloftLogo({ className = 'dataloft-logo', height = 20 } = {}) {
  return `<img src="${DATALOFT_LOGO_PATH}" alt="dataloft by PriceHubble" class="${className}" height="${height}">`;
}

function renderWhenfreshLogo({ className = 'whenfresh-logo', height = 20 } = {}) {
  return `<img src="${WHENFRESH_LOGO_PATH}" alt="whenfresh, a PriceHubble company" class="${className}" height="${height}">`;
}

function renderPartnerDivider() {
  return '<span class="partner-divider" aria-hidden="true">|</span>';
}

function renderPropertyTabLabel(tab) {
  if (tab.id === 'local-market') {
    return `${renderDataloftLogo({ className: 'dataloft-logo dataloft-logo--tab', height: 21 })}${renderPartnerDivider()}${escapeHtml(tab.label)}`;
  }
  if (tab.id === 'risk') {
    return `${renderWhenfreshLogo({ className: 'whenfresh-logo whenfresh-logo--tab', height: 21 })}${renderPartnerDivider()}${escapeHtml(tab.label)}`;
  }
  return escapeHtml(tab.label);
}

function renderPropertyTabClass(tab, activeTabId) {
  const classes = ['property-tabs__tab'];
  if (tab.id === activeTabId) classes.push('property-tabs__tab--active');
  if (tab.id === 'local-market') classes.push('property-tabs__tab--dataloft');
  if (tab.id === 'risk') classes.push('property-tabs__tab--whenfresh');
  return classes.join(' ');
}

const RENTAL_EVIDENCE_REPORT_PATH = 'assets/rental-evidence-report.png';

function resolveAssetUrl(relativePath) {
  const normalized = String(relativePath || '').replace(/^\//, '');
  const { origin, pathname } = window.location;
  let basePath = pathname;

  if (!basePath.endsWith('/')) {
    const lastSegment = basePath.slice(basePath.lastIndexOf('/') + 1);
    basePath = lastSegment.includes('.')
      ? basePath.slice(0, basePath.lastIndexOf('/') + 1)
      : `${basePath}/`;
  }

  return `${origin}${basePath}${normalized}`;
}

function renderDataloftReportButton() {
  return `
    <button type="button" class="btn btn-apply btn-order-report" data-action="open-rental-report">
      <span class="btn-apply__logo">
        <img src="${DATALOFT_LOGO_PATH}" alt="" class="btn-order-report__logo" width="120" height="40">
      </span>
      <span class="btn-apply__divider" aria-hidden="true">|</span>
      <span class="btn-apply__label">ORDER RENTAL EVIDENCE REPORT</span>
    </button>
  `;
}

function renderRentalEvidenceReportModal() {
  const reportUrl = resolveAssetUrl(RENTAL_EVIDENCE_REPORT_PATH);
  return `
    <div class="modal" id="rental-evidence-modal" hidden>
      <div class="modal__backdrop" data-action="close-rental-report"></div>
      <div class="modal__panel modal__panel--report" role="dialog" aria-labelledby="rental-evidence-title" aria-modal="true">
        <div class="modal__report-header">
          <h2 class="modal__title" id="rental-evidence-title">Rental evidence report</h2>
          <button type="button" class="modal__close" data-action="close-rental-report" aria-label="Close report">&times;</button>
        </div>
        <div class="modal__report-body">
          <img src="${escapeHtml(reportUrl)}" alt="Rental evidence report for Sheffield showing achieved and asking rent analysis" class="rental-evidence-report__image">
        </div>
      </div>
    </div>
  `;
}

let state = loadState();
let draftPortfolio = state.draftPortfolio || { name: '', properties: [] };

function navigate(path) {
  window.location.hash = path;
}

const INVESTMENT_GOAL_OPTIONS = {
  shortTermPriority: [
    'Buy more property / expand',
    'Hold steady and optimise what I have',
    'Refinance or release equity',
    'Renovate or improve existing properties',
    'Improve rental income / reduce voids',
    'Sell one or more properties',
    'Not sure yet',
  ],
  longTermDirection: [
    'Significantly larger (more units or value)',
    'About the same size, running smoothly',
    'Smaller / partially exited',
    'Fully exited / sold up',
    'Restructured (e.g. limited company, different asset mix)',
    'Undecided',
  ],
  ultimateGoal: [
    'Supplement my income',
    'Replace my main income',
    'Fund my retirement',
    'Build family wealth / a legacy',
    'Grow and sell for profit',
    'I\'m not sure yet',
  ],
  investorPriority: [
    'Monthly rental income (yield)',
    'Long-term capital growth',
    'A balance of both',
    'Tax efficiency',
    'I\'m not sure yet',
  ],
  riskAppetite: [
    'Cautious — preserve capital',
    'Balanced',
    'Growth-focused — comfortable with more risk',
    'Prefer not to say',
  ],
  fundingPlan: [
    'Cash',
    'Mortgages / leverage',
    'Releasing equity from existing properties',
    'Not planning to buy right now',
    'I\'m not sure yet',
  ],
  handsOn: [
    'Self-manage everything',
    'Somewhat involved',
    'Mostly hands-off (use agents)',
    'Prefer not to say',
  ],
};

function getInvestmentGoals() {
  const saved = state.investmentGoals || {};
  return {
    shortTermPriority: saved.shortTermPriority || '',
    longTermDirection: saved.longTermDirection || '',
    ultimateGoal: saved.ultimateGoal || '',
    investorPriority: saved.investorPriority || '',
    riskAppetite: saved.riskAppetite || '',
    fundingPlan: saved.fundingPlan || '',
    handsOn: saved.handsOn || '',
  };
}

function renderInvestmentGoalsField(id, label, name, options, selectedValue, { optional = false } = {}) {
  const optionalMark = optional ? ' <span class="form-field__optional">(optional)</span>' : '';
  return `
    <div class="form-field">
      <label for="${id}">${escapeHtml(label)}${optionalMark}</label>
      <select id="${id}" name="${name}">${renderSelectOptions(options, selectedValue)}</select>
    </div>
  `;
}

function renderInvestmentGoalsModal() {
  const goals = getInvestmentGoals();

  return `
    <div class="modal" id="investment-goals-modal" hidden>
      <div class="modal__backdrop" data-action="close-investment-goals"></div>
      <div class="modal__panel modal__panel--wide investment-goals-modal" role="dialog" aria-labelledby="investment-goals-title" aria-modal="true">
        <h2 class="modal__title" id="investment-goals-title">My investment goals</h2>
        <p class="modal__intro">Tell us about your plans so we can tailor optimisation suggestions. You can update these at any time.</p>
        <form id="investment-goals-form" class="modal__form investment-goals-form">
          <section class="investment-goals-section" aria-labelledby="investment-goals-short-term">
            <h3 class="investment-goals-section__title" id="investment-goals-short-term">Now — short-term (next 12 months)</h3>
            ${renderInvestmentGoalsField(
    'goal-short-term-priority',
    'What\'s your main priority for your portfolio over the next 12 months?',
    'shortTermPriority',
    INVESTMENT_GOAL_OPTIONS.shortTermPriority,
    goals.shortTermPriority,
  )}
          </section>

          <section class="investment-goals-section" aria-labelledby="investment-goals-long-term">
            <h3 class="investment-goals-section__title" id="investment-goals-long-term">Later — long-term (5+ years)</h3>
            ${renderInvestmentGoalsField(
    'goal-long-term-direction',
    'Where do you want your portfolio to be in 5+ years?',
    'longTermDirection',
    INVESTMENT_GOAL_OPTIONS.longTermDirection,
    goals.longTermDirection,
  )}
            ${renderInvestmentGoalsField(
    'goal-ultimate-goal',
    'What\'s the ultimate goal for this portfolio?',
    'ultimateGoal',
    INVESTMENT_GOAL_OPTIONS.ultimateGoal,
    goals.ultimateGoal,
  )}
          </section>

          <section class="investment-goals-section" aria-labelledby="investment-goals-profiling">
            <h3 class="investment-goals-section__title" id="investment-goals-profiling">Your investor profile</h3>
            ${renderInvestmentGoalsField(
    'goal-investor-priority',
    'What matters most to you as an investor?',
    'investorPriority',
    INVESTMENT_GOAL_OPTIONS.investorPriority,
    goals.investorPriority,
  )}
            ${renderInvestmentGoalsField(
    'goal-risk-appetite',
    'How would you describe your risk appetite?',
    'riskAppetite',
    INVESTMENT_GOAL_OPTIONS.riskAppetite,
    goals.riskAppetite,
  )}
            ${renderInvestmentGoalsField(
    'goal-funding-plan',
    'How do you plan to fund future purchases?',
    'fundingPlan',
    INVESTMENT_GOAL_OPTIONS.fundingPlan,
    goals.fundingPlan,
  )}
            ${renderInvestmentGoalsField(
    'goal-hands-on',
    'How hands-on do you want to be?',
    'handsOn',
    INVESTMENT_GOAL_OPTIONS.handsOn,
    goals.handsOn,
    { optional: true },
  )}
          </section>

          <div class="modal__actions">
            <button type="button" class="btn btn-secondary" data-action="close-investment-goals">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function bindInvestmentGoalsModal() {
  const modal = document.getElementById('investment-goals-modal');
  if (!modal) return;

  const openModal = () => {
    modal.hidden = false;
  };

  const closeModal = () => {
    modal.hidden = true;
  };

  document.querySelectorAll('[data-action="open-investment-goals"]').forEach((button) => {
    button.addEventListener('click', openModal);
  });

  modal.querySelectorAll('[data-action="close-investment-goals"]').forEach((element) => {
    element.addEventListener('click', closeModal);
  });

  document.getElementById('investment-goals-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    state.investmentGoals = {
      shortTermPriority: String(formData.get('shortTermPriority') || '').trim(),
      longTermDirection: String(formData.get('longTermDirection') || '').trim(),
      ultimateGoal: String(formData.get('ultimateGoal') || '').trim(),
      investorPriority: String(formData.get('investorPriority') || '').trim(),
      riskAppetite: String(formData.get('riskAppetite') || '').trim(),
      fundingPlan: String(formData.get('fundingPlan') || '').trim(),
      handsOn: String(formData.get('handsOn') || '').trim(),
    };
    saveState(state);
    closeModal();
  });
}

function getRoute() {
  const hash = window.location.hash.slice(1) || '/dashboard';
  return hash.startsWith('/') ? hash : `/${hash}`;
}

function parseRoute(route) {
  const refinanceQuoteMatch = route.match(/^\/portfolio\/property\/(\d+)\/refinance-quote$/);
  if (refinanceQuoteMatch) {
    return { type: 'refinance-quote', index: Number(refinanceQuoteMatch[1]) };
  }

  const rentReviewMatch = route.match(/^\/portfolio\/property\/(\d+)\/rent-review$/);
  if (rentReviewMatch) {
    return { type: 'rent-review', index: Number(rentReviewMatch[1]) };
  }

  const renewalQuoteMatch = route.match(/^\/portfolio\/property\/(\d+)\/renewal-quote$/);
  if (renewalQuoteMatch) {
    return { type: 'renewal-quote', index: Number(renewalQuoteMatch[1]) };
  }

  const epcImprovementMatch = route.match(/^\/portfolio\/property\/(\d+)\/epc-improvement$/);
  if (epcImprovementMatch) {
    return { type: 'epc-improvement', index: Number(epcImprovementMatch[1]) };
  }

  const propertyMatch = route.match(/^\/portfolio\/property\/(\d+)(?:\/([a-z-]+))?$/);
  if (propertyMatch) {
    return {
      type: 'property',
      index: Number(propertyMatch[1]),
      tab: propertyMatch[2] || 'overview',
    };
  }

  const quoteMatch = route.match(/^\/portfolio\/marketplace\/quote\/([a-z0-9-]+)$/);
  if (quoteMatch) {
    return { type: 'marketplace-quote', listingId: quoteMatch[1] };
  }

  return { type: 'standard', route };
}

function getPropertyTab(id) {
  return PROPERTY_TABS.find((tab) => tab.id === id) || PROPERTY_TABS[0];
}

function getPortfolioProperty(index) {
  const portfolio = state.portfolio;
  if (!portfolio || index < 0 || index >= portfolio.properties.length) return null;
  return enrichPropertyWithAvm(portfolio.properties[index]);
}

function propertyDemoSeed(property) {
  const seed = `${property.postcode || ''}${property.propertyNumber || ''}`.length;
  const marketRent = Number(property.marketRent) || 1200;
  const avm = Number(property.avmValue) || 300000;
  const sqft = 700 + (seed % 5) * 100;
  const rentLow = Math.round(marketRent * (0.88 + (seed % 3) * 0.02));
  const rentHigh = Math.round(marketRent * (1.08 + (seed % 4) * 0.02));
  const epcCurrent = ['B', 'C', 'D', 'C'][seed % 4];
  const epcPotential = epcCurrent === 'D' ? 'C' : epcCurrent === 'C' ? 'B' : 'A';

  return {
    bedrooms: 1 + (seed % 4),
    floors: 2 + (seed % 3),
    floorNumber: 1 + (seed % 2),
    propertyType: seed % 3 === 0 ? 'House' : 'Flat',
    sqft,
    builtYear: 1985 + (seed % 20) * 5,
    leasehold: seed % 4 === 0 ? 'yes' : 'no',
    newBuilding: 'no',
    epcRating: epcCurrent,
    epcPotential,
    epcScore: 62 + (seed % 18),
    riskScore: ['Low', 'Medium', 'Medium', 'Elevated'][seed % 4],
    rentDaysOnMarket: 6 + (seed % 20),
    saleDaysOnMarket: 90 + (seed % 80),
    demandScore: 55 + (seed % 35),
    rentChangePct: -4 + (seed % 3),
    saleChangePct: -2.3 + (seed % 2) * 0.5,
    medianRent: Math.round(marketRent * 0.92),
    medianSale: Math.round(avm * 0.88),
    rentLow,
    rentHigh,
    rentPerSqft: (marketRent / sqft).toFixed(2),
    salePerSqft: Math.round(avm / sqft),
    similarRent: 300 + (seed % 300),
    similarSale: 200 + (seed % 200),
    comparables: 8 + (seed % 12),
    rentTrend: [
      { label: '01.06.2023', value: marketRent * 0.94, pct: '+3.50%' },
      { label: '01.09.2023', value: marketRent * 0.97, pct: '+2.10%' },
      { label: '01.12.2023', value: marketRent * 0.95, pct: '-1.67%' },
      { label: '01.03.2024', value: marketRent * 0.98, pct: '+2.80%' },
      { label: '01.06.2024', value: marketRent * 1.0, pct: '+1.20%' },
      { label: '01.09.2024', value: marketRent * 0.99, pct: '-0.80%' },
      { label: '01.12.2024', value: marketRent * 1.02, pct: '+2.40%' },
      { label: '01.03.2025', value: marketRent, pct: '-4.00%' },
    ],
    saleTrend: [
      { label: '01.06.2023', value: avm * 0.92, pct: '-1.50%' },
      { label: '01.09.2023', value: avm * 0.94, pct: '+1.20%' },
      { label: '01.12.2023', value: avm * 0.93, pct: '-0.90%' },
      { label: '01.03.2024', value: avm * 0.96, pct: '+2.10%' },
      { label: '01.06.2024', value: avm * 0.98, pct: '+1.80%' },
      { label: '01.09.2024', value: avm * 0.99, pct: '+0.50%' },
      { label: '01.12.2024', value: avm * 1.01, pct: '+1.60%' },
      { label: '01.03.2025', value: avm, pct: '-2.30%' },
    ],
    epcImprovementCost: 6500 + (seed % 8) * 1750,
    environmentalRisks: getPropertyEnvironmentalRisks(property),
    averageAskingPrice: Math.round(avm * (1.01 + (seed % 4) * 0.008)),
    askingPriceChange3m: Number((-0.6 + (seed % 6) * 0.35).toFixed(1)),
    askingPriceTrend: [
      { label: 'Oct', value: avm * 0.96 },
      { label: 'Nov', value: avm * 0.97 },
      { label: 'Dec', value: avm * 0.98 },
      { label: 'Jan', value: avm * 0.99 },
      { label: 'Feb', value: avm * 1.0 },
      { label: 'Mar', value: avm * 1.01 },
      { label: 'Apr', value: avm * 1.005 },
      { label: 'May', value: avm * 1.02 },
      { label: 'Jun', value: avm * 1.015 },
      { label: 'Jul', value: avm * 1.03 },
    ],
    listingsByAskingPrice: (() => {
      const mid = Math.round(avm / 50000) * 50;
      return [-2, -1, 0, 1, 2].map((offset, i) => ({
        label: `£${mid + offset * 50}k`,
        value: 14 + ((seed + i * 3) % 18),
      }));
    })(),
    timeToSellTrend: [
      { label: 'Oct', value: 95 + (seed % 10) },
      { label: 'Nov', value: 92 + (seed % 12) },
      { label: 'Dec', value: 88 + (seed % 8) },
      { label: 'Jan', value: 85 + (seed % 10) },
      { label: 'Feb', value: 82 + (seed % 9) },
      { label: 'Mar', value: 78 + (seed % 11) },
      { label: 'Apr', value: 80 + (seed % 8) },
      { label: 'May', value: 76 + (seed % 10) },
      { label: 'Jun', value: 74 + (seed % 7) },
      { label: 'Jul', value: 72 + (seed % 9) },
    ],
    salesVolumeByDom: [
      { label: '0-30', value: 38 + (seed % 15) },
      { label: '31-60', value: 28 + (seed % 12) },
      { label: '61-90', value: 18 + (seed % 10) },
      { label: '91-120', value: 10 + (seed % 8) },
      { label: '120+', value: 6 + (seed % 5) },
    ],
    transactionPriceTrend: [
      { label: 'Q1 24', value: avm * 0.94 },
      { label: 'Q2 24', value: avm * 0.96 },
      { label: 'Q3 24', value: avm * 0.98 },
      { label: 'Q4 24', value: avm * 0.99 },
      { label: 'Q1 25', value: avm * 1.01 },
      { label: 'Q2 25', value: avm * 1.02 },
    ],
    transactionPriceDistribution: (() => {
      const mid = Math.round(avm / 50000) * 50;
      return [-2, -1, 0, 1, 2, 3].map((offset, i) => ({
        label: `£${mid + offset * 50}k`,
        value: 8 + ((seed + i * 2) % 22),
      }));
    })(),
    localMarket: (() => {
      const monthLabels = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
      const baseRent = marketRent || 1200;
      const rentPsfBase = baseRent / sqft;

      return {
        listedProperties1mi: 118 + (seed % 48),
        newRentalListingsMonth: 14 + (seed % 11),
        rentalAvailabilityByMonth: monthLabels.map((label, i) => ({
          label,
          value: 72 + (seed % 20) + Math.round(Math.sin(i * 0.9 + seed) * 14) + i * 2,
        })),
        avgDaysOnMarketRentedMonth: 19 + (seed % 14),
        rentChangeProportion: [
          { label: 'No rent change', value: 58 + (seed % 8), color: '#2D95EC' },
          { label: 'Rent reduced', value: 14 + (seed % 6), color: '#9eb8d4' },
          { label: 'Rent increased', value: 18 + (seed % 7), color: '#1a6bb5' },
        ],
        newRentalsByType: [
          { label: 'Detached', value: 8 + (seed % 6) },
          { label: 'Semi-det.', value: 14 + (seed % 8) },
          { label: 'Terraced', value: 22 + (seed % 10) },
          { label: 'Flats', value: 36 + (seed % 12) },
        ],
        avgRentByBedrooms: [1, 2, 3, 4].map((beds, i) => ({
          label: `${beds} bed`,
          current: Math.round(baseRent * (0.72 + beds * 0.18) + (seed % 40)),
          prior: Math.round(baseRent * (0.68 + beds * 0.17) + (seed % 35)),
        })),
        rentPsfTrend: monthLabels.map((label, i) => ({
          label,
          value: Number((rentPsfBase * (0.94 + i * 0.006 + (seed % 5) * 0.002)).toFixed(2)),
        })),
        newRentalsByPriceBand: [
          { label: '<£1k', value: 12 + (seed % 8) },
          { label: '£1–1.5k', value: 28 + (seed % 10) },
          { label: '£1.5–2k', value: 24 + (seed % 9) },
          { label: '£2–2.5k', value: 16 + (seed % 7) },
          { label: '£2.5k+', value: 8 + (seed % 5) },
        ],
        grossYieldRolling12m: monthLabels.map((label, i) => ({
          label,
          value: Number((4.6 + (seed % 6) * 0.15 + i * 0.04 + Math.sin(i * 0.7) * 0.12).toFixed(2)),
        })),
        grossYieldByType: [
          { label: 'Detached', value: Number((4.8 + (seed % 4) * 0.1).toFixed(1)) },
          { label: 'Semi-det.', value: Number((5.1 + (seed % 3) * 0.12).toFixed(1)) },
          { label: 'Terraced', value: Number((5.4 + (seed % 5) * 0.08).toFixed(1)) },
          { label: 'Flats', value: Number((5.8 + (seed % 4) * 0.11).toFixed(1)) },
        ],
      };
    })(),
  };
}

function getPropertyOverviewDetails(property) {
  const seed = propertyDemoSeed(property);
  return {
    propertyType: property.propertyType ?? seed.propertyType,
    bedrooms: property.bedrooms ?? seed.bedrooms,
    epcRating: property.epcRating ?? seed.epcRating,
    epcPotential: property.epcPotential ?? seed.epcPotential,
    sqft: property.sqft ?? seed.sqft,
    builtYear: property.builtYear ?? seed.builtYear,
    leasehold: property.leasehold ?? seed.leasehold,
    floors: property.floors ?? seed.floors,
    floorNumber: property.floorNumber ?? seed.floorNumber,
    newBuilding: property.newBuilding ?? seed.newBuilding,
    occupancy: property.occupancy ?? property.tenancyStatus ?? '',
    rentPerSqft: seed.rentPerSqft,
  };
}

function formatTenancyDate(value) {
  if (!value) return '—';
  const date = new Date(String(value).trim());
  if (Number.isNaN(date.getTime())) return escapeHtml(String(value));
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function renderSelectOptions(options, selectedValue, includeBlank = true) {
  const blank = includeBlank ? '<option value="">Select…</option>' : '';
  return blank + options.map((option) => `
    <option value="${escapeHtml(option)}"${option === selectedValue ? ' selected' : ''}>${escapeHtml(option)}</option>
  `).join('');
}

function renderOverviewEditModal(property, details) {
  return `
    <div class="modal" id="overview-edit-modal" hidden>
      <div class="modal__backdrop" data-action="close-overview-edit"></div>
      <div class="modal__panel" role="dialog" aria-labelledby="overview-edit-title" aria-modal="true">
        <h2 class="modal__title" id="overview-edit-title">Edit key information</h2>
        <p class="modal__intro">Update the property characteristics held against this asset.</p>
        <form id="overview-edit-form" class="modal__form">
          <div class="form-grid form-grid--2">
            <div class="form-field">
              <label for="ov-property-type">Property type</label>
              <select id="ov-property-type" name="propertyType">${renderSelectOptions(['House', 'Flat', 'Apartment', 'HMO'], details.propertyType)}</select>
            </div>
            <div class="form-field">
              <label for="ov-bedrooms">Bedrooms</label>
              <input type="number" id="ov-bedrooms" name="bedrooms" min="0" value="${escapeHtml(String(details.bedrooms))}">
            </div>
            <div class="form-field">
              <label for="ov-epc-current">Current EPC rating</label>
              <select id="ov-epc-current" name="epcRating">${renderSelectOptions(['A', 'B', 'C', 'D', 'E', 'F', 'G'], details.epcRating)}</select>
            </div>
            <div class="form-field">
              <label for="ov-epc-potential">Potential EPC rating</label>
              <select id="ov-epc-potential" name="epcPotential">${renderSelectOptions(['A', 'B', 'C', 'D', 'E', 'F', 'G'], details.epcPotential)}</select>
            </div>
            <div class="form-field">
              <label for="ov-sqft">Net living area (sq.ft)</label>
              <input type="number" id="ov-sqft" name="sqft" min="0" value="${escapeHtml(String(details.sqft))}">
            </div>
            <div class="form-field">
              <label for="ov-built-year">Year built</label>
              <input type="number" id="ov-built-year" name="builtYear" min="1600" max="2100" value="${escapeHtml(String(details.builtYear))}">
            </div>
            <div class="form-field">
              <label for="ov-leasehold">Leasehold</label>
              <select id="ov-leasehold" name="leasehold">${renderSelectOptions(['yes', 'no'], details.leasehold, false)}</select>
            </div>
            <div class="form-field">
              <label for="ov-floors">Number of floors</label>
              <input type="number" id="ov-floors" name="floors" min="1" value="${escapeHtml(String(details.floors))}">
            </div>
            <div class="form-field">
              <label for="ov-floor-number">Floor number</label>
              <input type="number" id="ov-floor-number" name="floorNumber" min="0" value="${escapeHtml(String(details.floorNumber))}">
            </div>
            <div class="form-field">
              <label for="ov-new-building">New build</label>
              <select id="ov-new-building" name="newBuilding">${renderSelectOptions(['yes', 'no'], details.newBuilding, false)}</select>
            </div>
            <div class="form-field">
              <label for="ov-occupancy">Occupancy status</label>
              <select id="ov-occupancy" name="occupancy">${renderSelectOptions(['Let', 'Vacant', 'Under offer', 'Notice served'], details.occupancy === 'Rented' ? 'Let' : details.occupancy)}</select>
            </div>
          </div>
          <div class="modal__actions">
            <button type="button" class="btn btn-tertiary" data-action="close-overview-edit">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function bindOverviewEdit(index) {
  const modal = document.getElementById('overview-edit-modal');
  const form = document.getElementById('overview-edit-form');
  if (!modal || !form) return;

  const open = () => { modal.hidden = false; };
  const close = () => { modal.hidden = true; };

  document.querySelector('[data-action="open-overview-edit"]')?.addEventListener('click', open);
  modal.querySelectorAll('[data-action="close-overview-edit"]').forEach((el) => {
    el.addEventListener('click', close);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const portfolio = state.portfolio;
    if (!portfolio?.properties[index]) return;

    const data = new FormData(form);
    const property = portfolio.properties[index];
    property.propertyType = String(data.get('propertyType') || '').trim();
    property.bedrooms = Number(data.get('bedrooms')) || 0;
    property.epcRating = String(data.get('epcRating') || '').trim();
    property.epcPotential = String(data.get('epcPotential') || '').trim();
    property.sqft = Number(data.get('sqft')) || 0;
    property.builtYear = Number(data.get('builtYear')) || 0;
    property.leasehold = String(data.get('leasehold') || '').trim();
    property.floors = Number(data.get('floors')) || 0;
    property.floorNumber = Number(data.get('floorNumber')) || 0;
    property.newBuilding = String(data.get('newBuilding') || '').trim();
    property.occupancy = String(data.get('occupancy') || '').trim();
    property.tenancyStatus = property.occupancy;

    saveState(state);
    close();
    render();
  });
}

function requireAuth(route) {
  if (!state.loggedIn && route !== '/login') {
    navigate('/login');
    return false;
  }
  if (state.loggedIn && route === '/login') {
    navigate('/dashboard');
    return false;
  }
  return true;
}

function renderHeader(showNav = true) {
  if (!showNav) return '';
  return `
    <header class="site-header">
      <div class="site-header__inner">
        <a class="site-header__brand" href="#/dashboard">
          ${renderPortalLogo({ height: 32 })}
          <span class="site-header__product">Investor Landlord Portal</span>
        </a>
        <nav class="site-header__nav">
          <span class="site-header__user">Signed in as <strong>demo.landlord@email.com</strong></span>
          <button class="btn-link" data-action="logout">Sign out</button>
        </nav>
      </div>
    </header>
    <div class="demo-banner">Demonstration prototype only. All property and portfolio data is fictional.</div>
  `;
}

const INFO_TOOLTIP_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;

function renderInfoTooltip(text) {
  return `
    <span class="info-tooltip">
      <button type="button" class="info-tooltip__trigger" aria-label="More information">${INFO_TOOLTIP_ICON}</button>
      <span class="info-tooltip__content" role="tooltip">${escapeHtml(text)}</span>
    </span>
  `;
}

function renderRemovePropertyModal(property) {
  return `
    <div class="modal" id="remove-property-modal" hidden>
      <div class="modal__backdrop" data-action="close-remove-property"></div>
      <div class="modal__panel" role="dialog" aria-labelledby="remove-property-title" aria-modal="true">
        <h2 class="modal__title" id="remove-property-title">Remove property from portfolio</h2>
        <p class="modal__intro">Are you sure you want to remove <strong>${escapeHtml(property.titleRef)}</strong> — ${escapeHtml(formatAddress(property))} — from this portfolio? This action cannot be undone.</p>
        <div class="modal__actions">
          <button type="button" class="btn btn-secondary" data-action="close-remove-property">Cancel</button>
          <button type="button" class="btn btn-danger" data-action="confirm-remove-property">Remove property</button>
        </div>
      </div>
    </div>
  `;
}

function bindRemoveProperty(index) {
  const modal = document.getElementById('remove-property-modal');
  if (!modal) return;

  const open = () => { modal.hidden = false; };
  const close = () => { modal.hidden = true; };

  document.querySelector('[data-action="open-remove-property"]')?.addEventListener('click', open);
  modal.querySelectorAll('[data-action="close-remove-property"]').forEach((el) => {
    el.addEventListener('click', close);
  });
  modal.querySelector('[data-action="confirm-remove-property"]')?.addEventListener('click', () => {
    const portfolio = state.portfolio;
    if (!portfolio || index < 0 || index >= portfolio.properties.length) return;
    portfolio.properties.splice(index, 1);
    saveState(state);
    close();
    navigate('/portfolio/summary');
  });
}

function renderMissingIndicator() {
  return `
    <span class="missing-indicator" title="Missing data — update required" aria-label="Missing data, update required">
      <svg class="missing-indicator__icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <circle cx="9" cy="9" r="8"/>
        <text x="9" y="12.5" text-anchor="middle" fill="#fff" font-size="10" font-weight="700" font-family="Oxygen, sans-serif">!</text>
      </svg>
      <span class="missing-indicator__label">update</span>
    </span>
  `;
}

function renderRentAgreedDisplay(value, forSummary = false) {
  const num = Number(String(value ?? '').replace(/[^0-9.]/g, ''));
  if (num > 0) return formatCurrency(num);
  if (forSummary) return '—';
  return renderMissingIndicator();
}

function renderLineCurrency(value) {
  if (!hasDisplayValue(value) || !Number(String(value).replace(/[^0-9.]/g, ''))) {
    return renderMissingIndicator();
  }
  return `${formatCurrency(value)}<span class="cell-suffix">/mo</span>`;
}

function renderLineCurrencyPlain(value) {
  if (!hasDisplayValue(value) || !Number(String(value).replace(/[^0-9.]/g, ''))) {
    return renderMissingIndicator();
  }
  return formatCurrency(value);
}

function renderLineInterestRate(value) {
  const formatted = formatInterestRate(value);
  if (!formatted) return renderMissingIndicator();
  return formatted;
}

function renderLineOccupancy(value) {
  if (!hasDisplayValue(value)) return renderMissingIndicator();
  const label = value === 'Let' ? 'Rented' : value;
  const isRented = label === 'Rented';
  return `<span class="badge ${isRented ? 'badge-green' : 'badge-amber'}">${escapeHtml(label)}</span>`;
}

function renderLineCompleteness(percent) {
  const level = percent >= 75 ? 'high' : percent >= 50 ? 'medium' : 'low';
  return `<span class="completeness-pill completeness-pill--${level}">${percent}%</span>`;
}

function renderDetailValue(value, type = 'text') {
  switch (type) {
    case 'currency':
      return renderLineCurrencyPlain(value);
    case 'currency-mo':
      return renderLineCurrency(value);
    case 'percent':
      return renderLineInterestRate(value) || renderMissingIndicator();
    case 'occupancy':
      return renderLineOccupancy(value);
    case 'rent-agreed':
      return renderRentAgreedDisplay(value);
    default:
      return hasDisplayValue(value) ? escapeHtml(String(value)) : renderMissingIndicator();
  }
}

function renderPropertyHero(property) {
  const seed = propertyDemoSeed(property);
  const avm = Number(property.avmValue) || 0;
  const rentAgreed = getAchievedRentTotal(property);
  const rentForYield = rentAgreed > 0 ? rentAgreed : Number(property.marketRent) || 0;
  const grossYield = avm > 0 && rentForYield
    ? ((rentForYield * 12) / avm) * 100
    : null;

  return `
    <section class="property-hero" aria-label="Property summary">
      <div class="property-hero__main">
        <p class="property-hero__ref">${escapeHtml(property.titleRef)}</p>
        <h1 class="property-hero__address">${escapeHtml(formatAddress(property))}</h1>
        <p class="property-hero__meta">${seed.bedrooms} bedroom${seed.bedrooms === 1 ? '' : 's'} · ${escapeHtml(seed.propertyType)} · EPC ${seed.epcRating}</p>
      </div>
      <div class="property-hero__metrics">
        <div class="property-hero__metric">
          <span class="property-hero__metric-value">${renderLineCurrencyPlain(property.avmValue)}</span>
          <span class="property-hero__metric-label">Estimated value</span>
        </div>
        <div class="property-hero__metric">
          <span class="property-hero__metric-value">${renderLineCurrency(property.marketRent)}</span>
          <span class="property-hero__metric-label">Market rent</span>
        </div>
        <div class="property-hero__metric">
          <span class="property-hero__metric-value">${renderRentAgreedDisplay(property.rentAgreed)}</span>
          <span class="property-hero__metric-label">Achieved rent</span>
        </div>
        <div class="property-hero__metric">
          <span class="property-hero__metric-value">${grossYield != null ? formatPercent(grossYield) : '—'}</span>
          <span class="property-hero__metric-label">Gross yield</span>
        </div>
      </div>
    </section>
  `;
}

const OVERVIEW_ICONS = {
  key: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="var(--portal-primary)"/><path d="M12 6l1.2 3.6H17l-3 2.2 1.1 3.5L12 13.8 8.9 15.3 10 11.8 7 9.6h3.8L12 6z" fill="#fff"/></svg>`,
  rent: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="var(--portal-primary)"/><path d="M12 7v5l3.5 2" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
  value: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="var(--portal-primary)"/><path d="M12 5l7 5.2V18H5V10.2L12 5zm0 2.4L7 10.6V16h10v-5.4l-5-3.2z" fill="#fff"/></svg>`,
  financials: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="var(--portal-primary)"/><path d="M7 9h10v2H7V9zm0 4h6v2H7v-2z" fill="#fff"/></svg>`,
  mortgage: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="var(--portal-primary)"/><path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 2v3l2 1" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>`,
};

function formatDaysOnMarket(days) {
  const value = Number(days);
  if (!Number.isFinite(value) || value <= 0) return '0 days';
  return value === 1 ? '1 day' : `${value} days`;
}

function formatOverviewAddress(property) {
  return `${property.street} ${property.propertyNumber}, ${property.postcode} ${property.city}`;
}

function renderOverviewAttr(label, value) {
  return `
    <div class="overview-attr">
      <span class="overview-attr__label">${escapeHtml(label)}</span>
      <span class="overview-attr__value">${value}</span>
    </div>
  `;
}

function renderFinancialMetric(label, content) {
  return `
    <div class="financial-metric">
      <span class="financial-metric__label">${escapeHtml(label)}</span>
      <div class="financial-metric__value">${content}</div>
    </div>
  `;
}

function renderFinancialOrMissing(hasValue, content) {
  if (!hasValue) return renderMissingIndicator();
  return typeof content === 'function' ? content() : content;
}

function renderOccupancyBadge(occupancy) {
  const label = occupancy === 'Let' ? 'Rented' : (occupancy || 'Vacant');
  const isVacant = label === 'Vacant';
  return `<span class="overview-status ${isVacant ? 'overview-status--vacant' : 'overview-status--rented'}">${escapeHtml(label)}</span>`;
}

function renderPropertyToolbar(index, activeTabId) {
  return `
    <div class="property-toolbar">
      <a class="property-back" href="#/portfolio/summary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Back to portfolio
      </a>
      <nav class="property-tabs" aria-label="Property sections">
        <div class="property-tabs__scroll">
          ${PROPERTY_TABS.map((tab) => `
            <a
              class="${renderPropertyTabClass(tab, activeTabId)}"
              href="#/portfolio/property/${index}/${tab.id}"
              ${tab.id === activeTabId ? 'aria-current="page"' : ''}
            >${renderPropertyTabLabel(tab)}</a>
          `).join('')}
        </div>
      </nav>
    </div>
  `;
}

function renderPropertyOverviewBadges(property, index) {
  const opportunityBadge = renderLineOpportunityBadge(countPropertyOptimisationOpportunities(property), index);
  const alertBadge = renderLineAlertBadge(property, index);
  if (!opportunityBadge && !alertBadge) return '';

  return `
    <section class="property-overview-badges" aria-label="Opportunities and alerts">
      <div class="property-overview-badges__header">
        <h2 class="property-overview-badges__title">Opportunities &amp; alerts</h2>
        <p class="property-overview-badges__intro">Review items that may need your attention for this property.</p>
      </div>
      <div class="line-badges property-overview-badges__list">${opportunityBadge}${alertBadge}</div>
    </section>
  `;
}

function renderPropertyOverviewTab(property, index) {
  const seed = propertyDemoSeed(property);
  const details = getPropertyOverviewDetails(property);
  const marketRent = Number(property.marketRent) || 0;
  const avm = Number(property.avmValue) || 0;
  const rentAgreed = getAchievedRentTotal(property);
  const rentPcm = rentAgreed > 0 ? rentAgreed : marketRent;
  const suggestedRent = marketRent;

  return `
    <div class="property-tab-panel property-tab-panel--overview">
      ${renderPropertyOverviewBadges(property, index)}

      <section class="overview-section overview-section--compact">
        <div class="overview-section__header">
          <div class="overview-section__title-wrap">
            <span class="overview-section__icon">${OVERVIEW_ICONS.key}</span>
            <h2 class="overview-section__title">Key information</h2>
          </div>
          <div class="overview-section__actions">
            <button type="button" class="overview-action-btn" data-action="open-overview-edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
              Edit
            </button>
            ${renderOccupancyBadge(details.occupancy)}
          </div>
        </div>

        <div class="overview-attrs overview-attrs--compact">
          ${renderOverviewAttr('Type', escapeHtml(details.propertyType))}
          ${renderOverviewAttr('Bedrooms', details.bedrooms)}
          ${renderOverviewAttr('EPC', `${details.epcRating} → ${details.epcPotential}`)}
          ${renderOverviewAttr('Net living area', `${Number(details.sqft).toLocaleString('en-GB')} sq.ft`)}
        </div>
      </section>

      <section class="overview-section overview-section--compact">
        <div class="overview-section__header">
          <div class="overview-section__title-wrap">
            <span class="overview-section__icon">${OVERVIEW_ICONS.rent}</span>
            <h2 class="overview-section__title">Rent</h2>
          </div>
        </div>

        <div class="overview-metrics">
          <div class="overview-metric">
            <span class="overview-metric__label">Achieved rent</span>
            <span class="overview-metric__value">${marketRent > 0 ? formatCurrency(rentPcm) : renderMissingIndicator()}</span>
          </div>
          <div class="overview-metric">
            <span class="overview-metric__label">Rent per sq.ft</span>
            <span class="overview-metric__value">${marketRent > 0 ? `£${details.rentPerSqft}` : '—'}</span>
          </div>
          <div class="overview-metric">
            <span class="overview-metric__label">Market rent range</span>
            <span class="overview-metric__value">${marketRent > 0 ? `${formatCurrency(seed.rentLow)} - ${formatCurrency(seed.rentHigh)}` : renderMissingIndicator()}</span>
          </div>
          <div class="overview-metric">
            <span class="overview-metric__label">Suggested rent</span>
            <span class="overview-metric__value">${marketRent > 0 ? formatCurrency(suggestedRent) : renderMissingIndicator()}</span>
          </div>
        </div>

        <div class="overview-market-box overview-market-box--compact">
          <div class="overview-market-box__item">
            <span class="overview-market-box__dot"></span>
            <span>Similar properties: <strong>+ ${seed.similarRent}</strong></span>
          </div>
          <p class="overview-market-box__text">On average, similar properties stay on the market for <strong>${formatDaysOnMarket(seed.rentDaysOnMarket)}</strong></p>
        </div>
      </section>

      <section class="overview-section overview-section--compact">
        <div class="overview-section__header">
          <div class="overview-section__title-wrap">
            <span class="overview-section__icon">${OVERVIEW_ICONS.value}</span>
            <h2 class="overview-section__title">Value</h2>
          </div>
        </div>

        <div class="overview-metrics overview-metrics--3">
          <div class="overview-metric">
            <span class="overview-metric__label">Estimated value</span>
            <span class="overview-metric__value">${avm > 0 ? formatCurrency(avm) : renderMissingIndicator()}</span>
          </div>
          <div class="overview-metric">
            <span class="overview-metric__label">Value per sq.ft</span>
            <span class="overview-metric__value">${avm > 0 ? `£${seed.salePerSqft} /sq.ft` : '—'}</span>
          </div>
          <div class="overview-metric">
            <span class="overview-metric__label">Market value range</span>
            <span class="overview-metric__value">${avm > 0 ? `${formatCurrency(Math.round(avm * 0.92))} - ${formatCurrency(Math.round(avm * 1.06))}` : '—'}</span>
          </div>
        </div>

        <div class="overview-market-box overview-market-box--compact">
          <div class="overview-market-box__item">
            <span class="overview-market-box__dot"></span>
            <span>Similar properties: <strong>+ ${seed.similarSale}</strong></span>
          </div>
          <p class="overview-market-box__text">On average, similar properties stay on the market for <strong>${formatDaysOnMarket(seed.saleDaysOnMarket)}</strong></p>
        </div>
      </section>

      <section class="overview-section investor-club-section">
        <div class="overview-section__header">
          <div class="overview-section__title-wrap">
            <span class="investor-club-section__logo" aria-hidden="true">${renderPortalIcon({ height: 18 })}</span>
            <h2 class="overview-section__title">Ready to sell quickly?</h2>
          </div>
        </div>
        <p class="investor-club-section__text">Add this property to the Investor Club — an exclusive marketplace for registered landlord customers.</p>
        <button type="button" class="btn btn-secondary investor-club-section__cta" data-action="add-investor-club">Add to Investor Club</button>
      </section>

      <div class="property-overview-actions">
        <button type="button" class="btn btn-tertiary btn-sm property-overview-actions__remove" data-action="open-remove-property">Remove from portfolio</button>
      </div>
    </div>
    ${renderOverviewEditModal(property, details)}
  `;
}

function renderTenancyTable(tenancies) {
  if (!tenancies.length) {
    return '<p class="tenancy-empty">No individual tenancies recorded. Use Edit to add room-level income for HMO properties.</p>';
  }

  return `
    <div class="data-table-wrap">
      <table class="data-table tenancy-table">
        <thead>
          <tr>
            <th>Room</th>
            <th>Tenant</th>
            <th>Start date</th>
            <th>End date</th>
            <th>Monthly rent</th>
            <th>Agreement type</th>
          </tr>
        </thead>
        <tbody>
          ${tenancies.map((tenancy) => `
            <tr>
              <td>${escapeHtml(tenancy.roomNumber || '—')}</td>
              <td>${escapeHtml(tenancy.tenantName || '—')}</td>
              <td>${formatTenancyDate(tenancy.startDate)}</td>
              <td>${formatTenancyDate(tenancy.endDate)}</td>
              <td>${hasDisplayValue(tenancy.monthlyRent) ? `${formatCurrency(tenancy.monthlyRent)}<span class="cell-suffix">/mo</span>` : '—'}</td>
              <td>${escapeHtml(tenancy.agreementType || '—')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderTenancyEditRow(tenancy = {}, index = 0) {
  return `
    <fieldset class="tenancy-edit-row" data-tenancy-row="${index}">
      <legend class="tenancy-edit-row__legend">Tenancy ${index + 1}</legend>
      <div class="form-grid form-grid--3">
        <div class="form-field">
          <label>Room number</label>
          <input type="text" name="roomNumber" value="${escapeHtml(tenancy.roomNumber || '')}" placeholder="e.g. 1">
        </div>
        <div class="form-field">
          <label>Tenant name</label>
          <input type="text" name="tenantName" value="${escapeHtml(tenancy.tenantName || '')}" placeholder="e.g. J. Smith">
        </div>
        <div class="form-field">
          <label>Monthly rent (£)</label>
          <input type="text" name="monthlyRent" inputmode="decimal" value="${escapeHtml(tenancy.monthlyRent || '')}" placeholder="e.g. 650">
        </div>
        <div class="form-field">
          <label>Start date</label>
          <input type="date" name="startDate" value="${escapeHtml(tenancy.startDate || '')}">
        </div>
        <div class="form-field">
          <label>End date</label>
          <input type="date" name="endDate" value="${escapeHtml(tenancy.endDate || '')}">
        </div>
        <div class="form-field">
          <label>Agreement type</label>
          <select name="agreementType">${renderSelectOptions(TENANCY_AGREEMENT_TYPES, tenancy.agreementType || 'Assured shorthold')}</select>
        </div>
      </div>
      <button type="button" class="btn-link tenancy-edit-row__remove" data-action="remove-tenancy-row">Remove tenancy</button>
    </fieldset>
  `;
}

function renderTenancyEditModal(property) {
  if (isHmoProperty(property)) {
    const tenancies = getPropertyTenancies(property);

    return `
      <div class="modal" id="tenancy-edit-modal" hidden>
        <div class="modal__backdrop" data-action="close-tenancy-edit"></div>
        <div class="modal__panel modal__panel--wide" role="dialog" aria-labelledby="tenancy-edit-title" aria-modal="true">
          <h2 class="modal__title" id="tenancy-edit-title">Edit rental</h2>
          <p class="modal__intro">Record individual tenancies for HMO and multi-let properties. Total achieved rent is calculated from the monthly rents entered below.</p>
          <form id="tenancy-edit-form" class="modal__form">
            <div id="tenancy-edit-rows" class="tenancy-edit-rows">
              ${tenancies.length
        ? tenancies.map((tenancy, index) => renderTenancyEditRow(tenancy, index)).join('')
        : renderTenancyEditRow({}, 0)}
            </div>
            <div class="tenancy-edit-actions">
              <button type="button" class="btn btn-secondary" data-action="add-tenancy-row">Add tenancy</button>
              <button type="button" class="btn btn-tertiary" data-action="prefill-tenancy-single">Prefill single tenancy</button>
              <button type="button" class="btn btn-tertiary" data-action="prefill-tenancy-hmo">Prefill HMO</button>
            </div>
            <div class="modal__actions">
              <button type="button" class="btn btn-tertiary" data-action="close-tenancy-edit">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  return `
    <div class="modal" id="tenancy-edit-modal" hidden>
      <div class="modal__backdrop" data-action="close-tenancy-edit"></div>
      <div class="modal__panel" role="dialog" aria-labelledby="tenancy-edit-title" aria-modal="true">
        <h2 class="modal__title" id="tenancy-edit-title">Edit rental</h2>
        <p class="modal__intro">Update the recorded monthly rent for this property.</p>
        <form id="tenancy-edit-form" class="modal__form">
          <div class="form-field">
            <label for="rent-agreed">Monthly rent (£)</label>
            <input type="text" id="rent-agreed" name="rentAgreed" inputmode="decimal" value="${escapeHtml(property.rentAgreed || '')}" placeholder="e.g. 1450">
          </div>
          <div class="modal__actions">
            <button type="button" class="btn btn-tertiary" data-action="close-tenancy-edit">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function getPropertyDefaultTab(property) {
  return hasCompletedMortgageDetails(property) ? 'overview' : 'financials';
}

function renderFinancialCompletionBanner() {
  return `
    <section class="completion-prompt" aria-label="Complete property financial information">
      <h2 class="completion-prompt__title">Complete your property finances</h2>
      <p class="completion-prompt__message">As a landlord, add mortgage and rental details for this property to unlock insights, personalised opportunities, and portfolio analysis.</p>
      <button type="button" class="btn completion-prompt__cta" data-action="open-financials-edit">Add financial details</button>
    </section>
  `;
}

function renderPortfolioFinancialCompletionBanner(properties) {
  const incompleteCount = properties.filter((property) => !hasCompletedMortgageDetails(property)).length;
  if (incompleteCount === 0) return '';

  const firstIncompleteIndex = properties.findIndex((property) => !hasCompletedMortgageDetails(property));
  const propertyLabel = incompleteCount === properties.length
    ? 'each property'
    : `${incompleteCount} ${incompleteCount === 1 ? 'property' : 'properties'}`;

  return `
    <section class="completion-prompt completion-prompt--portfolio" aria-label="Complete portfolio financial information">
      <h2 class="completion-prompt__title">Complete your property finances</h2>
      <p class="completion-prompt__message">As a landlord, add mortgage and rental details for ${propertyLabel} in your portfolio to unlock insights, personalised opportunities, and portfolio analysis.</p>
      <a class="btn completion-prompt__cta" href="#/portfolio/property/${firstIncompleteIndex}/financials">Complete financial details</a>
    </section>
  `;
}

function renderPropertyFinancialsTab(property, index) {
  const fin = computePropertyFinancials(property);
  const tenancies = getPropertyTenancies(property);
  const mortgageProductType = getMortgageProductType(property);
  const isHmo = isHmoProperty(property);

  const currentValueHtml = renderFinancialOrMissing(
    fin.hasCurrentValue,
    () => `<strong>${formatCurrency(fin.currentValue)}</strong>`,
  );

  const valueChangeHtml = renderFinancialOrMissing(
    fin.hasValueChange,
    () => `<strong class="${fin.valueChange >= 0 ? 'financial-change--up' : 'financial-change--down'}">${
      fin.valueChange >= 0 ? '+' : ''
    }${formatCurrency(fin.valueChange)} (${fin.valueChangePct >= 0 ? '+' : ''}${fin.valueChangePct.toFixed(1)}%)</strong>`,
  );

  const marketRentHtml = fin.hasMarketRent
    ? `<strong>${formatCurrency(fin.marketRentRange.low)} - ${formatCurrency(fin.marketRentRange.high)}</strong>`
    : renderMissingIndicator();

  const rentAgreedHtml = renderFinancialOrMissing(
    fin.hasRentAgreed,
    () => `<strong>${formatCurrency(fin.rentAgreed)}</strong><span class="cell-suffix">/mo</span>`,
  );

  const grossYieldHtml = renderFinancialOrMissing(
    fin.hasGrossYield,
    () => `<strong>${formatPercent(fin.grossYield)}</strong>`,
  );

  const refinanceHtml = fin.hasIndicativeRefinance
    ? `<strong>${fin.indicativeRefinanceRate.toFixed(1)}%</strong>${
      fin.monthlySavings > 0
        ? `<span class="financial-savings">— save ${formatCurrency(fin.monthlySavings)} monthly</span>`
        : ''
    }`
    : renderMissingIndicator();

  const mortgageExpiryDisplay = formatMortgageExpiry(fin.mortgageExpiry);
  const purchaseDateDisplay = formatPurchaseDate(fin.purchaseDate);
  const refinanceOpportunityHtml = renderFinancialRefinanceOpportunity(property, index);
  const renewalOpportunityHtml = renderFinancialMortgageRenewalOpportunity(property, index);
  const rentReviewOpportunityHtml = renderFinancialRentReviewOpportunity(property, index);
  const completionBannerHtml = hasCompletedMortgageDetails(property)
    ? ''
    : renderFinancialCompletionBanner();

  return `
    <div class="property-tab-panel property-tab-panel--financials">
      ${completionBannerHtml}
      <div class="scenario-panel financial-demo-panel">
        <p class="scenario-panel__label">Demo scenarios</p>
        <div class="financial-demo-panel__actions">
          <button type="button" class="btn btn-secondary btn-sm" data-action="prefill-financials-single">Prefill single tenancy</button>
          <button type="button" class="btn btn-secondary btn-sm" data-action="prefill-financials-hmo">Prefill HMO</button>
        </div>
      </div>

      ${renewalOpportunityHtml}
      ${refinanceOpportunityHtml}
      ${rentReviewOpportunityHtml}

      <section class="financial-section">
        <div class="financial-section__header">
          <div class="financial-section__title-wrap">
            <span class="financial-section__icon">${OVERVIEW_ICONS.financials}</span>
            <h2 class="financial-section__title">Mortgage &amp; value</h2>
          </div>
          <button type="button" class="financial-action-btn" data-action="open-financials-edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
            Edit
          </button>
        </div>

        <div class="financial-grid">
          <div class="financial-grid__col">
            ${renderFinancialMetric('Purchase price', renderFinancialOrMissing(fin.hasPurchasePrice, () => `<strong>${formatCurrency(fin.purchasePrice)}</strong>`))}
            ${renderFinancialMetric('Purchase date', renderFinancialOrMissing(fin.hasPurchaseDate && !!purchaseDateDisplay, () => `<strong>${escapeHtml(purchaseDateDisplay || '')}</strong>`))}
            ${renderFinancialMetric('Remaining mortgage', renderFinancialOrMissing(fin.hasRemainingMortgage, () => `<strong>${formatCurrency(fin.remainingMortgage)}</strong>`))}
            ${renderFinancialMetric('Mortgage product type', renderFinancialOrMissing(fin.hasMortgageProductType, () => `<strong>${escapeHtml(mortgageProductType)}</strong>`))}
          </div>
          <div class="financial-grid__col">
            ${renderFinancialMetric('Mortgage expiry', renderFinancialOrMissing(fin.hasMortgageExpiry && !!mortgageExpiryDisplay, () => `<strong>${escapeHtml(mortgageExpiryDisplay || '')}</strong>`))}
            ${renderFinancialMetric('Bank', renderFinancialOrMissing(fin.hasBank, () => `<strong>${escapeHtml(fin.bank)}</strong>`))}
            ${renderFinancialMetric('Current value', currentValueHtml)}
            ${renderFinancialMetric('Value change', valueChangeHtml)}
          </div>
          <div class="financial-grid__col">
            ${renderFinancialMetric('Interest rate', renderFinancialOrMissing(fin.hasInterestRate, () => `<strong>${fin.interestRate.toFixed(1)}%</strong>`))}
            ${renderFinancialMetric('LTV', renderFinancialOrMissing(fin.hasLtv, () => `<strong>${fin.ltv.toFixed(0)}%</strong>`))}
            ${renderFinancialMetric('Indicative refinancing rate', refinanceHtml)}
          </div>
        </div>
      </section>

      <section class="financial-section">
        <div class="financial-section__header">
          <div class="financial-section__title-wrap">
            <span class="financial-section__icon">${OVERVIEW_ICONS.rent}</span>
            <h2 class="financial-section__title">Rental</h2>
          </div>
          <button type="button" class="financial-action-btn" data-action="open-tenancy-edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
            Edit
          </button>
        </div>

        <div class="financial-grid">
          <div class="financial-grid__col">
            ${renderFinancialMetric('Market rent', marketRentHtml)}
          </div>
          <div class="financial-grid__col">
            ${renderFinancialMetric('Total achieved rent', rentAgreedHtml)}
          </div>
          <div class="financial-grid__col">
            ${renderFinancialMetric('Gross yield', grossYieldHtml)}
          </div>
        </div>
        ${isHmo ? renderTenancyTable(tenancies) : ''}
      </section>
    </div>

    <div class="modal" id="financials-edit-modal" hidden>
      <div class="modal__backdrop" data-action="close-financials-edit"></div>
      <div class="modal__panel" role="dialog" aria-labelledby="financials-edit-title" aria-modal="true">
        <h2 class="modal__title" id="financials-edit-title">Edit mortgage &amp; value</h2>
        <p class="modal__intro">Update purchase, mortgage and valuation details. Calculated fields will update automatically.</p>
        <form id="financials-edit-form" class="modal__form">
          <div class="form-field">
            <label for="fin-purchase-price">Purchase price (£)</label>
            <input type="text" id="fin-purchase-price" name="purchasePrice" inputmode="decimal" value="${escapeHtml(property.purchasePrice || '')}" placeholder="e.g. 350000">
          </div>
          <div class="form-field">
            <label for="fin-purchase-date">Purchase date</label>
            <input type="month" id="fin-purchase-date" name="purchaseDate" value="${escapeHtml(property.purchaseDate ? String(property.purchaseDate).slice(0, 7) : '')}">
          </div>
          <div class="form-field">
            <label for="fin-remaining-mortgage">Remaining mortgage (£)</label>
            <input type="text" id="fin-remaining-mortgage" name="remainingMortgage" inputmode="decimal" value="${escapeHtml(property.mortgageBalance || '')}" placeholder="e.g. 235000">
          </div>
          <div class="form-field">
            <label for="fin-mortgage-product">Mortgage product type</label>
            <select id="fin-mortgage-product" name="mortgageProductType">${renderSelectOptions(MORTGAGE_PRODUCT_TYPES, mortgageProductType)}</select>
          </div>
          <div class="form-field">
            <label for="fin-interest-rate">Interest rate (%)</label>
            <input type="text" id="fin-interest-rate" name="interestRate" inputmode="decimal" value="${escapeHtml(property.interestRate || '')}" placeholder="e.g. 3.5">
          </div>
          <div class="form-field">
            <label for="fin-bank">Bank</label>
            <input type="text" id="fin-bank" name="bank" value="${escapeHtml(property.mortgageProvider || '')}" placeholder="e.g. Barclays">
          </div>
          <div class="form-field">
            <label for="fin-mortgage-expiry">Mortgage expiry</label>
            <input type="month" id="fin-mortgage-expiry" name="mortgageExpiry" value="${escapeHtml(property.mortgageEndDate ? String(property.mortgageEndDate).slice(0, 7) : '')}">
          </div>
          <div class="modal__actions">
            <button type="button" class="btn btn-tertiary" data-action="close-financials-edit">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
    ${renderTenancyEditModal(property)}
  `;
}

function bindFinancialsDemoPrefill(index) {
  document.querySelector('[data-action="prefill-financials-single"]')?.addEventListener('click', () => {
    const property = state.portfolio?.properties[index];
    if (!property) return;
    applyFinancialDemoScenario(property, 'single', { propertyIndex: index });
    saveState(state);
    render();
  });

  document.querySelector('[data-action="prefill-financials-hmo"]')?.addEventListener('click', () => {
    const property = state.portfolio?.properties[index];
    if (!property) return;
    applyFinancialDemoScenario(property, 'hmo', { propertyIndex: index });
    saveState(state);
    render();
  });
}

function bindFinancialsEdit(index) {
  const modal = document.getElementById('financials-edit-modal');
  const form = document.getElementById('financials-edit-form');
  if (!modal || !form) return;

  const open = () => { modal.hidden = false; };
  const close = () => { modal.hidden = true; };

  const saveFinancialsFromForm = () => {
    const portfolio = state.portfolio;
    if (!portfolio?.properties[index]) return;

    const data = new FormData(form);
    const property = portfolio.properties[index];
    property.purchasePrice = String(data.get('purchasePrice') || '').trim();
    const purchaseMonth = String(data.get('purchaseDate') || '').trim();
    property.purchaseDate = purchaseMonth ? `${purchaseMonth}-01` : '';
    property.mortgageBalance = String(data.get('remainingMortgage') || '').trim();
    property.mortgageProductType = String(data.get('mortgageProductType') || '').trim();
    property.productType = property.mortgageProductType;
    property.interestRate = String(data.get('interestRate') || '').trim();
    property.mortgageProvider = String(data.get('bank') || '').trim();

    const expiryMonth = String(data.get('mortgageExpiry') || '').trim();
    property.mortgageEndDate = expiryMonth ? `${expiryMonth}-01` : '';

    applyFinancialsToProperty(property);
    saveState(state);
    close();
    render();
  };

  document.querySelectorAll('[data-action="open-financials-edit"]').forEach((btn) => {
    btn.addEventListener('click', open);
  });
  document.querySelectorAll('[data-action="close-financials-edit"]').forEach((btn) => {
    btn.addEventListener('click', close);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    saveFinancialsFromForm();
  });
}

function bindTenancyEdit(index) {
  const modal = document.getElementById('tenancy-edit-modal');
  const form = document.getElementById('tenancy-edit-form');
  if (!modal || !form) return;

  const open = () => { modal.hidden = false; };
  const close = () => { modal.hidden = true; };

  document.querySelector('[data-action="open-tenancy-edit"]')?.addEventListener('click', open);
  modal.querySelectorAll('[data-action="close-tenancy-edit"]').forEach((el) => {
    el.addEventListener('click', close);
  });

  const property = state.portfolio?.properties[index];
  if (!property || !isHmoProperty(property)) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const portfolio = state.portfolio;
      if (!portfolio?.properties[index]) return;

      portfolio.properties[index].rentAgreed = String(
        form.querySelector('[name="rentAgreed"]')?.value || '',
      ).trim();
      portfolio.properties[index].tenancies = [];
      saveState(state);
      close();
      render();
    });
    return;
  }

  const rowsContainer = document.getElementById('tenancy-edit-rows');
  if (!rowsContainer) return;

  const reindexRows = () => {
    rowsContainer.querySelectorAll('.tenancy-edit-row').forEach((row, rowIndex) => {
      row.dataset.tenancyRow = String(rowIndex);
      const legend = row.querySelector('.tenancy-edit-row__legend');
      if (legend) legend.textContent = `Tenancy ${rowIndex + 1}`;
    });
  };

  const addRow = (tenancy = {}) => {
    const rowIndex = rowsContainer.querySelectorAll('.tenancy-edit-row').length;
    rowsContainer.insertAdjacentHTML('beforeend', renderTenancyEditRow(tenancy, rowIndex));
    reindexRows();
  };

  modal.querySelector('[data-action="add-tenancy-row"]')?.addEventListener('click', () => addRow());

  modal.querySelector('[data-action="prefill-tenancy-single"]')?.addEventListener('click', () => {
    const currentProperty = state.portfolio?.properties[index];
    if (!currentProperty) return;
    rowsContainer.innerHTML = getDemoSingleTenancy(enrichPropertyWithAvm(currentProperty))
      .map((tenancy, rowIndex) => renderTenancyEditRow(tenancy, rowIndex))
      .join('');
    reindexRows();
  });

  modal.querySelector('[data-action="prefill-tenancy-hmo"]')?.addEventListener('click', () => {
    const currentProperty = state.portfolio?.properties[index];
    if (!currentProperty) return;
    rowsContainer.innerHTML = getDemoTenancies(enrichPropertyWithAvm(currentProperty))
      .map((tenancy, rowIndex) => renderTenancyEditRow(tenancy, rowIndex))
      .join('');
    reindexRows();
  });

  rowsContainer.addEventListener('click', (event) => {
    const removeBtn = event.target.closest('[data-action="remove-tenancy-row"]');
    if (!removeBtn) return;
    const rows = rowsContainer.querySelectorAll('.tenancy-edit-row');
    if (rows.length <= 1) {
      removeBtn.closest('.tenancy-edit-row')?.querySelectorAll('input, select').forEach((input) => {
        if (input.tagName === 'SELECT') input.selectedIndex = 0;
        else input.value = '';
      });
      return;
    }
    removeBtn.closest('.tenancy-edit-row')?.remove();
    reindexRows();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const portfolio = state.portfolio;
    if (!portfolio?.properties[index]) return;

    const currentProperty = portfolio.properties[index];
    const tenancies = [...rowsContainer.querySelectorAll('.tenancy-edit-row')].map((row) => ({
      roomNumber: String(row.querySelector('[name="roomNumber"]')?.value || '').trim(),
      tenantName: String(row.querySelector('[name="tenantName"]')?.value || '').trim(),
      startDate: String(row.querySelector('[name="startDate"]')?.value || '').trim(),
      endDate: String(row.querySelector('[name="endDate"]')?.value || '').trim(),
      monthlyRent: String(row.querySelector('[name="monthlyRent"]')?.value || '').trim(),
      agreementType: String(row.querySelector('[name="agreementType"]')?.value || '').trim(),
    })).filter((tenancy) => (
      tenancy.roomNumber
      || tenancy.tenantName
      || tenancy.monthlyRent
      || tenancy.startDate
      || tenancy.endDate
    ));

    currentProperty.tenancies = tenancies;
    syncAchievedRentFromTenancies(currentProperty);
    saveState(state);
    close();
    render();
  });
}

const CARD_LAYOUT_TABS = new Set([
  'overview',
  'financials',
  'risk',
  'esg',
  'local-market',
]);

function renderSingleTrafficLight(level) {
  const levels = ['low', 'medium', 'high'];
  const active = levels.includes(level) ? level : 'low';

  return `
    <span
      class="risk-traffic-light risk-traffic-light--${active} risk-traffic-light--active"
      title="${active.charAt(0).toUpperCase() + active.slice(1)}"
    ></span>
  `;
}

function renderRiskChangeColumn(risk) {
  const { previousLevel, level } = risk;
  if (!previousLevel || previousLevel === level) {
    return '<span class="risk-traffic-change risk-traffic-change--none">No change</span>';
  }

  const alertBadge = isRiskWorsened(previousLevel, level)
    ? '<span class="alert-badge alert-badge--label">Alert</span>'
    : '';

  return `
    <div class="risk-traffic-change">
      ${renderSingleTrafficLight(previousLevel)}
      <span class="risk-traffic-change__arrow" aria-hidden="true">→</span>
      ${renderSingleTrafficLight(level)}
      ${alertBadge}
    </div>
  `;
}

function renderTrafficLightRisk(risk) {
  const levels = ['low', 'medium', 'high'];
  const active = levels.includes(risk.level) ? risk.level : 'low';

  return `
    <div class="risk-traffic-row">
      <div class="risk-traffic-row__col risk-traffic-row__col--risk">
        <span class="risk-traffic-row__label">${escapeHtml(risk.label)}</span>
      </div>
      <div class="risk-traffic-row__col risk-traffic-row__col--current">
        <div class="risk-traffic-current">
          <div class="risk-traffic-lights" role="img" aria-label="${escapeHtml(risk.label)}: ${active}">
            ${levels.map((l) => `
              <span
                class="risk-traffic-light risk-traffic-light--${l}${l === active ? ' risk-traffic-light--active' : ''}"
                title="${l.charAt(0).toUpperCase() + l.slice(1)}"
              ></span>
            `).join('')}
          </div>
          <span class="risk-traffic-row__level risk-traffic-row__level--${active}">${active.charAt(0).toUpperCase() + active.slice(1)}</span>
        </div>
      </div>
      <div class="risk-traffic-row__col risk-traffic-row__col--change">
        ${renderRiskChangeColumn(risk)}
      </div>
    </div>
  `;
}

function renderSimpleLineChart(points, options = {}) {
  const width = options.width || 680;
  const height = options.height || 200;
  const padX = 44;
  const padY = 32;
  const values = points.map((p) => p.value);
  const min = Math.min(...values) * 0.97;
  const max = Math.max(...values) * 1.03;
  const range = max - min || 1;

  const coords = points.map((point, index) => {
    const x = padX + (index / Math.max(points.length - 1, 1)) * (width - padX * 2);
    const y = height - padY - ((point.value - min) / range) * (height - padY * 2);
    return { x, y, ...point };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height - padY} L ${coords[0].x} ${height - padY} Z`;

  return `
    <div class="analytics-chart">
      <svg viewBox="0 0 ${width} ${height}" class="analytics-chart__svg" preserveAspectRatio="xMidYMid meet">
        <path d="${areaPath}" class="analytics-chart__area"/>
        <path d="${linePath}" class="analytics-chart__line"/>
        ${coords.map((c) => `<circle cx="${c.x}" cy="${c.y}" r="4" class="analytics-chart__dot"/>`).join('')}
        ${coords.map((c, i) => (i % 2 === 0 || i === coords.length - 1 ? `
          <text x="${c.x}" y="${height - 10}" text-anchor="middle" class="analytics-chart__axis-label">${escapeHtml(c.label)}</text>
        ` : '')).join('')}
      </svg>
    </div>
  `;
}

function renderSimpleBarChart(bars, options = {}) {
  const width = options.width || 680;
  const height = options.height || 200;
  const padX = 40;
  const padY = 32;
  const maxVal = Math.max(...bars.map((b) => b.value), 1);
  const slot = (width - padX * 2) / bars.length;
  const barWidth = slot * 0.55;
  const valueSuffix = options.valueSuffix || '';

  return `
    <div class="analytics-chart">
      <svg viewBox="0 0 ${width} ${height}" class="analytics-chart__svg" preserveAspectRatio="xMidYMid meet">
        ${bars.map((bar, i) => {
    const barH = (bar.value / maxVal) * (height - padY * 2);
    const x = padX + i * slot + (slot - barWidth) / 2;
    const y = height - padY - barH;
    const valueLabel = options.showValues
      ? `<text x="${x + barWidth / 2}" y="${y - 6}" text-anchor="middle" class="analytics-chart__value-label">${escapeHtml(String(bar.value))}${valueSuffix}</text>`
      : '';
    return `
            ${valueLabel}
            <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="4" class="analytics-chart__bar"/>
            <text x="${x + barWidth / 2}" y="${height - 12}" text-anchor="middle" class="analytics-chart__axis-label">${escapeHtml(bar.label)}</text>
          `;
  }).join('')}
      </svg>
    </div>
  `;
}

function renderGroupedBarChart(groups, options = {}) {
  const width = options.width || 680;
  const height = options.height || 240;
  const padX = 48;
  const padY = 44;
  const series = options.series || [
    { key: 'current', className: 'analytics-chart__bar analytics-chart__bar--primary' },
    { key: 'prior', className: 'analytics-chart__bar analytics-chart__bar--secondary' },
  ];
  const maxVal = Math.max(...groups.flatMap((group) => series.map((item) => group[item.key] || 0)), 1);
  const groupSlot = (width - padX * 2) / groups.length;
  const clusterWidth = groupSlot * 0.72;
  const barWidth = clusterWidth / series.length - 4;
  const formatValue = options.formatValue || ((value) => formatCurrency(value));

  return `
    <div class="analytics-chart">
      ${options.legend ? `
        <div class="analytics-chart__legend">
          ${options.legend.map((item) => `
            <span class="analytics-chart__legend-item">
              <span class="analytics-chart__legend-swatch analytics-chart__legend-swatch--${item.tone}"></span>
              ${escapeHtml(item.label)}
            </span>
          `).join('')}
        </div>
      ` : ''}
      <svg viewBox="0 0 ${width} ${height}" class="analytics-chart__svg" preserveAspectRatio="xMidYMid meet">
        ${groups.map((group, groupIndex) => {
    const clusterX = padX + groupIndex * groupSlot + (groupSlot - clusterWidth) / 2;
    return series.map((item, seriesIndex) => {
      const value = group[item.key] || 0;
      const barH = (value / maxVal) * (height - padY * 2);
      const x = clusterX + seriesIndex * (barWidth + 4);
      const y = height - padY - barH;
      return `
              <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="4" class="${item.className}"/>
              <text x="${x + barWidth / 2}" y="${y - 6}" text-anchor="middle" class="analytics-chart__value-label">${escapeHtml(formatValue(value))}</text>
            `;
    }).join('');
  }).join('')}
        ${groups.map((group, groupIndex) => {
    const clusterX = padX + groupIndex * groupSlot + groupSlot / 2;
    return `<text x="${clusterX}" y="${height - 12}" text-anchor="middle" class="analytics-chart__axis-label">${escapeHtml(group.label)}</text>`;
  }).join('')}
      </svg>
    </div>
  `;
}

function renderSimplePieChart(slices, options = {}) {
  const size = options.size || 280;
  const cx = size / 2;
  const cy = size / 2;
  const radius = options.radius || 88;
  const activeSlices = slices.filter((slice) => slice.value > 0);
  const total = activeSlices.reduce((sum, slice) => sum + slice.value, 0);

  if (!total) {
    return '<p class="portfolio-chart-empty">No data available</p>';
  }

  let startAngle = -90;
  const segments = activeSlices.map((slice) => {
    const portion = slice.value / total;
    const sweep = portion * 360;
    const endAngle = startAngle + sweep;
    const largeArc = sweep > 180 ? 1 : 0;
    const start = polarToCartesian(cx, cy, radius, startAngle);
    const end = polarToCartesian(cx, cy, radius, endAngle);
    const path = `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
    const percent = Math.round(portion * 100);
    const segment = `
      <path d="${path}" fill="${slice.color}" class="analytics-chart__pie-segment">
        <title>${escapeHtml(slice.label)}: ${percent}%</title>
      </path>
    `;
    startAngle = endAngle;
    return { segment, slice, percent };
  });

  return `
    <div class="analytics-pie">
      <svg viewBox="0 0 ${size} ${size}" class="analytics-chart__svg analytics-pie__svg" role="img" aria-label="${escapeHtml(options.ariaLabel || 'Distribution chart')}">
        ${segments.map((item) => item.segment).join('')}
      </svg>
      <ul class="analytics-pie__legend">
        ${segments.map(({ slice, percent }) => `
          <li class="analytics-pie__legend-item">
            <span class="analytics-pie__swatch" style="background:${slice.color}"></span>
            <span>${escapeHtml(slice.label)}</span>
            <strong>${percent}%</strong>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

function renderLocalMarketChartBlock(title, chartHtml, description = '') {
  return `
    <div class="local-market-chart-block">
      <h3 class="local-market-chart-block__title">${escapeHtml(title)}</h3>
      ${description ? `<p class="local-market-chart-block__desc">${escapeHtml(description)}</p>` : ''}
      ${chartHtml}
    </div>
  `;
}

function renderLocalMarketSectionHeader(title) {
  return `
    <div class="overview-section__header">
      <div class="overview-section__title-wrap overview-section__title-wrap--partner">
        ${renderDataloftLogo({ className: 'dataloft-logo dataloft-logo--section', height: 30 })}
        ${renderPartnerDivider()}
        <h2 class="overview-section__title">${escapeHtml(title)}</h2>
      </div>
    </div>
  `;
}

function renderRiskSectionHeader(title) {
  return `
    <div class="overview-section__header">
      <div class="overview-section__title-wrap overview-section__title-wrap--partner">
        ${renderWhenfreshLogo({ className: 'whenfresh-logo whenfresh-logo--section', height: 30 })}
        ${renderPartnerDivider()}
        <h2 class="overview-section__title">${escapeHtml(title)}</h2>
      </div>
    </div>
  `;
}

function renderLocalMarketAnalyticsStats(stats) {
  return `
    <div class="analytics-stats">
      ${stats.map((stat) => `
        <div class="analytics-stat analytics-stat--dataloft">
          <span class="analytics-stat__label">${escapeHtml(stat.label)}</span>
          <span class="analytics-stat__value ${stat.tone ? `analytics-stat__value--${stat.tone}` : ''}">${stat.value}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderAnalyticsStats(stats) {
  return `
    <div class="analytics-stats">
      ${stats.map((stat) => `
        <div class="analytics-stat">
          <span class="analytics-stat__label">${escapeHtml(stat.label)}</span>
          <span class="analytics-stat__value ${stat.tone ? `analytics-stat__value--${stat.tone}` : ''}">${stat.value}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderPropertyRiskTab(property, index) {
  const environmentalRisks = getPropertyEnvironmentalRisks(property, { propertyIndex: index });
  const insuranceAlertHtml = hasEnvironmentalRiskAlert(property, index)
    ? renderRiskInsuranceAlertBanner()
    : '';

  return `
    <div class="property-tab-panel property-tab-panel--overview">
      ${insuranceAlertHtml}

      <section class="overview-section">
        ${renderRiskSectionHeader('Risk assessment')}
        <p class="property-tab-panel__intro">Environmental and property risks for this location, including recent changes.</p>

        <div class="risk-traffic-legend" aria-hidden="true">
          <span><span class="risk-traffic-light risk-traffic-light--low risk-traffic-light--active"></span> Low</span>
          <span><span class="risk-traffic-light risk-traffic-light--medium risk-traffic-light--active"></span> Medium</span>
          <span><span class="risk-traffic-light risk-traffic-light--high risk-traffic-light--active"></span> High</span>
        </div>

        <div class="risk-traffic-list">
          <div class="risk-traffic-list__header" aria-hidden="true">
            <span class="risk-traffic-list__header-col">Risk</span>
            <span class="risk-traffic-list__header-col">Current rating</span>
            <span class="risk-traffic-list__header-col">Change</span>
          </div>
          ${environmentalRisks.map((risk) => renderTrafficLightRisk(risk)).join('')}
        </div>
      </section>
    </div>
  `;
}

function renderPropertyEsgTab(property, index) {
  const epc = getPropertyEpcDetails(property, { propertyIndex: index });
  const epcRequirementHtml = renderEsgImprovementRequirement(property, index);

  return `
    <div class="property-tab-panel property-tab-panel--overview">
      ${epcRequirementHtml}

      <section class="overview-section">
        <div class="overview-section__header">
          <div class="overview-section__title-wrap">
            <h2 class="overview-section__title">ESG &amp; Renovation</h2>
          </div>
        </div>
        <p class="property-tab-panel__intro">Energy performance and estimated cost to reach the potential rating.</p>

        <div class="esg-epc-grid">
          <div class="esg-epc-card">
            <span class="esg-epc-card__label">Current EPC rating</span>
            <span class="esg-epc-card__badge esg-epc-card__badge--current">${epc.currentRating}</span>
          </div>
          <div class="esg-epc-card esg-epc-card--arrow" aria-hidden="true">→</div>
          <div class="esg-epc-card">
            <span class="esg-epc-card__label">Potential EPC rating</span>
            <span class="esg-epc-card__badge esg-epc-card__badge--potential">${epc.potentialRating}</span>
          </div>
          <div class="esg-epc-card esg-epc-card--cost">
            <span class="esg-epc-card__label">Total cost to improve</span>
            <span class="esg-epc-card__value">${formatCurrency(epc.improvementCost)}</span>
            <span class="esg-epc-card__hint">Estimated works to reach EPC ${epc.potentialRating}</span>
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderPropertyLocalMarketTab(property) {
  const seed = propertyDemoSeed(property);
  const local = seed.localMarket;
  const city = property.city || 'this area';

  const newRentalsByTypeTotal = local.newRentalsByType.reduce((sum, item) => sum + item.value, 0);
  const newRentalsByTypePct = local.newRentalsByType.map((item) => ({
    label: item.label,
    value: Number(((item.value / newRentalsByTypeTotal) * 100).toFixed(1)),
  }));

  const priceBandTotal = local.newRentalsByPriceBand.reduce((sum, item) => sum + item.value, 0);
  const priceBandPct = local.newRentalsByPriceBand.map((item) => ({
    label: item.label,
    value: Number(((item.value / priceBandTotal) * 100).toFixed(1)),
  }));

  return `
    <div class="property-tab-panel property-tab-panel--overview">
      <p class="property-tab-panel__intro">Local rental market insights within 1 mile of ${escapeHtml(city)}.</p>

      <section class="overview-section overview-section--dataloft">
        ${renderLocalMarketSectionHeader('Currently listed in the local area')}

        ${renderLocalMarketAnalyticsStats([
    {
      label: 'Listed properties within 1 mile',
      value: local.listedProperties1mi.toLocaleString('en-GB'),
    },
    {
      label: 'New rental listings this month within 1 mile',
      value: local.newRentalListingsMonth.toLocaleString('en-GB'),
    },
    {
      label: 'Average days on market for properties rented this month within 1 mile',
      value: `${local.avgDaysOnMarketRentedMonth} days`,
    },
  ])}

        <div class="local-market-charts">
          ${renderLocalMarketChartBlock(
    'Rental properties available by month',
    renderSimpleBarChart(local.rentalAvailabilityByMonth, { height: 220 }),
    'Number of rental properties available during each month over the last year within 1 mile.',
  )}
          ${renderLocalMarketChartBlock(
    'Rent changes since initial listing',
    renderSimplePieChart(local.rentChangeProportion, {
      ariaLabel: 'Proportion of currently available homes by rent change since initial listing',
    }),
    'Proportion of currently available homes by whether they have had a rent change since initial listing within 1 mile.',
  )}
        </div>
      </section>

      <section class="overview-section overview-section--dataloft">
        ${renderLocalMarketSectionHeader('Let over the last 12 months')}

        <div class="local-market-charts">
          ${renderLocalMarketChartBlock(
    'New rentals by property type',
    renderSimpleBarChart(newRentalsByTypePct, { height: 220, showValues: true, valueSuffix: '%' }),
    'Proportion of new rentals started by type over the past 12 months within 1 mile.',
  )}
          ${renderLocalMarketChartBlock(
    'Average achieved monthly rent by bedroom count',
    renderGroupedBarChart(local.avgRentByBedrooms, {
      height: 260,
      legend: [
        { label: 'Last 12 months', tone: 'primary' },
        { label: 'Same period a year earlier', tone: 'secondary' },
      ],
      formatValue: (value) => formatCurrency(value),
    }),
    'Average achieved monthly rent for new rentals compared with the same period a year earlier, by bedroom count within 1 mile.',
  )}
          ${renderLocalMarketChartBlock(
    'Achieved rent per square foot',
    renderSimpleLineChart(local.rentPsfTrend, { height: 220 }),
    'Change in per square foot achieved monthly rent over the last 12 months within 1 mile.',
  )}
          ${renderLocalMarketChartBlock(
    'Depth of market by price band',
    renderSimpleBarChart(priceBandPct, { height: 220, showValues: true, valueSuffix: '%' }),
    'Proportion of new rentals started by price band over the past 12 months within 1 mile.',
  )}
        </div>
      </section>

      <section class="overview-section overview-section--dataloft">
        ${renderLocalMarketSectionHeader('Performance')}

        <div class="local-market-charts">
          ${renderLocalMarketChartBlock(
    'Average gross yield (rolling 12 months)',
    renderSimpleLineChart(local.grossYieldRolling12m, { height: 220 }),
    'Average gross yields on a rolling 12-month basis, calculated from average sales and rental prices on a price per square foot basis.',
  )}
          ${renderLocalMarketChartBlock(
    'Average gross yield by property type',
    renderSimpleBarChart(
      local.grossYieldByType.map((item) => ({ label: item.label, value: item.value })),
      { height: 220, showValues: true, valueSuffix: '%' },
    ),
    'Average gross yields over the last 12 months by property type, calculated from average sales and rental prices on a price per square foot basis.',
  )}
        </div>
      </section>
    </div>
  `;
}

function renderPropertyTabContent(property, tabId, index) {
  switch (tabId) {
    case 'financials':
      return renderPropertyFinancialsTab(property, index);
    case 'risk':
      return renderPropertyRiskTab(property, index);
    case 'esg':
      return renderPropertyEsgTab(property, index);
    case 'local-market':
      return renderPropertyLocalMarketTab(property);
    case 'market-trends':
    case 'market-demand':
      return renderPropertyLocalMarketTab(property);
    default:
      return renderPropertyOverviewTab(property, index);
  }
}

function renderPropertyDetail(index, tabId) {
  const portfolio = state.portfolio;
  if (!portfolio) {
    navigate('/dashboard');
    return;
  }

  const propertyForRoute = portfolio.properties[index];
  if (!propertyForRoute) {
    navigate('/portfolio/summary');
    return;
  }

  if (tabId === 'overview' && !hasCompletedMortgageDetails(propertyForRoute)) {
    navigate(`/portfolio/property/${index}/financials`);
    return;
  }

  if (tabId === 'market-trends' || tabId === 'market-demand') {
    navigate(`/portfolio/property/${index}/local-market`);
    return;
  }

  const tab = getPropertyTab(tabId);

  if (tab.id === 'financials' && ensurePropertyFinancialBasics(portfolio.properties[index])) {
    saveState(state);
  }

  if (tab.id === 'esg' && ensurePropertyEpcBasics(portfolio.properties[index], index)) {
    saveState(state);
  }

  const property = getPortfolioProperty(index);
  if (!property) {
    navigate('/portfolio/summary');
    return;
  }

  const tabLabel = tab.label;

  document.title = `${property.titleRef} — ${tabLabel} — Investor Landlord Portal`;

  const isCardLayout = CARD_LAYOUT_TABS.has(tab.id);

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell page-shell--property">
      <div class="property-page">
        ${renderPropertyToolbar(index, tab.id)}
        <div class="property-tab-content ${isCardLayout ? 'property-tab-content--cards' : ''}">
          ${renderPropertyHero(property)}
          ${renderPropertyTabContent(property, tab.id, index)}
        </div>
      </div>
    </main>
    ${renderRemovePropertyModal(property)}
    ${renderFooter()}
  `;

  bindCommonActions();
  if (tab.id === 'financials') {
    bindFinancialsEdit(index);
    bindTenancyEdit(index);
    bindFinancialsDemoPrefill(index);
  }
  if (tab.id === 'overview') {
    bindRemoveProperty(index);
    bindOverviewEdit(index);
  }
  if (tab.id === 'risk') {
    bindInsuranceCallbackRequest();
  }
  bindPropertyTabs();
}

function bindPropertyTabs() {
  document.querySelectorAll('.property-tabs__tab').forEach((tabLink) => {
    tabLink.addEventListener('click', () => {
      requestAnimationFrame(() => render());
    });
  });
}

function formatCurrencyChange(value) {
  if (value == null || Number.isNaN(value)) return '—';
  const formatted = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
}

function renderPortfolioMetric(label, value, options = {}) {
  const toneClass = options.tone ? ` portfolio-metric__value--${options.tone}` : '';
  const sub = options.sub ? `<div class="portfolio-metric__sub">${options.sub}</div>` : '';
  const extra = options.extra ? `<div class="portfolio-metric__extra">${options.extra}</div>` : '';
  return `
    <div class="portfolio-metric${options.highlight ? ' portfolio-metric--highlight' : ''}">
      <div class="portfolio-metric__value${toneClass}">${value}</div>
      <div class="portfolio-metric__label">${escapeHtml(label)}</div>
      ${sub}
      ${extra}
    </div>
  `;
}

function hasInvestmentOpportunity(metrics, portfolio) {
  if (!metrics.hasEquityData || metrics.totalEquity <= OPPORTUNITY_EQUITY_THRESHOLD) return false;
  return getPortfolioMarketOpportunities(portfolio.properties).count > 0;
}

function renderInvestmentOpportunityBadge() {
  return `<a class="portfolio-opportunity-badge" href="#/portfolio/marketplace">OPPORTUNITY</a>`;
}

function renderLineOpportunityBadge(count, index) {
  if (!count) return '';
  const label = count === 1 ? '1 Opportunity' : `${count} Opportunities`;
  return `<a class="opportunity-badge" href="#/portfolio/property/${index}/financials">${escapeHtml(label)}</a>`;
}

function renderLineAlertBadge(property, index) {
  const count = countPropertyAlerts(property, index);
  if (!count) return '';
  const label = count === 1 ? '1 Alert' : `${count} Alerts`;
  const href = getPropertyAlertRoute(property, index);
  return `<a class="alert-badge" href="${href}">${escapeHtml(label)}</a>`;
}

function renderLineAlerts(property, index) {
  const opportunityBadge = renderLineOpportunityBadge(countPropertyOptimisationOpportunities(property), index);
  const alertBadge = renderLineAlertBadge(property, index);
  if (!opportunityBadge && !alertBadge) return '—';
  return `<span class="line-badges">${opportunityBadge}${alertBadge}</span>`;
}

function renderRiskInsuranceAlertBanner() {
  return `
    <section class="alerts-section alerts-section--risk" aria-label="Insurance review required">
      <div class="alerts-section__header">
        <div class="section-title-row">
          <h2 class="alerts-section__title">Insurance review required</h2>
          ${renderInfoTooltip('Recent increases in environmental risk may affect your landlord insurance cover or premiums. An expert can review whether your current policy remains appropriate.')}
        </div>
      </div>
      <div class="alerts-section__body">
        <p class="alerts-section__message">
          Environmental risks for this property have increased since your last assessment. We recommend reviewing your landlord insurance to ensure you remain adequately covered.
        </p>
        <button type="button" class="btn alerts-section__cta" data-action="request-insurance-callback">Request callback</button>
        <p class="alerts-section__confirmation" id="insurance-callback-confirmation" hidden>
          Thank you — an insurance expert will call you within 2 working days.
        </p>
      </div>
    </section>
  `;
}

function bindInsuranceCallbackRequest() {
  const button = document.querySelector('[data-action="request-insurance-callback"]');
  const confirmation = document.getElementById('insurance-callback-confirmation');
  if (!button || !confirmation) return;

  button.addEventListener('click', () => {
    button.hidden = true;
    confirmation.hidden = false;
  });
}

function metricValuesChanged(before, after) {
  if (before == null && after == null) return false;
  if (before == null || after == null) return before !== after;
  if (typeof before === 'number' && typeof after === 'number') {
    return Math.abs(before - after) > 0.01;
  }
  return before !== after;
}

function renderPortfolioComparisonRow(label, beforeRaw, afterRaw, formatDisplay) {
  const beforeDisplay = formatDisplay(beforeRaw);
  const afterDisplay = formatDisplay(afterRaw);
  const changed = metricValuesChanged(beforeRaw, afterRaw);

  return `
    <tr>
      <th scope="row">${escapeHtml(label)}</th>
      <td>${beforeDisplay}</td>
      <td>${changed ? `<strong>${afterDisplay}</strong>` : afterDisplay}</td>
    </tr>
  `;
}

function renderPortfolioImpactRows(beforeMetrics, afterMetrics) {
  const equityBefore = beforeMetrics.hasEquityData ? beforeMetrics.totalEquity : null;
  const equityAfter = afterMetrics.hasEquityData ? afterMetrics.totalEquity : null;
  const ltvBefore = beforeMetrics.hasEquityData ? beforeMetrics.overallLtv : null;
  const ltvAfter = afterMetrics.hasEquityData ? afterMetrics.overallLtv : null;

  return [
    renderPortfolioComparisonRow(
      'Total portfolio value',
      beforeMetrics.totalPortfolioValue,
      afterMetrics.totalPortfolioValue,
      (value) => formatCurrency(value),
    ),
    renderPortfolioComparisonRow(
      'Total mortgage balance',
      beforeMetrics.totalMortgageBalance,
      afterMetrics.totalMortgageBalance,
      (value) => formatCurrency(value),
    ),
    renderPortfolioComparisonRow(
      'Total equity',
      equityBefore,
      equityAfter,
      (value) => (value == null ? renderMissingIndicator() : formatCurrency(value)),
    ),
    renderPortfolioComparisonRow(
      'Portfolio LTV',
      ltvBefore,
      ltvAfter,
      (value) => (value == null ? renderMissingIndicator() : formatPercent(value)),
    ),
    renderPortfolioComparisonRow(
      'Total market rent',
      beforeMetrics.totalMarketRent,
      afterMetrics.totalMarketRent,
      (value) => formatCurrency(value),
    ),
    renderPortfolioComparisonRow(
      'Total achieved rent',
      beforeMetrics.totalRentAgreed,
      afterMetrics.totalRentAgreed,
      (value) => renderRentAgreedDisplay(value, true),
    ),
    renderPortfolioComparisonRow(
      'Gross yield',
      beforeMetrics.grossYield,
      afterMetrics.grossYield,
      (value) => formatPercent(value),
    ),
    renderPortfolioComparisonRow(
      'Interest coverage ratio',
      beforeMetrics.icr,
      afterMetrics.icr,
      (value) => formatPercent(value),
    ),
    renderPortfolioComparisonRow(
      'Properties held',
      beforeMetrics.totalProperties,
      afterMetrics.totalProperties,
      (value) => String(value),
    ),
  ].join('');
}

function renderQuoteNextStepsButton() {
  return `
    <div class="quote-summary__actions">
      <button type="button" class="btn btn-primary" data-action="quote-next-steps">Next steps</button>
      <p class="quote-summary__confirmation" data-quote-confirmation hidden>Thank you — a specialist will be in touch within 2 working days.</p>
    </div>
  `;
}

function renderMortgageQuote(listingId) {
  const portfolio = state.portfolio;
  if (!portfolio) {
    navigate('/dashboard');
    return;
  }

  const listing = getMarketplaceListingById(listingId);
  if (!listing) {
    navigate('/portfolio/marketplace');
    return;
  }

  const beforeMetrics = computePortfolioMetrics(portfolio.properties);
  if (!beforeMetrics.hasEquityData || beforeMetrics.totalEquity <= OPPORTUNITY_EQUITY_THRESHOLD) {
    navigate('/portfolio/summary');
    return;
  }

  const quote = buildMortgageQuote(listing);
  const afterMetrics = computePortfolioMetricsAfterPurchase(portfolio.properties, listing, quote);
  const address = formatAddress(listing);

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content">
        <div class="breadcrumb">
          <a href="#/dashboard">Dashboard</a> /
          <a href="#/portfolio/summary">Portfolio summary</a> /
          <a href="#/portfolio/marketplace">Marketplace</a> /
          Mortgage quote
        </div>
        <h1 class="page-title">Indicative mortgage quote</h1>
        <p class="page-intro">${escapeHtml(address)} · ${listing.bedrooms} bed ${escapeHtml(listing.propertyType.toLowerCase())}</p>

        <div class="quote-layout">
          <section class="card quote-summary">
            <h2 class="section-title">Indicative terms</h2>
            <dl class="quote-summary__grid">
              <div class="quote-summary__item">
                <dt>Asking price</dt>
                <dd>${formatCurrency(quote.askingPrice)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Indicative deposit (${quote.depositPct}%)</dt>
                <dd>${formatCurrency(quote.deposit)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Indicative loan amount</dt>
                <dd>${formatCurrency(quote.loanAmount)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Indicative interest rate</dt>
                <dd>${formatInterestRate(quote.interestRate)}</dd>
              </div>
              <div class="quote-summary__item quote-summary__item--highlight">
                <dt>Estimated monthly payment</dt>
                <dd>${formatCurrency(quote.monthlyPayment)}<span class="cell-suffix">/mo</span></dd>
              </div>
              <div class="quote-summary__item quote-summary__item--highlight">
                <dt>Estimated gross yield</dt>
                <dd>${formatPercent(quote.grossYield)}</dd>
              </div>
            </dl>
            <p class="quote-summary__note">Illustrative buy-to-let quote based on a ${quote.depositPct}% deposit and interest-only servicing at ${formatInterestRate(quote.interestRate)}. Subject to affordability, valuation and lending criteria.</p>
            ${renderQuoteNextStepsButton()}
          </section>

          <section class="card quote-comparison">
            <h2 class="section-title">Portfolio impact</h2>
            <p class="quote-comparison__intro">Estimated effect on your portfolio summary if this acquisition completes.</p>
            <div class="data-table-wrap">
              <table class="data-table quote-comparison__table">
                <thead>
                  <tr>
                    <th scope="col">Metric</th>
                    <th scope="col">Current portfolio</th>
                    <th scope="col">After purchase</th>
                  </tr>
                </thead>
                <tbody>
                  ${renderPortfolioImpactRows(beforeMetrics, afterMetrics)}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div class="btn-group">
          <a class="btn btn-secondary" href="#/portfolio/marketplace">Back to marketplace</a>
          <a class="btn btn-primary" href="#/portfolio/summary">Return to portfolio</a>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;

  bindCommonActions();
}

function renderFinancialMortgageRenewalOpportunity(property, index) {
  if (!hasMortgageRenewalOpportunity(property)) return '';

  const quote = buildMortgageRenewalQuote(property);
  const exclusiveRateLabel = formatInterestRate(quote.exclusiveRate);

  return `
    <section class="opportunities-section financial-opportunity-panel" aria-label="Mortgage renewal opportunity">
      <div class="opportunities-section__header">
        <div class="section-title-row">
          <h2 class="opportunities-section__title">Mortgage Renewal Opportunity</h2>
          ${renderInfoTooltip('Your buy-to-let mortgage is approaching its product end date. Existing landlord customers may receive preferential remortgage terms ahead of renewal.')}
        </div>
      </div>
      <div class="opportunities-section__body">
        <p class="opportunities-section__message">
          Your buy-to-let mortgage is approaching its renewal date. Review an exclusive remortgage rate available to existing landlord customers.
        </p>
        <p class="opportunities-section__detail">
          Your current deal ends in <strong>${escapeHtml(quote.expiryDisplay || '—')}</strong>. Review indicative terms from <strong>${exclusiveRateLabel}</strong> on your remaining balance of ${formatCurrency(quote.loanAmount)}.
        </p>
        <a class="btn opportunities-section__cta" href="#/portfolio/property/${index}/renewal-quote">View</a>
      </div>
    </section>
  `;
}

function renderFinancialRefinanceOpportunity(property, index) {
  if (!hasRefinanceOpportunity(property)) return '';

  const quote = buildRefinanceQuote(property);
  const bestRateLabel = formatInterestRate(quote.bestRate);

  return `
    <section class="opportunities-section financial-opportunity-panel" aria-label="Refinance opportunity">
      <div class="opportunities-section__header">
        <div class="section-title-row">
          <h2 class="opportunities-section__title">Payment Saving Opportunity</h2>
          ${renderInfoTooltip('Your current mortgage rate is more than 0.5% above the indicative best buy-to-let deal. Refinancing may reduce monthly servicing costs and improve portfolio interest coverage.')}
        </div>
      </div>
      <div class="opportunities-section__body">
        <p class="opportunities-section__message">
          You may be paying <strong>${formatInterestRate(quote.currentRate)}</strong> — current best deals start from <strong>${bestRateLabel}</strong>.
        </p>
        <p class="opportunities-section__detail">
          Indicative saving of ${formatCurrency(quote.monthlySavings)} per month if you refinance at ${bestRateLabel} on your remaining balance of ${formatCurrency(quote.loanAmount)}.
        </p>
        <a class="btn opportunities-section__cta" href="#/portfolio/property/${index}/refinance-quote">View</a>
      </div>
    </section>
  `;
}

function renderFinancialRentReviewOpportunity(property, index) {
  if (!hasRentReviewOpportunity(property)) return '';

  const quote = buildRentReviewQuote(property);

  return `
    <section class="opportunities-section financial-opportunity-panel" aria-label="Rent review opportunity">
      <div class="opportunities-section__header">
        <div class="section-title-row">
          <h2 class="opportunities-section__title">Rent Opportunity</h2>
          ${renderInfoTooltip('Estimated market rent is more than £500 per month above your recorded achieved rent. A rent review may help align income with current market conditions.')}
        </div>
      </div>
      <div class="opportunities-section__body">
        <p class="opportunities-section__message">
          Achieved rent is <strong>${formatCurrency(quote.currentAchievedRent)}</strong> — estimated market rent is <strong>${formatCurrency(quote.marketRent)}</strong>.
        </p>
        <p class="opportunities-section__detail">
          Potential uplift of ${formatCurrency(quote.monthlyUplift)} per month (${formatCurrency(quote.annualUplift)} annually) if rent is brought in line with market levels.
        </p>
        <a class="btn opportunities-section__cta" href="#/portfolio/property/${index}/rent-review">View</a>
      </div>
    </section>
  `;
}

function renderEsgImprovementRequirement(property, index) {
  if (!hasEpcImprovementOpportunity(property, { propertyIndex: index })) return '';

  const quote = buildEpcImprovementQuote(property, { propertyIndex: index });

  return `
    <section class="alerts-section financial-alert-panel" aria-label="EPC improvement requirement">
      <div class="alerts-section__header">
        <div class="section-title-row">
          <h2 class="alerts-section__title">EPC Improvement Requirement</h2>
          ${renderInfoTooltip('Properties rated EPC D or below may not be lettable until improved to at least EPC C. Green home improvement finance may help fund energy efficiency works.')}
        </div>
      </div>
      <div class="alerts-section__body">
        <p class="alerts-section__message">
          Current rating is <strong>EPC ${quote.currentRating}</strong> — properties must reach at least EPC C to comply with lettings regulations.
        </p>
        <p class="alerts-section__detail">
          Estimated cost of ${formatCurrency(quote.improvementCost)} to reach EPC ${quote.targetRating}. Review indicative green finance options for energy efficiency improvements.
        </p>
        <a class="btn alerts-section__cta" href="#/portfolio/property/${index}/epc-improvement">View</a>
      </div>
    </section>
  `;
}

function renderMarketplaceInvestmentBanner(metrics, portfolio) {
  if (!metrics.hasEquityData || metrics.totalEquity <= OPPORTUNITY_EQUITY_THRESHOLD) return '';

  const opportunities = getPortfolioMarketOpportunities(portfolio.properties);
  if (opportunities.count === 0) return '';

  const areaLabel = opportunities.cities.length === 1
    ? opportunities.cities[0]
    : 'your portfolio areas';
  const maxPriceLabel = formatCurrency(MARKETPLACE_MAX_ASKING_PRICE);

  return `
    <section class="opportunities-section opportunities-section--marketplace" aria-label="Investment opportunity">
      <div class="opportunities-section__header">
        <div class="section-title-row">
          <h2 class="opportunities-section__title">Investment Opportunity</h2>
          ${renderInfoTooltip('Investment opportunities identified in markets where you already hold assets. Available equity may be used as a deposit to support leveraged buy-to-let acquisitions.')}
        </div>
      </div>
      <div class="opportunities-section__body">
        <p class="opportunities-section__message">
          <strong>${opportunities.count}</strong> ${opportunities.count === 1 ? 'property is' : 'properties are'} available for sale in ${escapeHtml(areaLabel)} with estimated gross yields above 5%.
        </p>
        <p class="opportunities-section__detail">
          Based on your available equity, you may wish to review buy-to-let listings priced at ${maxPriceLabel} or below.
        </p>
      </div>
    </section>
  `;
}

function renderMarketplaceOpportunitySection(metrics, portfolio) {
  if (!metrics.hasEquityData || metrics.totalEquity <= OPPORTUNITY_EQUITY_THRESHOLD) return '';

  const opportunities = getPortfolioMarketOpportunities(portfolio.properties);
  if (opportunities.count === 0) return '';

  const areaLabel = opportunities.cities.length === 1
    ? opportunities.cities[0]
    : 'your portfolio areas';
  const maxPriceLabel = formatCurrency(MARKETPLACE_MAX_ASKING_PRICE);

  return `
    <section class="opportunities-section" aria-label="Investment opportunities">
      <div class="opportunities-section__header">
        <div class="section-title-row">
          <h2 class="opportunities-section__title">Investment Opportunity</h2>
          ${renderInfoTooltip('Investment opportunities identified in markets where you already hold assets. Available equity may be used as a deposit to support leveraged buy-to-let acquisitions.')}
        </div>
      </div>
      <div class="opportunities-section__body">
        <p class="opportunities-section__message">
          <strong>${opportunities.count}</strong> ${opportunities.count === 1 ? 'property is' : 'properties are'} available for sale in ${escapeHtml(areaLabel)} with estimated gross yields above 5%.
        </p>
        <p class="opportunities-section__detail">
          Based on your available equity, you may wish to review buy-to-let listings priced at ${maxPriceLabel} or below.
        </p>
        <a class="btn opportunities-section__cta" href="#/portfolio/marketplace">View</a>
      </div>
    </section>
  `;
}

function renderMortgageRenewalOpportunitySection(portfolio) {
  const renewalOpportunities = getPortfolioMortgageRenewalOpportunities(portfolio.properties);
  if (renewalOpportunities.length === 0) return '';

  const first = renewalOpportunities[0];
  const firstAddress = formatAddress(first.property);

  return `
    <section class="opportunities-section" aria-label="Mortgage renewal opportunities">
      <div class="opportunities-section__header">
        <div class="section-title-row">
          <h2 class="opportunities-section__title">Mortgage Renewal Opportunity</h2>
          ${renderInfoTooltip('Properties with a buy-to-let mortgage approaching its product end date may qualify for an exclusive remortgage offer.')}
        </div>
      </div>
      <div class="opportunities-section__body">
        <p class="opportunities-section__message">
          <strong>${escapeHtml(firstAddress)}</strong> has a buy-to-let mortgage approaching its renewal date. Review an exclusive remortgage rate available to existing landlord customers.
        </p>
        <p class="opportunities-section__detail">
          Current deal ends in <strong>${escapeHtml(first.quote.expiryDisplay || '—')}</strong> — review renewal options on the financials tab.
        </p>
        <a class="btn opportunities-section__cta" href="#/portfolio/property/${first.index}/financials">View</a>
      </div>
    </section>
  `;
}

function renderRefinanceOpportunitySection(portfolio) {
  const refinanceOpportunities = getPortfolioRefinanceOpportunities(portfolio.properties);
  if (refinanceOpportunities.length === 0) return '';

  const bestRateLabel = formatInterestRate(getCurrentBestMortgageRate());
  const first = refinanceOpportunities[0];
  const firstAddress = formatAddress(first.property);

  let message;
  if (refinanceOpportunities.length === 1) {
    message = `<strong>${escapeHtml(firstAddress)}</strong> may be paying above the current best mortgage rate of ${bestRateLabel}.`;
  } else {
    message = `<strong>${refinanceOpportunities.length}</strong> properties may be paying more than ${REFINANCE_RATE_THRESHOLD}% above the current best mortgage rate of ${bestRateLabel}.`;
  }

  const detail = refinanceOpportunities.length === 1
    ? `Your recorded rate is ${formatInterestRate(first.quote.currentRate)} — review refinancing options on the financials tab.`
    : `Start with ${escapeHtml(firstAddress)} (${formatInterestRate(first.quote.currentRate)}), then review other qualifying properties.`;

  return `
    <section class="opportunities-section" aria-label="Refinance opportunities">
      <div class="opportunities-section__header">
        <div class="section-title-row">
          <h2 class="opportunities-section__title">Payment Saving Opportunity</h2>
          ${renderInfoTooltip('Properties where the recorded mortgage rate is more than 0.5% above the indicative best buy-to-let deal may benefit from refinancing.')}
        </div>
      </div>
      <div class="opportunities-section__body">
        <p class="opportunities-section__message">${message}</p>
        <p class="opportunities-section__detail">${detail}</p>
        <a class="btn opportunities-section__cta" href="#/portfolio/property/${first.index}/financials">View</a>
      </div>
    </section>
  `;
}

function renderRentReviewOpportunitySection(portfolio) {
  const rentReviewOpportunities = getPortfolioRentReviewOpportunities(portfolio.properties);
  if (rentReviewOpportunities.length === 0) return '';

  const first = rentReviewOpportunities[0];
  const firstAddress = formatAddress(first.property);

  return `
    <section class="opportunities-section" aria-label="Rent review opportunities">
      <div class="opportunities-section__header">
        <div class="section-title-row">
          <h2 class="opportunities-section__title">Rent Opportunity</h2>
          ${renderInfoTooltip('Properties where estimated market rent exceeds achieved rent by more than £500 per month may benefit from a rent review.')}
        </div>
      </div>
      <div class="opportunities-section__body">
        <p class="opportunities-section__message">
          <strong>${escapeHtml(firstAddress)}</strong> may be under-rented by more than ${formatCurrency(RENT_REVIEW_GAP_THRESHOLD)} per month.
        </p>
        <p class="opportunities-section__detail">
          Achieved rent is ${formatCurrency(first.quote.currentAchievedRent)} against an estimated market rent of ${formatCurrency(first.quote.marketRent)} — review options on the financials tab.
        </p>
        <a class="btn opportunities-section__cta" href="#/portfolio/property/${first.index}/financials">View</a>
      </div>
    </section>
  `;
}

function renderEpcImprovementRequirementSection(portfolio) {
  const epcRequirements = getPortfolioEpcImprovementOpportunities(portfolio.properties);
  if (epcRequirements.length === 0) return '';

  const first = epcRequirements[0];
  const firstAddress = formatAddress(first.property);

  return `
    <section class="alerts-section" aria-label="EPC improvement requirements">
      <div class="alerts-section__header">
        <div class="section-title-row">
          <h2 class="alerts-section__title">EPC Improvement Requirement</h2>
          ${renderInfoTooltip('Properties rated EPC D, E, F or G may not be lettable until improved to EPC A, B or C. Green home improvement finance may help fund energy efficiency works.')}
        </div>
      </div>
      <div class="alerts-section__body">
        <p class="alerts-section__message">
          <strong>${escapeHtml(firstAddress)}</strong> is rated EPC ${first.quote.currentRating} and must be improved to EPC ${first.quote.targetRating} or above.
        </p>
        <p class="alerts-section__detail">
          Estimated works cost ${formatCurrency(first.quote.improvementCost)} — review green finance options on the ESG &amp; Renovation tab.
        </p>
        <a class="btn alerts-section__cta" href="#/portfolio/property/${first.index}/esg">View</a>
      </div>
    </section>
  `;
}

function renderPortfolioOpportunitySections(metrics, portfolio) {
  return [
    renderRefinanceOpportunitySection(portfolio),
    renderMortgageRenewalOpportunitySection(portfolio),
    renderRentReviewOpportunitySection(portfolio),
    renderEpcImprovementRequirementSection(portfolio),
    renderMarketplaceOpportunitySection(metrics, portfolio),
  ].filter(Boolean).join('');
}

function renderPropertyRefinanceQuote(index) {
  const portfolio = state.portfolio;
  if (!portfolio) {
    navigate('/dashboard');
    return;
  }

  const property = getPortfolioProperty(index);
  if (!property) {
    navigate('/portfolio/summary');
    return;
  }

  if (!hasRefinanceOpportunity(property)) {
    navigate(`/portfolio/property/${index}/financials`);
    return;
  }

  const quote = buildRefinanceQuote(property);
  const beforeMetrics = computePortfolioMetrics(portfolio.properties);
  const afterMetrics = computePortfolioMetricsAfterRefinance(portfolio.properties, index, quote);
  const address = formatAddress(property);

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content">
        <div class="breadcrumb">
          <a href="#/dashboard">Dashboard</a> /
          <a href="#/portfolio/summary">Portfolio summary</a> /
          <a href="#/portfolio/property/${index}/financials">Financials</a> /
          Refinance quote
        </div>
        <h1 class="page-title">Indicative refinance quote</h1>
        <p class="page-intro">${escapeHtml(address)}</p>

        <div class="quote-layout">
          <section class="card quote-summary">
            <h2 class="section-title">Indicative terms</h2>
            <dl class="quote-summary__grid">
              <div class="quote-summary__item">
                <dt>Remaining mortgage balance</dt>
                <dd>${formatCurrency(quote.loanAmount)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Current interest rate</dt>
                <dd>${formatInterestRate(quote.currentRate)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Indicative new rate</dt>
                <dd>${formatInterestRate(quote.bestRate)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Rate reduction</dt>
                <dd>${formatInterestRate(quote.rateDifference)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Current monthly payment</dt>
                <dd>${formatCurrency(quote.currentMonthlyPayment)}<span class="cell-suffix">/mo</span></dd>
              </div>
              <div class="quote-summary__item quote-summary__item--highlight">
                <dt>Indicative new monthly payment</dt>
                <dd>${formatCurrency(quote.newMonthlyPayment)}<span class="cell-suffix">/mo</span></dd>
              </div>
              <div class="quote-summary__item quote-summary__item--highlight">
                <dt>Estimated monthly saving</dt>
                <dd>${formatCurrency(quote.monthlySavings)}<span class="cell-suffix">/mo</span></dd>
              </div>
            </dl>
            <p class="quote-summary__note">Illustrative refinance quote based on interest-only servicing at ${formatInterestRate(quote.bestRate)} on your existing balance. Subject to affordability, valuation, early repayment charges and lending criteria.</p>
            ${renderQuoteNextStepsButton()}
          </section>

          <section class="card quote-comparison">
            <h2 class="section-title">Portfolio impact</h2>
            <p class="quote-comparison__intro">Estimated effect on your portfolio summary if this property is refinanced at the indicative rate.</p>
            <div class="data-table-wrap">
              <table class="data-table quote-comparison__table">
                <thead>
                  <tr>
                    <th scope="col">Metric</th>
                    <th scope="col">Current portfolio</th>
                    <th scope="col">After refinance</th>
                  </tr>
                </thead>
                <tbody>
                  ${renderPortfolioImpactRows(beforeMetrics, afterMetrics)}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div class="btn-group">
          <a class="btn btn-secondary" href="#/portfolio/property/${index}/financials">Back to financials</a>
          <a class="btn btn-primary" href="#/portfolio/summary">Return to portfolio</a>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;

  bindCommonActions();
}

function renderPropertyMortgageRenewalQuote(index) {
  const portfolio = state.portfolio;
  if (!portfolio) {
    navigate('/dashboard');
    return;
  }

  const property = getPortfolioProperty(index);
  if (!property) {
    navigate('/portfolio/summary');
    return;
  }

  if (!hasMortgageRenewalOpportunity(property)) {
    navigate(`/portfolio/property/${index}/financials`);
    return;
  }

  const quote = buildMortgageRenewalQuote(property);
  const beforeMetrics = computePortfolioMetrics(portfolio.properties);
  const afterMetrics = computePortfolioMetricsAfterMortgageRenewal(portfolio.properties, index, quote);
  const address = formatAddress(property);
  const exclusiveRateLabel = formatInterestRate(quote.exclusiveRate);

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content">
        <div class="breadcrumb">
          <a href="#/dashboard">Dashboard</a> /
          <a href="#/portfolio/summary">Portfolio summary</a> /
          <a href="#/portfolio/property/${index}/financials">Financials</a> /
          Renewal quote
        </div>
        <h1 class="page-title">Indicative renewal quote</h1>
        <p class="page-intro">${escapeHtml(address)}</p>

        <div class="quote-layout">
          <section class="card quote-summary">
            <h2 class="section-title">Indicative terms</h2>
            <dl class="quote-summary__grid">
              <div class="quote-summary__item">
                <dt>Remaining mortgage balance</dt>
                <dd>${formatCurrency(quote.loanAmount)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Current product end date</dt>
                <dd>${escapeHtml(quote.expiryDisplay || '—')}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Current interest rate</dt>
                <dd>${formatInterestRate(quote.currentRate)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Exclusive renewal rate</dt>
                <dd>${exclusiveRateLabel}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Rate reduction</dt>
                <dd>${formatInterestRate(quote.rateDifference)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Current monthly payment</dt>
                <dd>${formatCurrency(quote.currentMonthlyPayment)}<span class="cell-suffix">/mo</span></dd>
              </div>
              <div class="quote-summary__item quote-summary__item--highlight">
                <dt>Indicative new monthly payment</dt>
                <dd>${formatCurrency(quote.newMonthlyPayment)}<span class="cell-suffix">/mo</span></dd>
              </div>
              <div class="quote-summary__item quote-summary__item--highlight">
                <dt>Estimated monthly saving</dt>
                <dd>${formatCurrency(quote.monthlySavings)}<span class="cell-suffix">/mo</span></dd>
              </div>
            </dl>
            <p class="quote-summary__note">Illustrative renewal remortgage quote for existing landlord customers, based on interest-only servicing at ${exclusiveRateLabel} on your existing balance. Subject to affordability, valuation, product availability and lending criteria.</p>
            ${renderQuoteNextStepsButton()}
          </section>

          <section class="card quote-comparison">
            <h2 class="section-title">Portfolio impact</h2>
            <p class="quote-comparison__intro">Estimated effect on your portfolio summary if this property renews onto the exclusive remortgage rate.</p>
            <div class="data-table-wrap">
              <table class="data-table quote-comparison__table">
                <thead>
                  <tr>
                    <th scope="col">Metric</th>
                    <th scope="col">Current portfolio</th>
                    <th scope="col">After renewal</th>
                  </tr>
                </thead>
                <tbody>
                  ${renderPortfolioImpactRows(beforeMetrics, afterMetrics)}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div class="btn-group">
          <a class="btn btn-secondary" href="#/portfolio/property/${index}/financials">Back to financials</a>
          <a class="btn btn-primary" href="#/portfolio/summary">Return to portfolio</a>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;

  bindCommonActions();
}

function renderPropertyRentReview(index) {
  const portfolio = state.portfolio;
  if (!portfolio) {
    navigate('/dashboard');
    return;
  }

  const property = getPortfolioProperty(index);
  if (!property) {
    navigate('/portfolio/summary');
    return;
  }

  if (!hasRentReviewOpportunity(property)) {
    navigate(`/portfolio/property/${index}/financials`);
    return;
  }

  const quote = buildRentReviewQuote(property);
  const beforeMetrics = computePortfolioMetrics(portfolio.properties);
  const afterMetrics = computePortfolioMetricsAfterRentReview(portfolio.properties, index, quote);
  const address = formatAddress(property);

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content">
        <div class="breadcrumb">
          <a href="#/dashboard">Dashboard</a> /
          <a href="#/portfolio/summary">Portfolio summary</a> /
          <a href="#/portfolio/property/${index}/financials">Financials</a> /
          Rent review
        </div>
        <h1 class="page-title">Rent review</h1>
        <p class="page-intro">${escapeHtml(address)}</p>

        <div class="quote-layout">
          <section class="card quote-summary">
            <h2 class="section-title">Indicative uplift</h2>
            <dl class="quote-summary__grid">
              <div class="quote-summary__item">
                <dt>Current achieved rent</dt>
                <dd>${formatCurrency(quote.currentAchievedRent)}<span class="cell-suffix">/mo</span></dd>
              </div>
              <div class="quote-summary__item">
                <dt>Estimated market rent</dt>
                <dd>${formatCurrency(quote.marketRent)}<span class="cell-suffix">/mo</span></dd>
              </div>
              <div class="quote-summary__item">
                <dt>Proposed achieved rent</dt>
                <dd>${formatCurrency(quote.proposedAchievedRent)}<span class="cell-suffix">/mo</span></dd>
              </div>
              <div class="quote-summary__item quote-summary__item--highlight">
                <dt>Estimated monthly uplift</dt>
                <dd>${formatCurrency(quote.monthlyUplift)}<span class="cell-suffix">/mo</span></dd>
              </div>
              <div class="quote-summary__item quote-summary__item--highlight">
                <dt>Estimated annual uplift</dt>
                <dd>${formatCurrency(quote.annualUplift)}</dd>
              </div>
            </dl>
            <p class="quote-summary__note">Illustrative rent review based on estimated market rent. Actual achievable rent depends on tenancy terms, notice periods and local market conditions.</p>
          </section>

          <section class="card quote-comparison">
            <h2 class="section-title">Portfolio impact</h2>
            <p class="quote-comparison__intro">Estimated effect on your portfolio summary if achieved rent is brought in line with market rent for this property.</p>
            <div class="data-table-wrap">
              <table class="data-table quote-comparison__table">
                <thead>
                  <tr>
                    <th scope="col">Metric</th>
                    <th scope="col">Current portfolio</th>
                    <th scope="col">After rent review</th>
                  </tr>
                </thead>
                <tbody>
                  ${renderPortfolioImpactRows(beforeMetrics, afterMetrics)}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div class="btn-group">
          <a class="btn btn-secondary" href="#/portfolio/property/${index}/financials">Back to financials</a>
          ${renderDataloftReportButton()}
          <a class="btn btn-tertiary" href="#/portfolio/summary">Return to portfolio</a>
        </div>
      </div>
    </main>
    ${renderRentalEvidenceReportModal()}
    ${renderFooter()}
  `;

  bindCommonActions();
  bindRentalEvidenceReport();
}

function bindRentalEvidenceReport() {
  const modal = document.getElementById('rental-evidence-modal');
  if (!modal) return;

  const open = () => { modal.hidden = false; };
  const close = () => { modal.hidden = true; };

  document.querySelector('[data-action="open-rental-report"]')?.addEventListener('click', open);
  modal.querySelectorAll('[data-action="close-rental-report"]').forEach((el) => {
    el.addEventListener('click', close);
  });
}

function renderPropertyEpcImprovement(index) {
  const portfolio = state.portfolio;
  if (!portfolio) {
    navigate('/dashboard');
    return;
  }

  const property = getPortfolioProperty(index);
  if (!property) {
    navigate('/portfolio/summary');
    return;
  }

  if (!hasEpcImprovementOpportunity(property, { propertyIndex: index })) {
    navigate(`/portfolio/property/${index}/esg`);
    return;
  }

  const quote = buildEpcImprovementQuote(property, { propertyIndex: index });
  const beforeMetrics = computePortfolioMetrics(portfolio.properties);
  const afterMetrics = computePortfolioMetricsAfterEpcImprovement(portfolio.properties, index, quote);
  const address = formatAddress(property);

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content">
        <div class="breadcrumb">
          <a href="#/dashboard">Dashboard</a> /
          <a href="#/portfolio/summary">Portfolio summary</a> /
          <a href="#/portfolio/property/${index}/esg">ESG &amp; Renovation</a> /
          Green finance
        </div>
        <h1 class="page-title">Indicative green finance quote</h1>
        <p class="page-intro">${escapeHtml(address)}</p>

        <div class="quote-layout">
          <section class="card quote-summary">
            <h2 class="section-title">Indicative terms</h2>
            <dl class="quote-summary__grid">
              <div class="quote-summary__item">
                <dt>Current EPC rating</dt>
                <dd>EPC ${quote.currentRating}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Target EPC rating</dt>
                <dd>EPC ${quote.targetRating}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Estimated improvement cost</dt>
                <dd>${formatCurrency(quote.improvementCost)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Indicative additional borrowing</dt>
                <dd>${formatCurrency(quote.additionalLoan)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Indicative interest rate</dt>
                <dd>${formatInterestRate(quote.interestRate)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Current monthly payment</dt>
                <dd>${formatCurrency(quote.currentMonthlyPayment)}<span class="cell-suffix">/mo</span></dd>
              </div>
              <div class="quote-summary__item quote-summary__item--highlight">
                <dt>Additional monthly payment</dt>
                <dd>${formatCurrency(quote.additionalMonthlyPayment)}<span class="cell-suffix">/mo</span></dd>
              </div>
              <div class="quote-summary__item quote-summary__item--highlight">
                <dt>Indicative new monthly payment</dt>
                <dd>${formatCurrency(quote.newMonthlyPayment)}<span class="cell-suffix">/mo</span></dd>
              </div>
            </dl>
            <p class="quote-summary__note">Illustrative green home improvement finance to fund energy efficiency works and bring the property to EPC ${quote.targetRating}. Subject to affordability, valuation, works specification and lending criteria. Properties rated EPC D or below may not be lettable until improved to at least EPC C.</p>
            ${renderQuoteNextStepsButton()}
          </section>

          <section class="card quote-comparison">
            <h2 class="section-title">Portfolio impact</h2>
            <p class="quote-comparison__intro">Estimated effect on your portfolio summary if green finance is used to fund EPC improvement works for this property.</p>
            <div class="data-table-wrap">
              <table class="data-table quote-comparison__table">
                <thead>
                  <tr>
                    <th scope="col">Metric</th>
                    <th scope="col">Current portfolio</th>
                    <th scope="col">After improvement</th>
                  </tr>
                </thead>
                <tbody>
                  ${renderPortfolioImpactRows(beforeMetrics, afterMetrics)}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div class="btn-group">
          <a class="btn btn-secondary" href="#/portfolio/property/${index}/esg">Back to ESG &amp; Renovation</a>
          <a class="btn btn-tertiary" href="#/portfolio/summary">Return to portfolio</a>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;

  bindCommonActions();
}

function renderMarketplaceFilters() {
  const investorClubActive = marketplaceInvestorClubFilter === 'investor-club';
  return `
    <div class="marketplace-filters">
      <div class="marketplace-epc-filter" role="group" aria-label="Filter listings by EPC rating">
        <span class="marketplace-epc-filter__label">EPC filter</span>
        <div class="marketplace-epc-filter__options">
          <button
            type="button"
            class="marketplace-epc-filter__option${marketplaceEpcFilter === 'compliant' ? ' is-active' : ''}"
            data-epc-filter="compliant"
            aria-pressed="${marketplaceEpcFilter === 'compliant'}"
          >EPC A–C</button>
          <button
            type="button"
            class="marketplace-epc-filter__option${marketplaceEpcFilter === 'all' ? ' is-active' : ''}"
            data-epc-filter="all"
            aria-pressed="${marketplaceEpcFilter === 'all'}"
          >All EPC</button>
        </div>
      </div>
      <span class="marketplace-filters__divider" aria-hidden="true">|</span>
      <button
        type="button"
        class="marketplace-investor-club-filter${investorClubActive ? ' is-active' : ''}"
        data-investor-club-filter="investor-club"
        aria-pressed="${investorClubActive}"
      >
        <span class="marketplace-investor-club-filter__logo" aria-hidden="true">${renderPortalIcon({ height: 16 })}</span>
        <span class="marketplace-investor-club-filter__label">Investor Club</span>
      </button>
    </div>
  `;
}

function renderMarketplaceCard(listing) {
  const address = formatAddress(listing);
  const epcRating = String(listing.epcRating || '—').toUpperCase();
  const epcCompliant = isCompliantEpcRating(listing.epcRating);
  const investorClubBadge = listing.investorClub
    ? `<span class="marketplace-card__club-badge"><span class="marketplace-card__club-logo" aria-hidden="true">${renderPortalIcon({ height: 14 })}</span>Investor Club</span>`
    : '';

  return `
    <article class="marketplace-card${listing.investorClub ? ' marketplace-card--investor-club' : ''}">
      <div class="marketplace-card__media" aria-hidden="true">
        <span class="marketplace-card__media-label">${escapeHtml(listing.propertyType)}</span>
        ${investorClubBadge}
        <span class="marketplace-card__epc-badge marketplace-card__epc-badge--${epcRating.toLowerCase()}${epcCompliant ? ' marketplace-card__epc-badge--compliant' : ''}">EPC ${epcRating}</span>
      </div>
      <div class="marketplace-card__body">
        <p class="marketplace-card__meta">${listing.bedrooms} bed ${escapeHtml(listing.propertyType.toLowerCase())} · ${escapeHtml(listing.city)}</p>
        <h3 class="marketplace-card__address">${escapeHtml(address)}</h3>
        <dl class="marketplace-card__stats">
          <div class="marketplace-card__stat">
            <dt>Asking price</dt>
            <dd>${formatCurrency(listing.askingPrice)}</dd>
          </div>
          <div class="marketplace-card__stat">
            <dt>Estimated market rent</dt>
            <dd>${formatCurrency(listing.marketRent)}<span class="cell-suffix">/mo</span></dd>
          </div>
          <div class="marketplace-card__stat">
            <dt>EPC rating</dt>
            <dd><span class="marketplace-card__epc-value marketplace-card__epc-value--${epcRating.toLowerCase()}">${epcRating}</span></dd>
          </div>
          <div class="marketplace-card__stat marketplace-card__stat--highlight">
            <dt>Estimated gross yield</dt>
            <dd>${formatPercent(listing.grossYield)}</dd>
          </div>
        </dl>
        <a class="btn btn-primary marketplace-card__cta" href="#/portfolio/marketplace/quote/${escapeHtml(listing.id)}">Get mortgage quote</a>
      </div>
    </article>
  `;
}

function bindMarketplaceFilters() {
  document.querySelectorAll('[data-epc-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      marketplaceEpcFilter = button.dataset.epcFilter;
      renderMarketplace();
    });
  });

  document.querySelector('[data-investor-club-filter]')?.addEventListener('click', () => {
    marketplaceInvestorClubFilter = marketplaceInvestorClubFilter === 'investor-club' ? 'all' : 'investor-club';
    renderMarketplace();
  });
}

function getMarketplaceEmptyFilterMessage() {
  if (marketplaceInvestorClubFilter === 'investor-club' && marketplaceEpcFilter === 'compliant') {
    return 'No Investor Club listings match the EPC A–C filter. Try All EPC or turn off Investor Club to see more properties.';
  }
  if (marketplaceInvestorClubFilter === 'investor-club') {
    return 'No Investor Club listings are currently available in your portfolio areas.';
  }
  return 'No listings match the EPC A–C filter in your portfolio areas. Switch to All EPC to see every available property.';
}

function renderMarketplace() {
  const portfolio = state.portfolio;
  if (!portfolio) {
    navigate('/dashboard');
    return;
  }

  const metrics = computePortfolioMetrics(portfolio.properties);
  if (!metrics.hasEquityData || metrics.totalEquity <= OPPORTUNITY_EQUITY_THRESHOLD) {
    navigate('/portfolio/summary');
    return;
  }

  const opportunities = getPortfolioMarketOpportunities(portfolio.properties);
  const filteredListings = applyMarketplaceFilters(opportunities.listings, {
    epcFilter: marketplaceEpcFilter,
    investorClubFilter: marketplaceInvestorClubFilter,
  });
  const areaLabel = opportunities.cities.length === 1
    ? opportunities.cities[0]
    : 'your portfolio areas';
  const maxPriceLabel = formatCurrency(MARKETPLACE_MAX_ASKING_PRICE);

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content">
        <div class="breadcrumb">
          <a href="#/dashboard">Dashboard</a> /
          <a href="#/portfolio/summary">Portfolio summary</a> /
          Marketplace
        </div>
        <h1 class="page-title">Investment marketplace</h1>
        <p class="page-intro">Buy-to-let listings in ${escapeHtml(areaLabel)} priced at ${maxPriceLabel} or below with estimated gross yields of 5% or above.</p>

        ${opportunities.listings.length === 0 ? `
          <div class="card">
            <p class="empty-state-text">No qualifying listings are currently available in your portfolio areas.</p>
            <div class="btn-group">
              <a class="btn btn-secondary" href="#/portfolio/summary">Back to portfolio</a>
            </div>
          </div>
        ` : `
          ${renderMarketplaceInvestmentBanner(metrics, portfolio)}
          ${renderMarketplaceFilters()}
          ${filteredListings.length === 0 ? `
            <div class="card marketplace-empty-filter">
              <p class="empty-state-text">${getMarketplaceEmptyFilterMessage()}</p>
            </div>
          ` : `
            <p class="marketplace-results-count">${filteredListings.length} ${filteredListings.length === 1 ? 'listing' : 'listings'} shown</p>
            <div class="marketplace-grid">
              ${filteredListings.map((listing) => renderMarketplaceCard(listing)).join('')}
            </div>
          `}
          <div class="btn-group">
            <a class="btn btn-secondary" href="#/portfolio/summary">Back to portfolio</a>
          </div>
        `}
      </div>
    </main>
    ${renderFooter()}
  `;

  bindCommonActions();
  bindMarketplaceFilters();
}

function renderPortfolioEquityMetric(metrics, portfolio) {
  if (!metrics.hasEquityData) {
    return renderPortfolioMetric('Total equity', '—', {
      sub: 'Add mortgage details to a property to calculate equity',
    });
  }

  const equitySub = metrics.equityPropertyCount < metrics.totalProperties
    ? `Based on ${metrics.equityPropertyCount} of ${metrics.totalProperties} properties with mortgage details recorded`
    : null;
  const investmentBadge = portfolio && hasInvestmentOpportunity(metrics, portfolio)
    ? renderInvestmentOpportunityBadge()
    : '';

  return renderPortfolioMetric('Total equity', formatCurrency(metrics.totalEquity), {
    sub: equitySub,
    extra: investmentBadge,
  });
}

function renderPortfolioLtvMetric(metrics) {
  if (!metrics.hasEquityData) {
    return renderPortfolioMetric('Portfolio LTV', '—');
  }

  return renderPortfolioMetric('Portfolio LTV', formatPercent(metrics.overallLtv));
}

function parseMoneyValue(value) {
  return Number(String(value ?? '').replace(/[^0-9.]/g, '')) || 0;
}

function chartTipAttr(label, value) {
  return `data-chart-tip="${escapeHtml(`${label}: ${value}`)}"`;
}

function bindPortfolioChartTooltips(root = document) {
  let tip = document.getElementById('chart-tooltip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'chart-tooltip';
    tip.className = 'chart-tooltip';
    tip.hidden = true;
    document.body.appendChild(tip);
  }

  const showTip = (event) => {
    const target = event.currentTarget;
    const text = target.getAttribute('data-chart-tip');
    if (!text) return;
    tip.textContent = text;
    tip.hidden = false;
    const rect = target.getBoundingClientRect();
    const x = event.clientX ?? rect.left + rect.width / 2;
    const y = event.clientY ?? rect.top;
    tip.style.left = `${x + 14}px`;
    tip.style.top = `${y + 14}px`;
  };

  const moveTip = (event) => {
    if (tip.hidden) return;
    tip.style.left = `${event.clientX + 14}px`;
    tip.style.top = `${event.clientY + 14}px`;
  };

  const hideTip = () => {
    tip.hidden = true;
  };

  root.querySelectorAll('[data-chart-tip]').forEach((element) => {
    element.addEventListener('mouseenter', showTip);
    element.addEventListener('mousemove', moveTip);
    element.addEventListener('mouseleave', hideTip);
    element.addEventListener('focus', showTip);
    element.addEventListener('blur', hideTip);
  });
}

function polarToCartesian(cx, cy, radius, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function renderPortfolioDonutChart(slices) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 66;
  const strokeWidth = 30;
  const activeSlices = slices.filter((slice) => slice.value > 0);
  const total = activeSlices.reduce((sum, slice) => sum + slice.value, 0);

  if (!total) {
    return '<p class="portfolio-chart-empty">No data available</p>';
  }

  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const rings = [];
  const flyouts = [];

  activeSlices.forEach((slice) => {
    const portion = slice.value / total;
    const dash = portion * circumference;
    const gap = Math.max(circumference - dash, 0.001);
    const midAngle = ((offset + dash / 2) / circumference) * 360;
    const formattedValue = slice.format ? slice.format(slice.value) : slice.value;
    const flyoutLabel = slice.flyoutLabel || slice.name;
    const tip = chartTipAttr(flyoutLabel, formattedValue);

    rings.push(`
      <circle
        cx="${cx}"
        cy="${cy}"
        r="${radius}"
        fill="none"
        stroke="${slice.color}"
        stroke-width="${strokeWidth}"
        stroke-dasharray="${dash} ${gap}"
        stroke-dashoffset="${-offset}"
        transform="rotate(-90 ${cx} ${cy})"
        class="portfolio-donut__segment"
        ${tip}
        tabindex="0"
        role="img"
        aria-label="${escapeHtml(`${flyoutLabel}: ${formattedValue}`)}"
      />
    `);

    const outerR = radius + strokeWidth / 2;
    const edge = polarToCartesian(cx, cy, outerR, midAngle);
    const stubEnd = polarToCartesian(cx, cy, outerR + 12, midAngle);
    const isRight = stubEnd.x >= cx;
    const labelX = stubEnd.x + (isRight ? 28 : -28);

    flyouts.push(`
      <line x1="${edge.x}" y1="${edge.y}" x2="${stubEnd.x}" y2="${stubEnd.y}" class="portfolio-donut__flyout-line"/>
      <line x1="${stubEnd.x}" y1="${stubEnd.y}" x2="${labelX}" y2="${stubEnd.y}" class="portfolio-donut__flyout-line"/>
      <text
        x="${labelX + (isRight ? 6 : -6)}"
        y="${stubEnd.y}"
        text-anchor="${isRight ? 'start' : 'end'}"
        dominant-baseline="middle"
        class="portfolio-donut__flyout-label"
      >${escapeHtml(flyoutLabel)}</text>
    `);

    offset += dash;
  });

  return `
    <div class="portfolio-donut">
      <svg viewBox="0 0 ${size} ${size}" class="portfolio-donut__svg" aria-hidden="true">
        ${rings.join('')}
        ${flyouts.join('')}
      </svg>
    </div>
  `;
}

function renderPortfolioStackedBar({ title, segments, ariaLabel }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  if (!total) {
    return '<p class="portfolio-chart-empty">No data available</p>';
  }

  return `
    <div class="portfolio-stacked-bar">
      ${title ? `<h4 class="portfolio-chart__title">${escapeHtml(title)}</h4>` : ''}
      <div class="portfolio-stacked-bar__track" role="group" aria-label="${escapeHtml(ariaLabel || title || 'Stacked bar chart')}">
        ${segments.filter((segment) => segment.value > 0).map((segment) => {
    const formattedValue = segment.format ? segment.format(segment.value) : segment.value;
    return `
          <div
            class="portfolio-stacked-bar__segment"
            style="width:${((segment.value / total) * 100).toFixed(2)}%;background:${segment.color}"
            ${chartTipAttr(segment.name, formattedValue)}
            tabindex="0"
            role="img"
            aria-label="${escapeHtml(`${segment.name}: ${formattedValue}`)}"
          ></div>
        `;
  }).join('')}
      </div>
    </div>
  `;
}

function renderPortfolioLineChart(points, options = {}) {
  const width = options.width || 440;
  const height = 190;
  const padX = 28;
  const padY = 30;
  const values = points.map((point) => point.value);
  const min = Math.min(...values) * 0.97;
  const max = Math.max(...values) * 1.03;
  const range = max - min || 1;

  const coords = points.map((point, index) => {
    const x = padX + (index / Math.max(points.length - 1, 1)) * (width - padX * 2);
    const y = height - padY - ((point.value - min) / range) * (height - padY * 2);
    return { x, y, ...point };
  });

  const linePath = coords.map((coord, index) => `${index === 0 ? 'M' : 'L'} ${coord.x} ${coord.y}`).join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height - padY} L ${coords[0].x} ${height - padY} Z`;
  const title = options.title || '';

  return `
    <div class="portfolio-line-chart">
      ${title ? `<h4 class="portfolio-chart__title">${escapeHtml(title)}</h4>` : ''}
      <svg viewBox="0 0 ${width} ${height}" class="portfolio-line-chart__svg" preserveAspectRatio="xMidYMid meet">
        <path d="${areaPath}" class="portfolio-line-chart__area"/>
        <path d="${linePath}" class="portfolio-line-chart__line"/>
        ${coords.map((coord) => `
          <circle
            cx="${coord.x}"
            cy="${coord.y}"
            r="5"
            class="portfolio-line-chart__dot"
            ${chartTipAttr(coord.label, formatCurrency(coord.value))}
            tabindex="0"
            role="img"
            aria-label="${escapeHtml(`${coord.label}: ${formatCurrency(coord.value)}`)}"
          />
        `).join('')}
        ${coords.map((coord) => `
          <text x="${coord.x}" y="${height - 8}" text-anchor="middle" class="portfolio-line-chart__axis-label">${escapeHtml(coord.label)}</text>
        `).join('')}
      </svg>
    </div>
  `;
}

function renderPortfolioReport(metrics, portfolio) {
  const change = metrics.portfolioValueChange3m || {};
  const changeTone = change.pct == null ? null : change.pct >= 0 ? 'up' : 'down';
  const changeSub = change.pct != null
    ? `${change.pct >= 0 ? '+' : ''}${change.pct}% over 3 months`
    : null;

  const mortgageBalance = metrics.properties.reduce(
    (sum, property) => sum + parseMoneyValue(property.mortgageBalance),
    0,
  );
  const equityValue = Math.max(metrics.totalPortfolioValue - mortgageBalance, 0);
  const achievedRent = metrics.totalRentAgreed ?? metrics.properties.reduce(
    (sum, property) => sum + (getAchievedRentTotal(property) || 0),
    0,
  );
  const rentGap = Math.max(metrics.totalMarketRent - achievedRent, 0);
  const vacantCount = Math.max(metrics.totalProperties - metrics.occupiedCount, 0);

  return `
    <section class="portfolio-report" aria-label="Portfolio summary">
      <div class="portfolio-report__header">
        <div class="section-title-row">
          <h2 class="portfolio-report__title">Portfolio overview</h2>
          ${renderInfoTooltip('High-level portfolio summary continuously updated with the latest property data to provide an accurate view of how your investments are performing. Value data is monitored 24/7, so you\'re always the first to know about changes.')}
        </div>
        <div class="portfolio-report__goals-callout">
          <p class="portfolio-report__goals-text">Tell us about your plans so we can tailor optimisation suggestions</p>
          <button type="button" class="portfolio-report__goals-btn" data-action="open-investment-goals">My investment goals</button>
        </div>
      </div>
      <div class="portfolio-report__columns">
        <div class="portfolio-report__column">
          <h3 class="portfolio-report__column-title">Value &amp; equity</h3>
          <div class="portfolio-report__grid">
            ${renderPortfolioMetric('Total portfolio value', formatCurrency(metrics.totalPortfolioValue), { highlight: true })}
            ${renderPortfolioMetric('Total mortgage balance', formatCurrency(metrics.totalMortgageBalance))}
            ${renderPortfolioEquityMetric(metrics, portfolio)}
            ${renderPortfolioLtvMetric(metrics)}
          </div>
          <div class="portfolio-report__chart">
            ${renderPortfolioDonutChart([
    {
      name: 'Equity',
      flyoutLabel: 'Equity',
      value: equityValue,
      color: '#ffffff',
      format: formatCurrency,
    },
    {
      name: 'Mortgages',
      flyoutLabel: 'Mortgages',
      value: mortgageBalance,
      color: 'rgba(255,255,255,0.45)',
      format: formatCurrency,
    },
  ])}
          </div>
        </div>
        <div class="portfolio-report__column">
          <h3 class="portfolio-report__column-title">Income &amp; occupancy</h3>
          <div class="portfolio-report__grid">
            ${renderPortfolioMetric('Total market rent', formatCurrency(metrics.totalMarketRent), { highlight: true })}
            ${renderPortfolioMetric('Total achieved rent', renderRentAgreedDisplay(metrics.totalRentAgreed, true), { highlight: true })}
            ${renderPortfolioMetric('Occupied properties', escapeHtml(metrics.occupancyFraction), {
    sub: metrics.totalProperties > 0 ? `${metrics.occupiedCount} of ${metrics.totalProperties} let` : null,
  })}
          </div>
          <div class="portfolio-report__chart">
            <div class="portfolio-report__stacked-group">
              ${renderPortfolioStackedBar({
    title: 'Rent achieved vs Market',
    ariaLabel: `Achieved rent ${formatCurrency(achievedRent)} of ${formatCurrency(metrics.totalMarketRent)} market rent`,
    segments: [
      {
        name: 'Achieved rent',
        value: achievedRent,
        color: 'rgba(255,255,255,0.92)',
        format: (value) => `${formatCurrency(value)}/mo`,
      },
      {
        name: 'Gap to market',
        value: rentGap,
        color: 'rgba(255,255,255,0.35)',
        format: (value) => `${formatCurrency(value)}/mo`,
      },
    ],
  })}
              ${renderPortfolioStackedBar({
    title: 'Occupancy',
    ariaLabel: `${metrics.occupiedCount} occupied and ${vacantCount} vacant properties`,
    segments: [
      {
        name: 'Occupied',
        value: metrics.occupiedCount,
        color: 'rgba(255,255,255,0.92)',
        format: (value) => `${value} properties`,
      },
      {
        name: 'Vacant',
        value: vacantCount,
        color: 'rgba(255,255,255,0.35)',
        format: (value) => `${value} properties`,
      },
    ],
  })}
            </div>
          </div>
        </div>
        <div class="portfolio-report__column">
          <h3 class="portfolio-report__column-title">Performance</h3>
          <div class="portfolio-report__grid">
            ${renderPortfolioMetric('Gross yield', formatPercent(metrics.grossYield))}
            ${renderPortfolioMetric('Interest coverage ratio', formatPercent(metrics.icr))}
            ${renderPortfolioMetric('Portfolio value change (3 months)', formatCurrencyChange(change.amount), {
    tone: changeTone,
    sub: changeSub,
  })}
          </div>
          <div class="portfolio-report__chart">
            ${renderPortfolioLineChart(metrics.portfolioValueTrend5y || [], { title: 'Portfolio Value' })}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderAccessGate() {
  app.innerHTML = `
    <div class="access-gate" id="access-gate">
      <div class="access-gate__panel">
        <img
          class="access-gate__logo"
          src="${BRAND_LOGO_PATH}"
          alt="ACME Lettings"
          height="40"
        >
        <h1 class="access-gate__title">Investor Landlord Portal</h1>
        <p class="access-gate__subtitle">Enter the demo access code to continue.</p>
        <form class="passcode-form" id="passcode-form" autocomplete="off">
          <div class="passcode-boxes" role="group" aria-label="Access code">
            ${[0, 1, 2, 3, 4, 5].map((i) => `
              <input
                class="passcode-digit"
                id="passcode-${i}"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                maxlength="1"
                autocomplete="off"
                aria-label="Digit ${i + 1}"
              >
            `).join('')}
          </div>
          <p class="passcode-error" id="passcode-error" hidden>Incorrect code</p>
        </form>
      </div>
    </div>
  `;

  document.title = PAGE_TITLES.gate;
  bindPasscodeInputs();
}

function bindPasscodeInputs() {
  const inputs = [...document.querySelectorAll('.passcode-digit')];
  const errorEl = document.getElementById('passcode-error');
  const gate = document.getElementById('access-gate');

  const clearError = () => {
    errorEl.hidden = true;
    gate?.classList.remove('access-gate--error');
  };

  const getCode = () => inputs.map((input) => input.value).join('');

  const resetInputs = () => {
    inputs.forEach((input) => {
      input.value = '';
    });
    inputs[0]?.focus();
  };

  const submitCode = () => {
    const code = getCode();
    if (code.length < 6) return;

    if (isAccessCodeValid(code)) {
      state.accessGranted = true;
      saveState(state);
      navigate('/login');
      render();
      return;
    }

    errorEl.hidden = false;
    gate?.classList.add('access-gate--error');
    resetInputs();
  };

  inputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      clearError();
      input.value = input.value.replace(/\D/g, '').slice(-1);
      if (input.value && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
      if (getCode().length === 6) {
        submitCode();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        inputs[index - 1].focus();
      }
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
      clearError();
      const digits = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
      digits.split('').forEach((digit, i) => {
        if (inputs[i]) inputs[i].value = digit;
      });
      if (digits.length === 6) {
        submitCode();
      } else if (digits.length > 0) {
        inputs[Math.min(digits.length, inputs.length - 1)]?.focus();
      }
    });
  });

  inputs[0]?.focus();
}

function renderLogin() {
  app.innerHTML = `
    <div class="demo-banner demo-banner--login">Demonstration prototype only. No credentials are collected.</div>
    <div class="login-page">
      <div class="login-hero">
        ${renderPortalLogo({ height: 48, className: 'portal-logo portal-logo--hero' })}
        <h1>Investor Landlord Portal</h1>
        <p>Demonstration of a buy-to-let portfolio experience. All property and portfolio data is fictional.</p>
      </div>
      <div class="login-panel">
        <div class="login-card">
          <h2>Enter demo</h2>
          <p class="hint">This prototype uses click-through access only. There is no real sign-in and nothing you enter is transmitted or stored.</p>
          <form id="login-form">
            <button type="submit" class="btn btn-primary">Continue to demo</button>
          </form>
          <div class="login-demo-note">
            <strong>Safe to explore:</strong> All portfolio data is fictional and runs entirely in your browser.
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    state.loggedIn = true;
    saveState(state);
    navigate('/dashboard');
  });
}

function renderFooter() {
  return `
    <footer class="site-footer">
      © Demonstration prototype ${new Date().getFullYear()}. All data is fictional.
    </footer>
  `;
}

function renderDashboard() {
  const hasPortfolio = state.portfolio && state.portfolio.properties.length > 0;
  if (hasPortfolio) syncPortfolioAvm(state.portfolio);

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content">
        <h1 class="page-title">Welcome</h1>
        <p class="page-subtitle">Manage your buy-to-let property portfolio.</p>

        ${hasPortfolio ? `
          <div class="alert alert-success">
            Portfolio <strong>${escapeHtml(state.portfolio.name)}</strong> — ${state.portfolio.properties.length} propert${state.portfolio.properties.length === 1 ? 'y' : 'ies'}.
          </div>
          ${renderPortfolioReport(computePortfolioMetrics(state.portfolio.properties), state.portfolio)}
          ${renderInvestmentGoalsModal()}
          <div class="btn-group">
            <a class="btn btn-primary" href="#/portfolio/summary">View portfolio</a>
            <button class="btn btn-secondary" data-action="create-new">Create another portfolio</button>
          </div>
        ` : `
          <div class="card">
            <h2 class="section-title">Get started</h2>
            <p class="empty-state-text">You don't have a portfolio yet. Create one by adding properties individually or uploading a CSV file.</p>
            <div class="btn-group">
              <a class="btn btn-primary" href="#/portfolio/create">Create new portfolio</a>
            </div>
          </div>
        `}
      </div>
    </main>
    ${renderFooter()}
  `;

  bindCommonActions();
  bindPortfolioChartTooltips();
  bindInvestmentGoalsModal();
  document.querySelector('[data-action="create-new"]')?.addEventListener('click', () => {
    draftPortfolio = { name: '', properties: [] };
    state.draftPortfolio = draftPortfolio;
    saveState(state);
    navigate('/portfolio/create');
  });
}

function renderCreatePortfolio() {
  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content page-content--medium">
        <div class="breadcrumb"><a href="#/dashboard">Dashboard</a> / Create portfolio</div>
        <h1 class="page-title">Create new portfolio</h1>
        <p class="page-subtitle">Give your portfolio a name, then choose how to add properties.</p>

        <div class="card">
          <form id="portfolio-name-form">
            <div class="form-group">
              <label for="portfolio-name">Portfolio name</label>
              <input id="portfolio-name" name="portfolioName" type="text" required placeholder="e.g. Northern Buy-to-Let Portfolio" value="${escapeHtml(draftPortfolio.name)}">
            </div>
          </form>
        </div>

        <h2 class="section-title">How would you like to add properties?</h2>
        <div class="card-grid">
          <button class="choice-card" data-method="manual">
            <div class="choice-card__icon">✎</div>
            <h3 class="choice-card__title">Manual entry</h3>
            <p class="choice-card__desc">Enter a postcode, pick from matching registered addresses, and add properties one at a time.</p>
          </button>
          <button class="choice-card" data-method="csv">
            <div class="choice-card__icon">↑</div>
            <h3 class="choice-card__title">Bulk import</h3>
            <p class="choice-card__desc">Upload a CSV file with multiple properties. Download our template to get started.</p>
          </button>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;

  bindCommonActions();

  const nameInput = document.getElementById('portfolio-name');
  nameInput.addEventListener('input', () => {
    draftPortfolio.name = nameInput.value;
    state.draftPortfolio = draftPortfolio;
    saveState(state);
  });

  document.querySelectorAll('[data-method]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (!name) {
        nameInput.focus();
        nameInput.reportValidity();
        return;
      }
      draftPortfolio.name = name;
      state.draftPortfolio = draftPortfolio;
      manualEntryDraft = {};
      manualEntryErrors = {};
      pendingBulkImport = null;
      saveState(state);
      navigate(btn.dataset.method === 'manual' ? '/portfolio/add' : '/portfolio/upload');
    });
  });
}

function renderManualEntryField(field, values = {}, errors = {}) {
  const hasError = Boolean(errors[field]);
  const errorHtml = `<div class="field-error" id="error-${field}">${hasError ? escapeHtml(errors[field]) : ''}</div>`;

  return `
    <div class="form-group">
      <label for="${field}">${FIELD_LABELS[field]}</label>
      <input
        id="${field}"
        name="${field}"
        type="text"
        required
        class="${hasError ? 'input-error' : ''}"
        value="${escapeHtml(values[field] || '')}"
      >
      ${errorHtml}
    </div>
  `;
}

function renderManualEntryForm(values = {}, errors = {}) {
  const matches = searchAddressesByPostcode(values.postcode || '');
  const pickerVisible = matches.length > 0;

  return `
    <div class="postcode-lookup-row">
      ${renderManualEntryField('postcode', values, errors)}
      <div class="form-group" id="property-picker-group" ${pickerVisible ? '' : 'hidden'}>
        <label for="property-picker">Matching properties</label>
        <select id="property-picker" name="propertyPicker">
          <option value="">Select a property…</option>
          ${matches.map((entry) => `
            <option
              value="${entry.id}"
              ${values.addressId === entry.id ? 'selected' : ''}
            >${escapeHtml(`${entry.propertyNumber} ${entry.street}, ${entry.city}`)}</option>
          `).join('')}
        </select>
        <div class="field-error" aria-hidden="true">&nbsp;</div>
      </div>
    </div>
    ${renderManualEntryField('titleRef', values, errors)}
    <div class="form-row">
      ${renderManualEntryField('propertyNumber', values, errors)}
      ${renderManualEntryField('street', values, errors)}
    </div>
    ${renderManualEntryField('city', values, errors)}
  `;
}

function renderValidationInput(rowIndex, field, value, hasError) {
  return `
    <input
      type="text"
      class="validation-table__input${hasError ? ' input-error' : ''}"
      data-row="${rowIndex}"
      data-field="${field}"
      value="${escapeHtml(value || '')}"
      aria-label="${escapeHtml(FIELD_LABELS[field])}"
      aria-invalid="${hasError ? 'true' : 'false'}"
    >
  `;
}

function renderBulkValidationPanel(result) {
  if (!result || !result.rows.length) return '';

  const hasInvalidRows = result.invalidCount > 0;

  return `
    <div class="card" id="bulk-validation-panel">
      <h2 class="section-title">Import validation</h2>
      ${hasInvalidRows ? `
        <p class="validation-panel__intro">Edit any rows with issues below, then click <strong>Try again</strong> to re-validate your data.</p>
      ` : ''}
      <div class="validation-summary">
        <span class="validation-summary__item validation-summary__item--valid">${result.validCount} valid</span>
        <span class="validation-summary__item validation-summary__item--invalid">${result.invalidCount} with issues</span>
      </div>
      <div class="data-table-wrap">
        <table class="data-table validation-table">
          <thead>
            <tr>
              <th>Row</th>
              <th>Title / Ref</th>
              <th>Postcode</th>
              <th>Property number</th>
              <th>Street</th>
              <th>City</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${result.rows.map((row, rowIndex) => `
              <tr class="${row.valid ? '' : 'row-invalid'}">
                <td>${row.line}</td>
                <td>${renderValidationInput(rowIndex, 'titleRef', row.property.titleRef, !!row.errors?.titleRef)}</td>
                <td>${renderValidationInput(rowIndex, 'postcode', row.property.postcode, !!row.errors?.postcode)}</td>
                <td>${renderValidationInput(rowIndex, 'propertyNumber', row.property.propertyNumber, !!row.errors?.propertyNumber)}</td>
                <td>${renderValidationInput(rowIndex, 'street', row.property.street, !!row.errors?.street)}</td>
                <td>${renderValidationInput(rowIndex, 'city', row.property.city, !!row.errors?.city)}</td>
                <td class="${row.valid ? '' : 'cell-error'}">${escapeHtml(row.summary)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="btn-group">
        ${hasInvalidRows ? '<button type="button" class="btn btn-secondary" id="bulk-revalidate-btn">Try again</button>' : ''}
        ${result.validCount > 0 ? `
          <button type="button" class="btn btn-primary" id="import-valid-btn">Import ${result.validCount} valid propert${result.validCount === 1 ? 'y' : 'ies'}</button>
        ` : ''}
      </div>
      ${result.validCount === 0 ? `
        <div class="alert" style="margin-top:16px;background:#fde8ec;color:#8a1530;border:1px solid #f5c2cb;">
          No valid properties to import. Correct the issues above and try again.
        </div>
      ` : ''}
    </div>
  `;
}

function collectBulkImportRowsFromPanel() {
  const panel = document.getElementById('bulk-validation-panel');
  if (!panel || !pendingBulkImport) return [];

  return pendingBulkImport.rows.map((row, rowIndex) => {
    const property = { ...row.property };
    REQUIRED_FIELDS.forEach((field) => {
      const input = panel.querySelector(`[data-row="${rowIndex}"][data-field="${field}"]`);
      if (input) property[field] = input.value.trim();
    });
    return { line: row.line, property };
  });
}

function applyBulkImportResult(result) {
  pendingBulkImport = result;

  if (!result.rows.length) {
    renderUploadCsv();
    return;
  }

  if (result.invalidCount === 0) {
    finalizeBulkImport(result.validProperties);
    return;
  }

  renderUploadCsv();
}

function bindBulkValidationPanel() {
  document.getElementById('bulk-revalidate-btn')?.addEventListener('click', () => {
    const rows = collectBulkImportRowsFromPanel();
    applyBulkImportResult(validateImportRows(rows));
  });

  document.getElementById('import-valid-btn')?.addEventListener('click', () => {
    if (pendingBulkImport?.validCount) {
      finalizeBulkImport(pendingBulkImport.validProperties);
    }
  });
}

function bindManualEntryForm() {
  const postcodeInput = document.getElementById('postcode');
  const picker = document.getElementById('property-picker');
  const pickerGroup = document.getElementById('property-picker-group');
  const form = document.getElementById('property-form');

  const refreshPicker = () => {
    const matches = searchAddressesByPostcode(postcodeInput.value);
    if (!pickerGroup || !picker) return;

    if (!matches.length) {
      pickerGroup.hidden = true;
      picker.innerHTML = '<option value="">Select a property…</option>';
      return;
    }

    pickerGroup.hidden = false;
    const current = picker.value;
    picker.innerHTML = `
      <option value="">Select a property…</option>
      ${matches.map((entry) => `
        <option value="${entry.id}">${escapeHtml(`${entry.propertyNumber} ${entry.street}, ${entry.city}`)}</option>
      `).join('')}
    `;
    if (matches.some((entry) => entry.id === current)) {
      picker.value = current;
    }
  };

  postcodeInput?.addEventListener('input', () => {
    clearManualFieldError('postcode');
    refreshPicker();
  });

  picker?.addEventListener('change', () => {
    const matches = searchAddressesByPostcode(postcodeInput.value);
    const selected = matches.find((entry) => entry.id === picker.value);
    if (!selected) return;

    document.getElementById('propertyNumber').value = selected.propertyNumber;
    document.getElementById('street').value = selected.street;
    document.getElementById('city').value = selected.city;
    ['propertyNumber', 'street', 'city'].forEach(clearManualFieldError);
  });

  REQUIRED_FIELDS.forEach((field) => {
    document.getElementById(field)?.addEventListener('input', () => clearManualFieldError(field));
  });

  document.querySelectorAll('[data-scenario]').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyManualScenario(btn.dataset.scenario);
    });
  });

  form?.addEventListener('submit', handleManualEntrySubmit);
}

function clearManualFieldError(field) {
  manualEntryErrors[field] = '';
  const input = document.getElementById(field);
  const errorEl = document.getElementById(`error-${field}`);
  input?.classList.remove('input-error');
  if (errorEl) errorEl.textContent = '';
}

function applyManualScenario(scenario) {
  const demo = scenario === 'perfect' ? DEMO_MANUAL_PERFECT : DEMO_MANUAL_IMPERFECT;
  manualEntryErrors = {};
  manualEntryDraft = { ...demo };

  if (scenario === 'imperfect') {
    manualEntryDraft.titleRef = '';
    manualEntryDraft.street = DEMO_MANUAL_IMPERFECT.street;
    manualEntryDraft.addressId = '';
  }

  renderAddProperty();
}

function handleManualEntrySubmit(e) {
  e.preventDefault();
  const property = collectPropertyFromForm(e.target, false);
  manualEntryDraft = {
    ...property,
    addressId: document.getElementById('property-picker')?.value || '',
  };
  const { valid, errors } = validateProperty(property);

  if (!valid) {
    manualEntryErrors = errors;
    renderAddProperty();
    return;
  }

  manualEntryErrors = {};
  manualEntryDraft = {};
  draftPortfolio.properties.push(enrichPropertyWithAvm(property));
  state.draftPortfolio = draftPortfolio;
  saveState(state);
  renderAddProperty();
}

function finalizeBulkImport(validProperties) {
  state.portfolio = {
    name: draftPortfolio.name,
    properties: enrichProperties(validProperties),
    createdAt: new Date().toISOString(),
  };
  draftPortfolio = { name: '', properties: [] };
  state.draftPortfolio = draftPortfolio;
  pendingBulkImport = null;
  pendingBulkImportSuccess = null;
  saveState(state);
  navigate('/portfolio/summary');
}

async function triggerDemoBulkImport() {
  const response = await fetch('assets/portfolio-sample-perfect.csv');
  const text = await response.text();
  const result = parseCsvDetailed(text);
  const total = result.validCount || result.rows.length || 3;

  pendingBulkImportSuccess = {
    imported: total,
    total,
    properties: result.validProperties,
  };
  renderUploadCsv();
}

function bindBulkImportSuccessModal() {
  document.querySelector('[data-action="confirm-bulk-import"]')?.addEventListener('click', () => {
    if (!pendingBulkImportSuccess?.properties?.length) return;
    finalizeBulkImport(pendingBulkImportSuccess.properties);
  });
}

function renderAddProperty() {
  const propertyCount = draftPortfolio.properties.length;

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content page-content--medium">
        <div class="breadcrumb"><a href="#/dashboard">Dashboard</a> / <a href="#/portfolio/create">Create portfolio</a> / Manual entry</div>
        <h1 class="page-title">Manual entry</h1>
        <p class="page-subtitle">Portfolio: <strong>${escapeHtml(draftPortfolio.name)}</strong> · ${propertyCount} propert${propertyCount === 1 ? 'y' : 'ies'} added</p>

        ${propertyCount > 0 ? `
          <div class="alert alert-info">${propertyCount} propert${propertyCount === 1 ? 'y' : 'ies'} in this portfolio so far. Add more below or finish when ready.</div>
        ` : ''}

        <div class="card">
          <div class="scenario-panel">
            <p class="scenario-panel__label">Demo scenarios</p>
            <div class="btn-group" style="margin-top: 0;">
              <button type="button" class="btn btn-secondary" data-scenario="perfect">Perfect entry</button>
              <button type="button" class="btn btn-tertiary" data-scenario="imperfect">Entry with errors</button>
            </div>
          </div>

          <form id="property-form">
            ${renderManualEntryForm(manualEntryDraft, manualEntryErrors)}
            <div class="btn-group">
              <button type="submit" class="btn btn-primary">Add property</button>
              ${propertyCount > 0 ? '<button type="button" class="btn btn-secondary" id="finish-btn">Finish portfolio</button>' : ''}
              <a class="btn btn-tertiary" href="#/portfolio/create">Back</a>
            </div>
          </form>
        </div>

        ${propertyCount > 0 ? renderPropertyList(draftPortfolio.properties) : ''}
      </div>
    </main>
    ${renderFooter()}
  `;

  bindCommonActions();
  bindManualEntryForm();
  document.getElementById('finish-btn')?.addEventListener('click', finishPortfolio);
}

function renderBulkImportSuccessModal() {
  if (!pendingBulkImportSuccess) return '';

  const { imported, total } = pendingBulkImportSuccess;
  return `
    <div class="modal" id="bulk-import-success-modal" role="dialog" aria-labelledby="bulk-import-success-title" aria-modal="true">
      <div class="modal__backdrop"></div>
      <div class="modal__panel">
        <h2 class="modal__title" id="bulk-import-success-title">Import complete</h2>
        <p class="modal__intro">${imported} of ${total} properties successfully imported.</p>
        <div class="modal__actions">
          <button type="button" class="btn btn-primary" data-action="confirm-bulk-import">Continue</button>
        </div>
      </div>
    </div>
  `;
}

function renderUploadCsv() {
  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content page-content--medium">
        <div class="breadcrumb"><a href="#/dashboard">Dashboard</a> / <a href="#/portfolio/create">Create portfolio</a> / Bulk import</div>
        <h1 class="page-title">Bulk import</h1>
        <p class="page-subtitle">Portfolio: <strong>${escapeHtml(draftPortfolio.name)}</strong></p>

        <div class="card">
          <p style="margin-top: 0;">Download the CSV template, fill in your property details, then upload the file. Required columns: Title/Ref, Postcode, Property number, Street, City.</p>
          <div class="btn-group" style="margin-top: 0;">
            <a class="btn btn-secondary" href="assets/portfolio-template.csv" download="portfolio-template.csv">Download template</a>
          </div>
        </div>

        <div class="card">
          <div class="upload-zone" id="upload-zone">
            <div class="upload-zone__icon">📄</div>
            <p>Drag and drop your CSV file here, or click to browse</p>
            <label class="btn btn-primary" for="csv-input">Choose file</label>
            <input type="file" id="csv-input" accept=".csv,text/csv" hidden>
          </div>
        </div>

        <div class="btn-group">
          <a class="btn btn-tertiary" href="#/portfolio/create">Back</a>
        </div>
      </div>
    </main>
    ${renderFooter()}
    ${renderBulkImportSuccessModal()}
  `;

  bindCommonActions();
  setupCsvUpload();
  bindBulkImportSuccessModal();
}

function syncPortfolioAvm(portfolio) {
  portfolio.properties = enrichProperties(portfolio.properties);
  saveState(state);
}

function renderSummary() {
  const portfolio = state.portfolio;
  if (!portfolio) {
    navigate('/dashboard');
    return;
  }

  syncPortfolioAvm(portfolio);
  const metrics = computePortfolioMetrics(portfolio.properties);

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content">
        <div class="breadcrumb"><a href="#/dashboard">Dashboard</a> / Portfolio summary</div>
        <h1 class="page-title">${escapeHtml(portfolio.name)}</h1>

        ${renderPortfolioReport(metrics, portfolio)}

        ${renderPortfolioFinancialCompletionBanner(portfolio.properties)}

        <div class="card">
          <div class="portfolio-properties-header">
            <div class="section-title-row">
              <h2 class="section-title">Portfolio properties</h2>
              ${renderInfoTooltip('Properties currently held in your portfolio, showing key performance metrics for at-a-glance monitoring. Value data is monitored 24/7, so you\'re always the first to know about changes. Select a property to view the full asset profile.')}
            </div>
            <a class="btn btn-secondary" href="#/portfolio/summary/add">Add property</a>
          </div>
          ${portfolio.properties.length === 0 ? `
            <p class="empty-state-text">No properties are currently held in this portfolio. <a href="#/portfolio/summary/add">Add a property</a> to begin monitoring performance.</p>
          ` : `
          <div class="data-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Address</th>
                  <th>Achieved rent</th>
                  <th>Market rent</th>
                  <th>Occupancy</th>
                  <th>Letting agent</th>
                  <th>
                    <span class="data-table__header-label">
                      Profile %
                      ${renderInfoTooltip('The more information we have about a property, the more ways we can help you optimise your portfolio.')}
                    </span>
                  </th>
                  <th>Opportunities &amp; alerts</th>
                </tr>
              </thead>
              <tbody>
                ${metrics.properties.map((p, index) => `
                  <tr
                    class="data-table__row--clickable"
                    data-action="view-property"
                    data-index="${index}"
                    tabindex="0"
                    role="link"
                    aria-label="View ${escapeHtml(p.titleRef)}"
                  >
                    <td><strong>${escapeHtml(p.titleRef)}</strong></td>
                    <td>${escapeHtml(formatAddress(p))}</td>
                    <td>${renderRentAgreedDisplay(p.rentAgreed)}</td>
                    <td>${renderLineCurrency(p.marketRent)}</td>
                    <td>${renderLineOccupancy(p.occupancy)}</td>
                    <td>${escapeHtml(getPropertyLettingAgent(index))}</td>
                    <td>${renderLineCompleteness(computePropertyDataCompleteness(p))}</td>
                    <td>${renderLineAlerts(p, index)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          `}
        </div>

        <div class="btn-group">
          <a class="btn btn-primary" href="#/dashboard">Back to dashboard</a>
          <button class="btn btn-secondary" data-action="create-new">Create another portfolio</button>
        </div>
      </div>
    </main>
    ${renderInvestmentGoalsModal()}
    ${renderFooter()}
  `;

  bindCommonActions();
  bindPortfolioChartTooltips();
  bindInvestmentGoalsModal();
  document.querySelector('[data-action="create-new"]')?.addEventListener('click', () => {
    draftPortfolio = { name: '', properties: [] };
    state.draftPortfolio = draftPortfolio;
    saveState(state);
    navigate('/portfolio/create');
  });

  document.querySelectorAll('[data-action="view-property"]').forEach((row) => {
    const openProperty = () => {
      const property = portfolio.properties[Number(row.dataset.index)];
      const tab = property ? getPropertyDefaultTab(property) : 'overview';
      navigate(`/portfolio/property/${row.dataset.index}/${tab}`);
    };
    row.addEventListener('click', (event) => {
      if (event.target.closest('a, button')) return;
      openProperty();
    });
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProperty();
      }
    });
  });
}

function renderSummaryAddProperty() {
  const portfolio = state.portfolio;
  if (!portfolio) {
    navigate('/dashboard');
    return;
  }

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content page-content--medium">
        <div class="breadcrumb"><a href="#/dashboard">Dashboard</a> / <a href="#/portfolio/summary">Portfolio</a> / Add property</div>
        <h1 class="page-title">Add property</h1>
        <p class="page-subtitle">Portfolio: <strong>${escapeHtml(portfolio.name)}</strong> · ${portfolio.properties.length} propert${portfolio.properties.length === 1 ? 'y' : 'ies'}</p>

        <div class="card">
          <div class="btn-group" style="margin-top: 0; margin-bottom: 20px;">
            <button type="button" class="btn btn-secondary" id="demo-fill-btn">Fill with demo data</button>
          </div>

          <form id="property-form">
            ${renderPropertyFields({}, true)}
            <div class="btn-group">
              <button type="submit" class="btn btn-primary">Add to portfolio</button>
              <a class="btn btn-tertiary" href="#/portfolio/summary">Cancel</a>
            </div>
          </form>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;

  bindCommonActions();
  document.getElementById('demo-fill-btn').addEventListener('click', () => fillDemoData(true));
  document.getElementById('property-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const property = collectPropertyFromForm(form, true);
    portfolio.properties.push(enrichPropertyWithAvm(property));
    saveState(state);
    navigate('/portfolio/summary');
  });
}

function renderFieldInput(field, values, optional = false) {
  const suffix = optional ? ' <span class="label-optional">(optional)</span>' : '';
  const label = `${FIELD_LABELS[field]}${suffix}`;

  if (field === 'tenancyStatus') {
    const options = ['', 'Let', 'Vacant', 'Under offer', 'Notice served'];
    return `
      <div class="form-group">
        <label for="${field}">${label}</label>
        <select id="${field}" name="${field}">
          ${options.map((opt) => `<option value="${opt}" ${values[field] === opt ? 'selected' : ''}>${opt || 'Select…'}</option>`).join('')}
        </select>
      </div>
    `;
  }

  if (field === 'paymentType') {
    const options = ['', 'Repayment', 'Interest only'];
    return `
      <div class="form-group">
        <label for="${field}">${label}</label>
        <select id="${field}" name="${field}">
          ${options.map((opt) => `<option value="${opt}" ${values[field] === opt ? 'selected' : ''}>${opt || 'Select…'}</option>`).join('')}
        </select>
      </div>
    `;
  }

  const type = field.includes('Date')
    ? 'date'
    : field.includes('Rent') || field.includes('Balance') || field.includes('Payments')
      ? 'number'
      : 'text';

  return `
    <div class="form-group">
      <label for="${field}">${label}</label>
      <input id="${field}" name="${field}" type="${type}" ${optional ? '' : 'required'} value="${escapeHtml(values[field] || '')}" ${type === 'number' ? 'min="0" step="1"' : ''}>
    </div>
  `;
}

function renderPropertyFields(values = {}, includeOptional = false) {
  const optionalSection = includeOptional ? `
    <fieldset class="fieldset-optional">
      <legend>Additional details (optional)</legend>
      ${OPTIONAL_FIELDS.map((field) => renderFieldInput(field, values, true)).join('')}
    </fieldset>
  ` : '';

  return `
    <div class="form-row">
      ${renderFieldInput('titleRef', values)}
      ${renderFieldInput('postcode', values)}
    </div>
    <div class="form-row">
      ${renderFieldInput('propertyNumber', values)}
      ${renderFieldInput('street', values)}
    </div>
    ${renderFieldInput('city', values)}
    ${optionalSection}
  `;
}

function renderPropertyList(properties) {
  return `
    <div class="card">
      <h2 class="section-title">Properties added</h2>
      <ul class="property-list">
        ${properties.map((p) => `
          <li class="property-item">
            <div>
              <div class="property-item__ref">${escapeHtml(p.titleRef)}</div>
              <div class="property-item__address">${escapeHtml(formatAddress(p))}</div>
            </div>
            ${p.tenancyStatus ? `<span class="badge badge-green">${escapeHtml(p.tenancyStatus)}</span>` : ''}
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

function fillDemoData(includeOptional = false) {
  const demo = includeOptional ? DEMO_PROPERTY : DEMO_MANUAL_PERFECT;
  const fields = includeOptional ? [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS] : REQUIRED_FIELDS;
  fields.forEach((field) => {
    const el = document.getElementById(field);
    if (el) el.value = demo[field] || '';
  });
}

function collectPropertyFromForm(form, includeOptional = false) {
  const property = {};
  const fields = includeOptional ? [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS] : REQUIRED_FIELDS;
  fields.forEach((field) => {
    property[field] = form.elements[field]?.value?.trim() || '';
  });
  return property;
}

function finishPortfolio() {
  state.portfolio = {
    name: draftPortfolio.name,
    properties: enrichProperties(draftPortfolio.properties),
    createdAt: new Date().toISOString(),
  };
  draftPortfolio = { name: '', properties: [] };
  state.draftPortfolio = draftPortfolio;
  saveState(state);
  navigate('/portfolio/summary');
}

function processCsvText(text) {
  applyBulkImportResult(parseCsvDetailed(text));
}

function setupCsvUpload() {
  const zone = document.getElementById('upload-zone');
  const input = document.getElementById('csv-input');

  const handleFile = (file) => {
    if (!file) return;
    input.value = '';
    triggerDemoBulkImport();
  };

  input.addEventListener('change', () => handleFile(input.files[0]));
  zone.addEventListener('click', (e) => {
    if (e.target.closest('label[for="csv-input"]')) return;
    input.click();
  });
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    handleFile(e.dataTransfer.files[0] || { name: 'portfolio.csv' });
  });
}

async function loadSampleCsv(type = 'perfect') {
  const file = type === 'errors' ? 'portfolio-sample-errors.csv' : 'portfolio-sample-perfect.csv';
  const response = await fetch(`assets/${file}`);
  const text = await response.text();
  processCsvText(text);
}

function bindCommonActions() {
  document.querySelector('[data-action="logout"]')?.addEventListener('click', () => {
    state = {
      accessGranted: state.accessGranted,
      loggedIn: false,
      portfolio: state.portfolio,
      draftPortfolio: null,
    };
    saveState(state);
    navigate('/login');
  });

  document.querySelector('[data-action="add-investor-club"]')?.addEventListener('click', () => {
    marketplaceInvestorClubFilter = 'investor-club';
    navigate('/portfolio/marketplace');
  });

  document.querySelectorAll('[data-action="quote-next-steps"]').forEach((button) => {
    button.addEventListener('click', () => {
      button.hidden = true;
      const confirmation = button.closest('.quote-summary__actions')?.querySelector('[data-quote-confirmation]');
      if (confirmation) confirmation.hidden = false;
    });
  });
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render() {
  window.scrollTo(0, 0);

  if (!state.accessGranted) {
    renderAccessGate();
    return;
  }

  document.title = PAGE_TITLES.app;

  const route = getRoute();
  if (!requireAuth(route)) return;

  const parsed = parseRoute(route);
  if (parsed.type === 'property') {
    renderPropertyDetail(parsed.index, parsed.tab);
    return;
  }
  if (parsed.type === 'marketplace-quote') {
    renderMortgageQuote(parsed.listingId);
    return;
  }
  if (parsed.type === 'refinance-quote') {
    renderPropertyRefinanceQuote(parsed.index);
    return;
  }
  if (parsed.type === 'renewal-quote') {
    renderPropertyMortgageRenewalQuote(parsed.index);
    return;
  }
  if (parsed.type === 'rent-review') {
    renderPropertyRentReview(parsed.index);
    return;
  }
  if (parsed.type === 'epc-improvement') {
    renderPropertyEpcImprovement(parsed.index);
    return;
  }

  switch (route) {
    case '/login':
      renderLogin();
      break;
    case '/dashboard':
      renderDashboard();
      break;
    case '/portfolio/create':
      renderCreatePortfolio();
      break;
    case '/portfolio/add':
      if (!draftPortfolio.name) {
        navigate('/portfolio/create');
        return;
      }
      renderAddProperty();
      break;
    case '/portfolio/upload':
      if (!draftPortfolio.name) {
        navigate('/portfolio/create');
        return;
      }
      renderUploadCsv();
      break;
    case '/portfolio/summary':
      renderSummary();
      break;
    case '/portfolio/marketplace':
      renderMarketplace();
      break;
    case '/portfolio/summary/add':
      renderSummaryAddProperty();
      break;
    default:
      navigate(state.loggedIn ? '/dashboard' : '/login');
  }
}

window.addEventListener('hashchange', render);
window.addEventListener('load', render);

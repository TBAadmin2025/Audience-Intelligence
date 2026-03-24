// ==========================================
// TAX ENGINE (2026 Parameters)
// ==========================================

interface TaxBracket {
  lower_bound: number;
  upper_bound: number | null;
  base_tax: number;
  marginal_rate: number;
}

interface TaxParams {
  standardDeduction: { [key: string]: number };
  brackets: { [key: string]: TaxBracket[] };
  ssaWageBase: number;
  seTax: {
    baseFactor: number;
    ssRate: number;
    medicareRate: number;
  };
}

function normalizeIncome(value: any): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

const taxParams2026: TaxParams = {
  standardDeduction: {
    "Single": 16100,
    "Married Filing Jointly": 32200,
    "Head of Household": 24150,
    "Married Filing Separately": 16100
  },
  brackets: {
    "Single": [
      { lower_bound: 0, upper_bound: 11925, base_tax: 0, marginal_rate: 0.10 },
      { lower_bound: 11925, upper_bound: 48475, base_tax: 1192.50, marginal_rate: 0.12 },
      { lower_bound: 48475, upper_bound: 103350, base_tax: 5578.50, marginal_rate: 0.22 },
      { lower_bound: 103350, upper_bound: 197300, base_tax: 17651.00, marginal_rate: 0.24 },
      { lower_bound: 197300, upper_bound: 250525, base_tax: 40199.00, marginal_rate: 0.32 },
      { lower_bound: 250525, upper_bound: 626350, base_tax: 57231.00, marginal_rate: 0.35 },
      { lower_bound: 626350, upper_bound: null, base_tax: 188770.00, marginal_rate: 0.37 }
    ],
    "Married Filing Jointly": [
      { lower_bound: 0, upper_bound: 23850, base_tax: 0, marginal_rate: 0.10 },
      { lower_bound: 23850, upper_bound: 96950, base_tax: 2385.00, marginal_rate: 0.12 },
      { lower_bound: 96950, upper_bound: 206700, base_tax: 11157.00, marginal_rate: 0.22 },
      { lower_bound: 206700, upper_bound: 394600, base_tax: 35302.00, marginal_rate: 0.24 },
      { lower_bound: 394600, upper_bound: 501050, base_tax: 80398.00, marginal_rate: 0.32 },
      { lower_bound: 501050, upper_bound: 751600, base_tax: 114462.00, marginal_rate: 0.35 },
      { lower_bound: 751600, upper_bound: null, base_tax: 202154.50, marginal_rate: 0.37 }
    ],
    "Head of Household": [
      { lower_bound: 0, upper_bound: 17000, base_tax: 0, marginal_rate: 0.10 },
      { lower_bound: 17000, upper_bound: 64850, base_tax: 1700.00, marginal_rate: 0.12 },
      { lower_bound: 64850, upper_bound: 103350, base_tax: 7442.00, marginal_rate: 0.22 },
      { lower_bound: 103350, upper_bound: 197300, base_tax: 15912.00, marginal_rate: 0.24 },
      { lower_bound: 197300, upper_bound: 250525, base_tax: 38460.00, marginal_rate: 0.32 },
      { lower_bound: 250525, upper_bound: 626350, base_tax: 55492.00, marginal_rate: 0.35 },
      { lower_bound: 626350, upper_bound: null, base_tax: 187030.75, marginal_rate: 0.37 }
    ],
    "Married Filing Separately": [
      { lower_bound: 0, upper_bound: 11925, base_tax: 0, marginal_rate: 0.10 },
      { lower_bound: 11925, upper_bound: 48475, base_tax: 1192.50, marginal_rate: 0.12 },
      { lower_bound: 48475, upper_bound: 103350, base_tax: 5578.50, marginal_rate: 0.22 },
      { lower_bound: 103350, upper_bound: 197300, base_tax: 17651.00, marginal_rate: 0.24 },
      { lower_bound: 197300, upper_bound: 250525, base_tax: 40199.00, marginal_rate: 0.32 },
      { lower_bound: 250525, upper_bound: 375800, base_tax: 57231.00, marginal_rate: 0.35 },
      { lower_bound: 375800, upper_bound: null, base_tax: 101077.25, marginal_rate: 0.37 }
    ]
  },
  ssaWageBase: 184500,
  seTax: {
    baseFactor: 0.9235,
    ssRate: 0.124,
    medicareRate: 0.029
  }
};

function calcFederalIncomeTax2026(filingStatus: string, taxableIncomeAfterDeductions: number): number {
  const income = normalizeIncome(taxableIncomeAfterDeductions);
  if (income <= 0) return 0;

  const brackets = taxParams2026.brackets[filingStatus] || taxParams2026.brackets["Single"];

  for (let i = brackets.length - 1; i >= 0; i--) {
    if (income >= brackets[i].lower_bound) {
      const b = brackets[i];
      return b.base_tax + (income - b.lower_bound) * b.marginal_rate;
    }
  }

  return 0;
}

function calcSelfEmploymentTax(seIncome: number, filingStatus: string, w2Wages: number = 0): number {
  const income = normalizeIncome(seIncome);
  const w2 = normalizeIncome(w2Wages);
  if (income <= 0) return 0;

  const taxableSE = income * taxParams2026.seTax.baseFactor;

  const ssTaxable = Math.max(0, Math.min(taxableSE, taxParams2026.ssaWageBase - w2));
  const ssTax = ssTaxable * taxParams2026.seTax.ssRate;

  const medicareTax = taxableSE * taxParams2026.seTax.medicareRate;

  let threshold = 200000;
  if (filingStatus === "Married Filing Jointly") threshold = 250000;
  else if (filingStatus === "Married Filing Separately") threshold = 125000;

  const additionalMedicareTax = Math.max(0, taxableSE - threshold) * 0.009;

  return ssTax + medicareTax + additionalMedicareTax;
}

// ==========================================
// SCORING ENGINE
// ==========================================

export interface DiagnosticAnswers {
  filingStatus: string;
  incomeRange: string;
  taxesPaidRange: string;
  ownsBusiness: boolean;
  businessTaxType: string;
  businessProfitRange: string;
  subjectToSE: boolean;
  runningPayroll: boolean;
  contributesRetirement: boolean;
  strategyReviewed: boolean;
  usingAdvancedStrategies: boolean;
  ownsAssets: boolean;
  offersBenefits: boolean;
  highInsuranceCosts: boolean;
  developingIP: boolean;
  wealthRedirectPreference: string;
  ownerSalary: string;
}

export interface ScoringResult {
  score: number;
  confidence: string;
  financialImpact: {
    low: number;
    expected: number;
    high: number;
  };
  quadrants: Record<string, {
    score: number | null;
    status: string;
    opportunity: {
      low: number;
      expected: number;
      high: number;
    };
    findings: string[];
  }>;
  aiFlags: Record<string, any>;
  metrics: Record<string, any>;
}

const INCOME_MAP: Record<string, number> = {
  "Under $250,000": 200000,
  "$250,000 – $500,000": 375000,
  "$500,000 – $1M": 750000,
  "$1M – $3M": 2000000,
  "$3M – $10M": 6500000,
  "$10M+": 12000000,
};

const TAXES_PAID_MAP: Record<string, number> = {
  "Less than $75,000": 50000,
  "$75,000 – $150,000": 112000,
  "$150,000 – $300,000": 225000,
  "$300,000 – $600,000": 450000,
  "$600,000 – $1.2M": 900000,
  "More than $1.2M": 1500000,
  "I'm not sure": 0,
};

const PROFIT_MAP: Record<string, number> = {
  "Under $100,000": 50000,
  "$100,000 – $250,000": 175000,
  "$250,000 – $750,000": 500000,
  "$750,000 – $2M": 1375000,
  "$2M+": 3500000,
  "Not sure": 0,
};

const SALARY_MAP: Record<string, number> = {
  "$0": 0,
  "Under $50,000": 25000,
  "$50,000 – $150,000": 100000,
  "$150,000 – $300,000": 225000,
  "$300,000+": 450000,
  "Not applicable": 0,
};

export function runScoring(answers: DiagnosticAnswers): ScoringResult {
  const estIncome = normalizeIncome(INCOME_MAP[answers.incomeRange] || 200000);
  const estTaxesPaid = normalizeIncome(TAXES_PAID_MAP[answers.taxesPaidRange] || (estIncome * 0.35));

  const netProfit = PROFIT_MAP[answers.businessProfitRange] || 0;
  const ownerSalaryVal = SALARY_MAP[answers.ownerSalary] || 0;
  const salaryRatio = netProfit > 0 ? ownerSalaryVal / netProfit : 0;

  let entityPenalty = 0;
  let entityMismatch = false;
  let entitySeverity: "Low" | "Moderate" | "High" = "Low";
  let salaryIssue = false;
  let entityMessage = "";

  // Rule E1 & E2: Sole Prop Mismatch
  if (answers.businessTaxType === "Sole proprietor / Single-member LLC") {
    if (netProfit >= 750000) {
      entityPenalty += 35;
      entityMismatch = true;
      entitySeverity = "High";
      entityMessage = "At higher income levels, sole proprietorship structures often result in disproportionately high tax obligations compared to alternative entity strategies.";
    } else if (netProfit >= 250000) {
      entityPenalty += 20;
      entityMismatch = true;
      entitySeverity = "Moderate";
      entityMessage = "Your income level combined with your current business entity may indicate elevated self-employment tax exposure.";
    }
  }

  // Rule E3: S-Corp No Salary
  if (answers.businessTaxType === "S-Corporation" && ownerSalaryVal === 0) {
    entityPenalty += 15;
    salaryIssue = true;
    entityMismatch = true;
    entitySeverity = "Moderate";
    entityMessage = "S-Corporation structures typically require a reasonable owner salary for compliance and optimal tax positioning.";
  }

  // Rule E4: Salary Ratio Extremes
  if (answers.ownsBusiness && netProfit > 0) {
    if (salaryRatio < 0.05) {
      entityPenalty += 10;
      salaryIssue = true;
      entityMessage = entityMessage || "Your reported owner salary appears low relative to business profit, which may trigger efficiency or compliance flags.";
    } else if (salaryRatio > 0.60) {
      entityPenalty += 5;
      salaryIssue = true;
      entityMessage = entityMessage || "A high salary-to-profit ratio may be reducing the structural tax benefits available to your business entity.";
    }
  }

  const standardDeduction = taxParams2026.standardDeduction[answers.filingStatus] || 16100;
  const taxableIncomeAfterDeductions = Math.max(0, estIncome - standardDeduction);

  const baselineFedTax = calcFederalIncomeTax2026(answers.filingStatus, taxableIncomeAfterDeductions);
  const effectiveRate = baselineFedTax / estIncome;

  // Tax Drag Ratio
  const taxDragRatio = estTaxesPaid / estIncome;

  // Quadrant 1: Structure & Compensation Leak
  let q1Low = 0, q1Expected = 0, q1High = 0;
  const q1Cap = estTaxesPaid * 0.35;

  if (answers.subjectToSE && (answers.businessTaxType === "Sole proprietor / Single-member LLC" || answers.businessTaxType === "Partnership / Multi-member LLC")) {
    const baselineSETax = calcSelfEmploymentTax(estIncome * 0.85, answers.filingStatus);

    let shiftablePct = 0.25;
    if (!answers.runningPayroll) shiftablePct += 0.05;
    if (!answers.strategyReviewed) shiftablePct += 0.05;
    if (entityMismatch) shiftablePct += 0.10;

    q1Low = baselineSETax * Math.max(0.15, shiftablePct - 0.10);
    q1Expected = baselineSETax * shiftablePct;
    q1High = baselineSETax * Math.min(0.35, shiftablePct + 0.10);
  }

  q1Low = Math.min(q1Low, q1Cap);
  q1Expected = Math.min(q1Expected, q1Cap);
  q1High = Math.min(q1High, q1Cap);
  let q1Score: number | null = Math.round(100 * (1 - Math.min(q1Expected / q1Cap, 1)));
  q1Score = Math.max(0, q1Score - entityPenalty);

  if (!answers.subjectToSE ||
    (answers.businessTaxType !== "Sole proprietor / Single-member LLC" &&
     answers.businessTaxType !== "Partnership / Multi-member LLC")) {
    q1Score = null;
  }

  // Quadrant 2: Deduction System Leak
  let gapPct = 0.04;
  if (!answers.strategyReviewed) gapPct += 0.01;
  if (!answers.usingAdvancedStrategies) gapPct += 0.02;

  const deductionGapLow = estIncome * Math.max(0.01, gapPct - 0.02);
  const deductionGapExpected = estIncome * gapPct;
  const deductionGapHigh = estIncome * Math.min(0.07, gapPct + 0.02);

  const q2Cap = estTaxesPaid * 0.30;
  let q2Low = deductionGapLow * effectiveRate;
  let q2Expected = deductionGapExpected * effectiveRate;
  let q2High = deductionGapHigh * effectiveRate;

  q2Low = Math.min(q2Low, q2Cap);
  q2Expected = Math.min(q2Expected, q2Cap);
  q2High = Math.min(q2High, q2Cap);
  const q2Score = Math.round(100 * (1 - Math.min(q2Expected / q2Cap, 1)));

  // Quadrant 3: Asset & Depreciation Leak
  let q3Low = 0, q3Expected = 0, q3High = 0;
  const q3Cap = estTaxesPaid * 0.25;

  if (answers.ownsAssets) {
    const estAssetSpend = estIncome * 0.15;
    q3Low = estAssetSpend * 0.05 * effectiveRate;
    q3Expected = estAssetSpend * 0.10 * effectiveRate;
    q3High = estAssetSpend * 0.15 * effectiveRate;
  }

  q3Low = Math.min(q3Low, q3Cap);
  q3Expected = Math.min(q3Expected, q3Cap);
  q3High = Math.min(q3High, q3Cap);
  let q3Score: number | null = Math.round(100 * (1 - Math.min(q3Expected / q3Cap, 1)));

  if (!answers.ownsAssets) {
    q3Score = null;
  }

  // Quadrant 4: Wealth Vehicle Leak
  let vGapPct = 0.045;
  if (!answers.contributesRetirement) vGapPct += 0.02;
  if (!answers.usingAdvancedStrategies) vGapPct += 0.015;

  const vehicleGapLow = estIncome * Math.max(0.01, vGapPct - 0.03);
  const vehicleGapExpected = estIncome * vGapPct;
  const vehicleGapHigh = estIncome * Math.min(0.08, vGapPct + 0.03);

  const q4Cap = estTaxesPaid * 0.30;
  let q4Low = vehicleGapLow * effectiveRate;
  let q4Expected = vehicleGapExpected * effectiveRate;
  let q4High = vehicleGapHigh * effectiveRate;

  q4Low = Math.min(q4Low, q4Cap);
  q4Expected = Math.min(q4Expected, q4Cap);
  q4High = Math.min(q4High, q4Cap);
  const q4Score = Math.round(100 * (1 - Math.min(q4Expected / q4Cap, 1)));

  // Total Opportunity
  const totalLow = q1Low + q2Low + q3Low + q4Low;
  const totalExpected = q1Expected + q2Expected + q3Expected + q4Expected;
  const totalHigh = q1High + q2High + q3High + q4High;

  // Global Cap
  const finalExpected = Math.min(totalExpected, estTaxesPaid);
  const finalLow = Math.min(totalLow, finalExpected);
  const finalHigh = Math.min(totalHigh, estTaxesPaid);

  const leakRatio = finalExpected / estTaxesPaid;
  let score = Math.round(100 * (1 - Math.min(leakRatio, 1)));
  score = Math.max(0, score - (entityPenalty / 2));

  // Confidence Score
  let confidencePoints = 0;
  if (answers.incomeRange !== "Under $250,000") confidencePoints += 25;
  if (answers.taxesPaidRange !== "I'm not sure") confidencePoints += 25;
  if (answers.businessTaxType !== "Not sure") confidencePoints += 25;
  if (answers.subjectToSE !== false) confidencePoints += 25;

  if (answers.businessTaxType === "S-Corporation" && ownerSalaryVal === 0) confidencePoints -= 15;
  if (answers.ownsBusiness && (salaryRatio < 0.05 || salaryRatio > 0.60)) confidencePoints -= 10;
  if (answers.incomeRange !== "Under $250,000" && answers.businessTaxType === "Not sure") confidencePoints -= 15;

  const confidence = confidencePoints >= 75 ? "High" : confidencePoints >= 50 ? "Moderate" : "Low";

  const findingsStructure = `${answers.subjectToSE && !answers.runningPayroll ? "We identified potential self-employment tax exposure within your current structure. " : "Your income structure appears relatively stable based on the provided data. "}${answers.businessTaxType === "Sole proprietor / Single-member LLC" ? "The current entity selection may lack the advanced optimization layers available to more complex structures. " : "Your entity structure shows signs of intentional design. "}${!answers.runningPayroll ? "A lack of strategic payroll allocation suggests further refinement could improve efficiency." : "Active payroll systems are in place, providing a foundation for compensation optimization."}`;

  const findingsDeduction = `${!answers.usingAdvancedStrategies ? "Your profile indicates a reliance on standard deduction patterns rather than advanced capture strategies. " : "You are currently utilizing advanced strategies, which suggests a proactive approach to deduction capture. "}${!answers.strategyReviewed ? "The absence of a recent strategic review may be resulting in reactive tax behavior. " : "A recent strategy review indicates your systems are being monitored for efficiency. "}Integrating wealth-funding vehicles could further enhance your ability to legally minimize taxable income.`;

  const findingsAsset = `${answers.ownsAssets ? "Asset acquisition timing and depreciation schedules show signs of potential misalignment with optimal tax outcomes. " : "No significant asset-related leaks were detected based on your current holdings. "}Current expensing leverage appears to follow basic schedules, suggesting that more aggressive depreciation strategies could be evaluated to improve cash flow.`;

  const findingsWealthVehicle = `${!answers.contributesRetirement ? "Wealth-building vehicles appear under-leveraged relative to your income level. " : "Retirement funding is active, though its integration with your broader tax strategy remains a key area for review. "}The diagnostic suggests that additional tax-advantaged deferral mechanisms could be explored to better preserve liquidity and growth.`;

  return {
    score,
    confidence,
    financialImpact: {
      low: finalLow,
      expected: finalExpected,
      high: finalHigh,
    },
    quadrants: {
      structure: {
        score: q1Score,
        status: answers.ownsBusiness ? "Evaluated" : "Not Evaluated",
        opportunity: { low: q1Low, expected: q1Expected, high: q1High },
        findings: [findingsStructure],
      },
      deduction: {
        score: q2Score,
        status: "Evaluated",
        opportunity: { low: q2Low, expected: q2Expected, high: q2High },
        findings: [findingsDeduction],
      },
      asset: {
        score: q3Score,
        status: answers.ownsAssets ? "Evaluated" : "Not Evaluated",
        opportunity: { low: q3Low, expected: q3Expected, high: q3High },
        findings: [findingsAsset],
      },
      wealthVehicle: {
        score: q4Score,
        status: answers.contributesRetirement || answers.usingAdvancedStrategies ? "Evaluated" : "Insufficient Data",
        opportunity: { low: q4Low, expected: q4Expected, high: q4High },
        findings: [findingsWealthVehicle],
      },
    },
    aiFlags: {
      entityMismatch,
      entitySeverity,
      salaryIssue,
      entitySignal: entityMismatch ? {
        severity: entitySeverity,
        message: entityMessage,
      } : null,
    },
    metrics: {
      taxDragRatio,
      baselineFedTax,
      effectiveRate,
      estTaxesPaid,
      estIncome,
    },
  };
}

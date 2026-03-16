export interface TaxBracket {
  lower_bound: number;
  upper_bound: number | null;
  base_tax: number;
  marginal_rate: number;
}

export interface TaxParams {
  standardDeduction: {
    [key: string]: number;
  };
  brackets: {
    [key: string]: TaxBracket[];
  };
  ssaWageBase: number;
  seTax: {
    baseFactor: number;
    ssRate: number;
    medicareRate: number;
  };
}

export function normalizeIncome(value: any): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export const taxParams2026: TaxParams = {
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

export function calcFederalIncomeTax2026(filingStatus: string, taxableIncomeAfterDeductions: number): number {
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

export function calcSelfEmploymentTax(seIncome: number, filingStatus: string, w2Wages: number = 0): number {
  const income = normalizeIncome(seIncome);
  const w2 = normalizeIncome(w2Wages);
  if (income <= 0) return 0;

  const taxableSE = income * taxParams2026.seTax.baseFactor;
  
  // Social Security portion
  const ssTaxable = Math.max(0, Math.min(taxableSE, taxParams2026.ssaWageBase - w2));
  const ssTax = ssTaxable * taxParams2026.seTax.ssRate;
  
  // Medicare portion
  const medicareTax = taxableSE * taxParams2026.seTax.medicareRate;

  // Additional Medicare Tax (0.9%)
  let threshold = 200000;
  if (filingStatus === "Married Filing Jointly") threshold = 250000;
  else if (filingStatus === "Married Filing Separately") threshold = 125000;

  const additionalMedicareTax = Math.max(0, taxableSE - threshold) * 0.009;
  
  return ssTax + medicareTax + additionalMedicareTax;
}

export interface DiagnosticQuestion {
  id: string;
  q: string;
  options: string[];
  condition?: (answers: Record<string, any>) => boolean;
}

export const questions: DiagnosticQuestion[] = [
  { id: "filingStatus", q: "What's your tax filing status?", options: ["Single", "Married Filing Jointly", "Head of Household", "Married Filing Separately"] },
  { id: "incomeRange", q: "Which range best reflects your approximate annual income?", options: ["Under $250,000", "$250,000 – $500,000", "$500,000 – $1M", "$1M – $3M", "$3M – $10M", "$10M+"] },
  { id: "taxesPaidRange", q: "Approximately how much did you pay in total taxes last year?", options: ["Less than $75,000", "$75,000 – $150,000", "$150,000 – $300,000", "$300,000 – $600,000", "$600,000 – $1.2M", "More than $1.2M", "I'm not sure"] },
  { id: "ownsBusiness", q: "Do you own a business or businesses?", options: ["Yes", "No"] },
  { id: "businessTaxType", q: "How is your primary business taxed?", options: ["Sole proprietor / Single-member LLC", "Partnership / Multi-member LLC", "S-Corporation", "C-Corporation", "Not sure"], condition: (a) => a.ownsBusiness === "Yes" },
  { id: "businessProfitRange", q: "Which range best reflects your business's annual net profit?", options: ["Under $100,000", "$100,000 – $250,000", "$250,000 – $750,000", "$750,000 – $2M", "$2M+", "Not sure"], condition: (a) => a.ownsBusiness === "Yes" },
  { id: "subjectToSE", q: "Is any of your income subject to self-employment tax?", options: ["Yes", "No", "Not sure"] },
  { id: "runningPayroll", q: "Are you currently running payroll for yourself?", options: ["Yes", "No", "Not applicable"] },
  { id: "ownerSalary", q: "What is your approximate annual owner salary?", options: ["$0", "Under $50,000", "$50,000 – $150,000", "$150,000 – $300,000", "$300,000+", "Not applicable"], condition: (a) => a.ownsBusiness === "Yes" },
  { id: "contributesRetirement", q: "Do you actively contribute to retirement accounts?", options: ["Yes", "No"] },
  { id: "strategyReviewed", q: "Has your tax strategy been proactively reviewed in the last 12 months?", options: ["Yes", "No"] },
  { id: "usingAdvancedStrategies", q: "Are you currently using advanced tax-reduction strategies beyond standard deductions?", options: ["Yes", "No", "Not sure"] },
  { id: "ownsAssets", q: "Do you own investment or income-producing assets?", options: ["Yes", "No"] },
  { id: "offersBenefits", q: "If you have employees — do you offer benefits?", options: ["Yes", "No", "No employees"] },
  { id: "highInsuranceCosts", q: "Would you consider your insurance/protection costs high? (~$50k+)", options: ["Yes", "No", "Not sure"] },
  { id: "developingIP", q: "Does your business involve developing IP, systems, or processes?", options: ["Yes", "No", "Not sure"] },
  { id: "wealthRedirectPreference", q: "If you legally reduced your tax burden, where would you prefer that capital redirected?", options: ["Investments", "Asset acquisition", "Liquidity / cash flow", "Wealth preservation"] },
];

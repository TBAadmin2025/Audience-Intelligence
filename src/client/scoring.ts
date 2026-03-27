import { questions } from "./questions";
import { diagnosticConfig } from "./config";

export interface DiagnosticAnswers {
  [key: string]: string;
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

const DIMENSION_KEYS = ["audienceClarity", "decisionValidation", "behavioralEvidence", "messageAlignment"];

const EXPOSURE_PERCENT: Record<string, number> = {
  "80-100": 0.10,
  "60-79": 0.20,
  "40-59": 0.35,
  "20-39": 0.50,
  "0-19": 0.65,
};

function getExposurePercent(score: number): number {
  if (score >= 80) return EXPOSURE_PERCENT["80-100"];
  if (score >= 60) return EXPOSURE_PERCENT["60-79"];
  if (score >= 40) return EXPOSURE_PERCENT["40-59"];
  if (score >= 20) return EXPOSURE_PERCENT["20-39"];
  return EXPOSURE_PERCENT["0-19"];
}

function getInvestmentMidpoint(investmentLabel: string): number {
  const match = diagnosticConfig.investmentOptions.find(
    (opt) => opt.label === investmentLabel || opt.value === investmentLabel
  );
  return match?.midpoint || 7500;
}

function getQuestionScore(questionId: string, answer: string): number {
  const question = questions.find((q) => q.id === questionId);
  if (!question) return 1;
  const idx = question.options.indexOf(answer);
  if (idx === -1) return 1;
  return (question.scores || [1, 2, 3, 4])[idx] || 1;
}

export function runScoring(answers: DiagnosticAnswers): ScoringResult {
  // Score each question (1-4)
  const questionScores: Record<string, number> = {};
  let totalPoints = 0;

  for (const q of questions) {
    const score = getQuestionScore(q.id, answers[q.id] || "");
    questionScores[q.id] = score;
    totalPoints += score;
  }

  const totalPossible = 48;
  const overallScore = Math.round((totalPoints / totalPossible) * 100);

  // Dimension scores
  const dimensionScores: Record<string, number> = {};
  const dimensionQuestions: Record<string, string[]> = {
    audienceClarity: ["q1", "q2", "q3"],
    decisionValidation: ["q4", "q5", "q6"],
    behavioralEvidence: ["q7", "q8", "q9"],
    messageAlignment: ["q10", "q11", "q12"],
  };

  for (const dim of DIMENSION_KEYS) {
    const qIds = dimensionQuestions[dim];
    const dimTotal = qIds.reduce((sum, id) => sum + (questionScores[id] || 0), 0);
    dimensionScores[dim] = Math.round((dimTotal / 12) * 100);
  }

  // Investment & at-risk calculation
  const investmentMidpoint = getInvestmentMidpoint(answers.investmentSize || "");
  const exposurePercent = getExposurePercent(overallScore);
  const atRiskValue = Math.round(investmentMidpoint * exposurePercent);

  // Conservative/expected/aggressive breakdown
  const conservativeMultiplier = 0.70;
  const aggressiveMultiplier = 1.35;

  const financialImpact = {
    low: Math.round(atRiskValue * conservativeMultiplier),
    expected: atRiskValue,
    high: Math.round(atRiskValue * aggressiveMultiplier),
  };

  // Build quadrant results
  const quadrants: ScoringResult["quadrants"] = {};

  for (const dim of DIMENSION_KEYS) {
    const dimScore = dimensionScores[dim];
    const qIds = dimensionQuestions[dim];
    const findings = generateDimensionFindings(dim, qIds, questionScores, answers);

    quadrants[dim] = {
      score: dimScore,
      status: "Evaluated",
      opportunity: { low: 0, expected: 0, high: 0 },
      findings: [findings],
    };
  }

  // Decision readiness band
  const readinessBand = diagnosticConfig.readinessBand(overallScore);

  // Confidence = readiness band label
  const confidence = readinessBand;

  // Blind spot detection based on score + move type
  const blindSpots = detectBlindSpots(overallScore, dimensionScores, answers);

  return {
    score: overallScore,
    confidence,
    financialImpact,
    quadrants,
    aiFlags: {
      blindSpots,
      moveType: answers.moveType || "",
      expectedOutcome: answers.expectedOutcome || "",
      investmentSize: answers.investmentSize || "",
      readinessBand,
      exposurePercent: Math.round(exposurePercent * 100),
    },
    metrics: {
      totalPoints,
      totalPossible,
      dimensionScores,
      investmentMidpoint,
      atRiskValue,
      exposurePercent,
      questionScores,
    },
  };
}

function generateDimensionFindings(
  dimension: string,
  qIds: string[],
  questionScores: Record<string, number>,
  answers: DiagnosticAnswers
): string {
  const dimTotal = qIds.reduce((sum, id) => sum + (questionScores[id] || 0), 0);
  const dimScore = Math.round((dimTotal / 12) * 100);

  switch (dimension) {
    case "audienceClarity": {
      if (dimScore >= 80) return "Your audience definition shows strong specificity. You appear to understand who you\u2019re targeting, what they care about, and what drives them to act. This foundation supports confident decision-making on this move.";
      if (dimScore >= 60) return "You have a directional understanding of your audience, but there are gaps in specificity or validation. Some assumptions may be filling in where real-time signals should be guiding your decisions.";
      if (dimScore >= 40) return "Your audience definition lacks the precision needed for high-confidence decision-making. The current understanding may be too broad or based on outdated beliefs rather than current behavior patterns.";
      return "Your audience identification relies heavily on assumption rather than behavioral evidence. This significantly increases the risk that your next move misses its intended target.";
    }
    case "decisionValidation": {
      if (dimScore >= 80) return "This decision appears well-validated by real audience behavior and external feedback. The level of testing and validation you\u2019ve applied gives this move a strong evidence base.";
      if (dimScore >= 60) return "Some validation has been applied, but this decision may still carry assumptions that haven\u2019t been tested against real audience response. Gaps in external validation could lead to unexpected performance.";
      if (dimScore >= 40) return "This decision has limited external validation. Much of the reasoning appears to be based on internal opinion or past experience rather than current audience signals.";
      return "This decision has not been meaningfully validated with your audience. Moving forward without real-world testing significantly increases exposure to underperformance.";
    }
    case "behavioralEvidence": {
      if (dimScore >= 80) return "You\u2019re actively tracking and responding to behavioral signals from your audience. The quality of evidence guiding this decision is strong, including performance and revenue-linked data.";
      if (dimScore >= 60) return "You have some behavioral signals in place, but the depth of tracking may not be sufficient for high-stakes decisions. There may be audience behaviors you\u2019re not yet capturing or acting on.";
      if (dimScore >= 40) return "The signals guiding this decision are lightweight \u2014 primarily engagement-level metrics rather than conversion or behavioral patterns. This limits your ability to predict audience response.";
      return "There is minimal behavioral evidence informing this decision. Without active tracking of audience response patterns, this move is largely guided by instinct rather than data.";
    }
    case "messageAlignment": {
      if (dimScore >= 80) return "Your messaging appears closely aligned with how your audience thinks, speaks, and acts. The offer addresses an active problem with clear urgency and demand signals.";
      if (dimScore >= 60) return "There is partial alignment between your messaging and your audience\u2019s actual language and priorities. Some elements may be more brand-driven than audience-driven.";
      if (dimScore >= 40) return "Your messaging and offer may not fully reflect your audience\u2019s current priorities or language. The problem being addressed may lack urgency or relevance in the audience\u2019s perception.";
      return "Significant misalignment detected between your messaging and your audience\u2019s current reality. The offer may not address a problem your audience is actively trying to solve.";
    }
    default:
      return "Dimension analysis not available.";
  }
}

function detectBlindSpots(
  overallScore: number,
  dimensionScores: Record<string, number>,
  answers: DiagnosticAnswers
): { severity: string; message: string } | null {
  const moveType = answers.moveType || "";
  const weakestDim = Object.entries(dimensionScores).reduce((a, b) => a[1] < b[1] ? a : b);
  const weakestKey = weakestDim[0];
  const weakestScore = weakestDim[1];

  if (overallScore >= 80) return null;

  let severity = "Moderate";
  if (overallScore < 40) severity = "High";
  else if (overallScore < 60) severity = "Elevated";

  let message = "";

  if (moveType.includes("product") || moveType.includes("offer")) {
    if (weakestKey === "audienceClarity") {
      message = "You\u2019re preparing to launch without a precise understanding of who your audience is and what drives them. Product-market alignment depends on this clarity \u2014 without it, early traction is at risk.";
    } else if (weakestKey === "messageAlignment") {
      message = "Your messaging may not reflect how your audience actually thinks about the problem you\u2019re solving. For a new offer, this disconnect can suppress conversion from the start.";
    } else if (weakestKey === "decisionValidation") {
      message = "This offer concept appears to lack sufficient external validation. Launching without confirmed audience demand increases the risk of slow adoption.";
    } else {
      message = "Limited behavioral evidence means you may be building for an audience response you haven\u2019t yet confirmed. Signal gaps at launch stage carry compounding risk.";
    }
  } else if (moveType.includes("campaign") || moveType.includes("marketing")) {
    if (weakestKey === "behavioralEvidence") {
      message = "Your campaign targeting appears to lack strong behavioral signals. Without understanding how your audience currently responds to similar messaging, campaign spend efficiency is at risk.";
    } else if (weakestKey === "messageAlignment") {
      message = "Campaign messaging that doesn\u2019t mirror audience language and psychology tends to underperform. The gap between your brand voice and audience voice could reduce conversion efficiency.";
    } else {
      message = "Audience intelligence gaps in this area suggest your campaign may reach the right people with the wrong message \u2014 or the wrong people entirely. Both scenarios waste investment.";
    }
  } else if (moveType.includes("infrastructure") || moveType.includes("equipment")) {
    message = "Infrastructure investments assume sustained demand. If your audience understanding is incomplete, you may be building capacity for demand that doesn\u2019t materialize as expected \u2014 creating delayed ROI risk.";
  } else if (moveType.includes("Repositioning")) {
    message = "Repositioning without deep audience clarity risks creating more confusion, not less. Your audience needs to immediately understand the shift \u2014 gaps in understanding here can erode trust and differentiation.";
  } else if (moveType.includes("market") || moveType.includes("location")) {
    message = "Expanding into new territory without validated audience intelligence significantly increases exposure. What works in your current market may not translate \u2014 and the gaps in your current understanding amplify that risk.";
  } else {
    message = "Your current level of audience intelligence suggests gaps that could impact the performance of this decision. The areas with the weakest signals deserve attention before committing further resources.";
  }

  return { severity, message };
}

import { questions } from "./questions";
import { diagnosticConfig } from "./config";

export interface DiagnosticAnswers {
  [key: string]: string;
}

export interface ScoringResult {
  score: number;
  confidence: string;
  proceedRecommendation: string;
  proceedDetail: string;
  financialImpact: {
    low: number;
    expected: number;
    high: number;
  };
  quadrants: Record<string, {
    score: number;
    status: string;
    findings: string;
  }>;
  aiFlags: Record<string, any>;
  metrics: Record<string, any>;
}

const DIMENSION_KEYS = [
  "audienceClarity",
  "decisionValidation",
  "behavioralEvidence",
  "messageAlignment"
];

const DIMENSION_QUESTIONS: Record<string, string[]> = {
  audienceClarity: ["q1", "q2", "q3"],
  decisionValidation: ["q4", "q5", "q6"],
  behavioralEvidence: ["q7", "q8", "q9"],
  messageAlignment: ["q10", "q11", "q12"],
};

const DIMENSION_LABELS: Record<string, string> = {
  audienceClarity: "Audience Clarity",
  decisionValidation: "Evidence & Validation",
  behavioralEvidence: "Decision Inputs",
  messageAlignment: "Readiness & Risk",
};

function getExposurePercent(score: number): number {
  if (score >= 80) return 0.10;
  if (score >= 60) return 0.20;
  if (score >= 40) return 0.35;
  return 0.50;
}

function getSizeOfPrizeMidpoint(answer: string): number {
  if (answer.includes("Less than")) return 15000;
  if (answer.includes("25,000 – $100")) return 62500;
  if (answer.includes("100,000 – $500")) return 300000;
  if (answer.includes("500,000")) return 500000;
  return 62500;
}

function getProceedRecommendation(score: number): { label: string; detail: string } {
  if (score >= 80) return {
    label: "Proceed",
    detail: "Your intelligence foundation supports this move.",
  };
  if (score >= 60) return {
    label: "Proceed with Caution",
    detail: "Address key gaps before full commitment.",
  };
  if (score >= 40) return {
    label: "Pause & Validate",
    detail: "Critical gaps need attention before this move.",
  };
  return {
    label: "Rework",
    detail: "This decision needs a stronger audience foundation.",
  };
}

function getReadinessBand(score: number): string {
  if (score >= 80) return "Evidence-Based";
  if (score >= 60) return "Directionally Clear";
  if (score >= 40) return "Partially Informed";
  return "Assumption-Driven";
}

function getQuestionScore(questionId: string, answer: string): number {
  const question = questions.find((q) => q.id === questionId);
  if (!question) return 1;
  const idx = question.options.indexOf(answer);
  if (idx === -1) return 1;
  return (question.scores || [1, 2, 3, 4])[idx] || 1;
}

function generateDimensionFindings(
  dimension: string,
  score: number,
  answers: DiagnosticAnswers
): string {
  switch (dimension) {
    case "audienceClarity": {
      if (score >= 80) return "Your audience definition shows strong specificity. You understand who you're targeting, what they care about, and what drives them to act. This is a solid foundation for this move.";
      if (score >= 60) return "You have directional clarity on your audience, but there are gaps in specificity or validation. Some assumptions may be filling in where real-time signals should be guiding your decisions.";
      if (score >= 40) return "Your audience definition lacks the precision needed for high-confidence decision-making. The current understanding may be too broad or based on patterns that haven't been recently validated.";
      return "This move is being built for an audience that hasn't been clearly defined or validated. Without precision on who this is for and what they actually want, the risk of misalignment is significant.";
    }
    case "decisionValidation": {
      if (score >= 80) return "This decision appears well-grounded in real audience behavior and current signals. The level of validation applied gives this move a strong evidence base to build from.";
      if (score >= 60) return "Some validation has been applied, but this decision may still carry assumptions that haven't been tested against real audience response. Gaps in external validation could lead to unexpected performance.";
      if (score >= 40) return "This decision has limited external validation. Much of the reasoning appears to be based on internal opinion or past experience rather than current audience signals specifically gathered for this move.";
      return "This move has not been meaningfully validated with your audience. The insight informing it may be outdated or untested — which significantly increases exposure to underperformance.";
    }
    case "behavioralEvidence": {
      if (score >= 80) return "Audience intelligence is actively shaping this decision. The inputs driving this move go beyond internal opinion — real signals are informing the direction and structure of what you're building.";
      if (score >= 60) return "Some audience input has influenced this decision, but internal thinking and past patterns still carry significant weight. There may be behavioral signals you're not yet capturing or acting on.";
      if (score >= 40) return "This decision is primarily driven by internal perspective rather than audience intelligence. The gap between what your team believes and what your audience actually signals is a key risk factor here.";
      return "This move is largely internally driven. Without meaningful audience input shaping the decision, you're building on confidence rather than evidence — which compounds risk at every stage of execution.";
    }
    case "messageAlignment": {
      if (score >= 80) return "Demand signals for this move appear clear and active. Your audience shows readiness, and the confidence behind this move is grounded in validated understanding rather than assumption.";
      if (score >= 60) return "There are positive indicators of demand, but readiness hasn't been fully confirmed. Some elements of this move may land as expected while others encounter friction from unvalidated assumptions.";
      if (score >= 40) return "Demand for this move is assumed more than proven. The audience's readiness to respond hasn't been clearly established, which increases the likelihood of slower adoption or unexpected resistance.";
      return "There are significant gaps in demand validation for this move. The audience's readiness, timing, and receptiveness to what you're bringing forward haven't been established — creating elevated execution risk.";
    }
    default:
      return "Dimension analysis not available.";
  }
}

function detectBlindSpots(
  score: number,
  dimensionScores: Record<string, number>,
  answers: DiagnosticAnswers
): { severity: string; message: string } | null {
  if (score >= 80) return null;

  const moveType = answers.moveType || "";
  const weakest = Object.entries(dimensionScores)
    .reduce((a, b) => a[1] < b[1] ? a : b);
  const weakestKey = weakest[0];

  let severity = "Moderate";
  if (score < 40) severity = "High";
  else if (score < 60) severity = "Elevated";

  const moveMessages: Record<string, Record<string, string>> = {
    "Launching a new product or offer": {
      audienceClarity: "You're preparing to launch without a precise picture of who this is for. Product-market fit depends on this clarity — without it, early traction is at risk from day one.",
      decisionValidation: "This offer hasn't been sufficiently validated against real audience demand. Launching without confirmed readiness increases the risk of slow adoption and wasted launch spend.",
      behavioralEvidence: "The decision to launch appears to be primarily internally driven. Without real audience input shaping what you're bringing to market, you're betting on assumptions at the highest-stakes moment.",
      messageAlignment: "Demand for this offer hasn't been clearly established. Your audience's readiness to buy hasn't been confirmed — which is the single biggest risk factor at launch stage.",
    },
    "Planning or scaling a marketing campaign": {
      audienceClarity: "Campaign spend without audience precision is expensive. Without a sharp understanding of who you're targeting and what they need right now, you're optimizing creative for an audience you don't fully know.",
      decisionValidation: "This campaign is being built on signals that may not reflect current audience behavior. What worked before may not be what works now — and scaling spend amplifies that risk.",
      behavioralEvidence: "Internal thinking is driving this campaign more than audience intelligence. Message-audience mismatch is the leading cause of campaign underperformance — and it's hard to diagnose once you're already spending.",
      messageAlignment: "Demand for what this campaign is promoting hasn't been clearly validated. Campaigns that reach the right people with the wrong timing consistently underperform their potential.",
    },
    "Repositioning an existing offer or brand": {
      audienceClarity: "Repositioning without deep audience clarity risks creating confusion rather than clarity. Your audience needs to immediately understand the shift — and gaps in understanding here can erode trust you've already built.",
      decisionValidation: "This repositioning appears to be based on internal perspective rather than validated audience insight. How your audience currently perceives you may be different from how you intend to reposition.",
      behavioralEvidence: "The decision to reposition is primarily internally driven. Without clear audience signals confirming the need for this shift, you risk moving away from what's working without moving toward something proven.",
      messageAlignment: "The demand for your repositioned offer hasn't been clearly established. Repositioning into a space your audience isn't actively looking for amplifies the risk of the transition.",
    },
    "Investing in infrastructure, systems, or equipment": {
      audienceClarity: "Infrastructure investments assume sustained demand from a specific audience. If that audience isn't clearly understood, you may be building capacity for demand that doesn't materialize as expected.",
      decisionValidation: "This investment hasn't been sufficiently validated against real audience demand signals. Infrastructure built ahead of confirmed need creates delayed ROI risk that compounds over time.",
      behavioralEvidence: "This investment appears to be driven more by internal vision than audience demand signals. The gap between what you're building for and what your audience is actually pulling for is a key risk.",
      messageAlignment: "The demand that would justify this investment hasn't been clearly established. Building ahead of confirmed audience pull is one of the most common causes of underutilized infrastructure.",
    },
    "Expanding into a new market or location": {
      audienceClarity: "Expansion assumes your audience intelligence transfers. What you know about your current audience may not apply — and the gaps in that understanding amplify every risk that comes with entering new territory.",
      decisionValidation: "This expansion hasn't been sufficiently validated with the new audience you're entering. What works in your current market may face entirely different dynamics in a new one.",
      behavioralEvidence: "This expansion is primarily driven by internal confidence rather than validated new-market signals. New audiences require new intelligence — not extrapolation from existing patterns.",
      messageAlignment: "Demand in the new market hasn't been clearly established. Entering new territory without confirmed audience readiness creates compounding risk across every element of the expansion.",
    },
  };

  const moveKey = Object.keys(moveMessages).find(k =>
    moveType.toLowerCase().includes(k.toLowerCase().split(" ")[0])
  ) || "";

  const message = moveMessages[moveKey]?.[weakestKey] ||
    "Your current level of audience intelligence suggests gaps that could impact the performance of this decision. The areas with the weakest signals deserve attention before committing further resources.";

  return { severity, message };
}

export function runScoring(answers: DiagnosticAnswers): ScoringResult {
  const questionScores: Record<string, number> = {};
  let totalPoints = 0;

  for (const q of questions) {
    const score = getQuestionScore(q.id, answers[q.id] || "");
    questionScores[q.id] = score;
    totalPoints += score;
  }

  const totalPossible = 48;
  const overallScore = Math.round((totalPoints / totalPossible) * 100);

  const dimensionScores: Record<string, number> = {};
  for (const dim of DIMENSION_KEYS) {
    const qIds = DIMENSION_QUESTIONS[dim];
    const dimTotal = qIds.reduce((sum, id) => sum + (questionScores[id] || 0), 0);
    dimensionScores[dim] = Math.round((dimTotal / 12) * 100);
  }

  const sizeOfPrizeMidpoint = getSizeOfPrizeMidpoint(answers.sizeOfPrize || "");
  const exposurePercent = getExposurePercent(overallScore);
  const atRiskValue = Math.round(sizeOfPrizeMidpoint * exposurePercent);

  const financialImpact = {
    low: Math.round(atRiskValue * 0.70),
    expected: atRiskValue,
    high: Math.round(atRiskValue * 1.35),
  };

  const readinessBand = getReadinessBand(overallScore);
  const proceed = getProceedRecommendation(overallScore);
  const blindSpots = detectBlindSpots(overallScore, dimensionScores, answers);

  const quadrants: ScoringResult["quadrants"] = {};
  for (const dim of DIMENSION_KEYS) {
    quadrants[dim] = {
      score: dimensionScores[dim],
      status: "Evaluated",
      findings: generateDimensionFindings(dim, dimensionScores[dim], answers),
    };
  }

  return {
    score: overallScore,
    confidence: readinessBand,
    proceedRecommendation: proceed.label,
    proceedDetail: proceed.detail,
    financialImpact,
    quadrants,
    aiFlags: {
      blindSpots,
      moveType: answers.moveType || "",
      sizeOfPrize: answers.sizeOfPrize || "",
      biggestConcern: answers.biggestConcern || "",
      readinessBand,
      exposurePercent: Math.round(exposurePercent * 100),
      proceedRecommendation: proceed.label,
    },
    metrics: {
      totalPoints,
      totalPossible,
      dimensionScores,
      dimensionLabels: DIMENSION_LABELS,
      sizeOfPrizeMidpoint,
      atRiskValue,
      exposurePercent,
      questionScores,
    },
  };
}

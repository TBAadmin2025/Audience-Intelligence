export interface DiagnosticQuestion {
  id: string;
  q: string;
  options: string[];
  dimension?: string;
  scores?: number[];
  condition?: (answers: Record<string, any>) => boolean;
}

export interface ContextQuestion {
  id: string;
  q: string;
  options: string[];
}

// 12 scored questions — each option maps to score 1-4 (index + 1)
export const questions: DiagnosticQuestion[] = [
  // DIMENSION 1: Audience Clarity (Q1-Q3)
  {
    id: "q1",
    dimension: "audienceClarity",
    q: "How clearly can you identify the specific audience for this decision?",
    scores: [1, 2, 3, 4],
    options: [
      "Broad or undefined (\u201Cbusiness owners\u201D, \u201Cwomen\u201D, etc.)",
      "Some segmentation, but still generalized",
      "Defined audience with some specificity",
      "Highly specific, behavior-based audience",
    ],
  },
  {
    id: "q2",
    dimension: "audienceClarity",
    q: "How well do you understand what this audience actually cares about right now?",
    scores: [1, 2, 3, 4],
    options: [
      "Assumptions or outdated beliefs",
      "Some insight, not consistently validated",
      "Based on recent interactions or feedback",
      "Continuously informed by real-time signals",
    ],
  },
  {
    id: "q3",
    dimension: "audienceClarity",
    q: "How confident are you in what motivates this audience to take action?",
    scores: [1, 2, 3, 4],
    options: [
      "Guessing or projecting",
      "Based on past experience, not current validation",
      "Some validated patterns",
      "Clear, tested understanding of triggers",
    ],
  },

  // DIMENSION 2: Decision Validation (Q4-Q6)
  {
    id: "q4",
    dimension: "decisionValidation",
    q: "Have you tested or validated this specific idea before committing to it?",
    scores: [1, 2, 3, 4],
    options: [
      "No validation",
      "Informal or internal validation",
      "Limited external validation",
      "Clear validation from real audience behavior",
    ],
  },
  {
    id: "q5",
    dimension: "decisionValidation",
    q: "What level of real-world feedback has informed this decision?",
    scores: [1, 2, 3, 4],
    options: [
      "Internal opinions only",
      "Anecdotal or scattered feedback",
      "Structured feedback from audience",
      "Clear patterns from multiple data sources",
    ],
  },
  {
    id: "q6",
    dimension: "decisionValidation",
    q: "How much of this decision is based on what has worked before vs what is working now?",
    scores: [1, 2, 3, 4],
    options: [
      "Mostly past assumptions",
      "Some recent data, mostly historical",
      "Mix of past + current signals",
      "Primarily driven by current audience behavior",
    ],
  },

  // DIMENSION 3: Behavioral Evidence (Q7-Q9)
  {
    id: "q7",
    dimension: "behavioralEvidence",
    q: "What signals are you using to guide this decision?",
    scores: [1, 2, 3, 4],
    options: [
      "Gut instinct or internal discussion",
      "Light metrics (engagement, likes, etc.)",
      "Conversion or performance indicators",
      "Strong behavioral + revenue-linked signals",
    ],
  },
  {
    id: "q8",
    dimension: "behavioralEvidence",
    q: "How closely are you tracking how your audience is currently responding to similar offers/messages?",
    scores: [1, 2, 3, 4],
    options: [
      "Not tracking",
      "Occasional observation",
      "Regular tracking",
      "Actively analyzing and adjusting based on data",
    ],
  },
  {
    id: "q9",
    dimension: "behavioralEvidence",
    q: "How often do you uncover surprises about your audience behavior?",
    scores: [1, 2, 3, 4],
    options: [
      "Rarely \u2014 we assume we already know",
      "Occasionally",
      "Regularly learning new insights",
      "Constantly refining understanding based on new behavior",
    ],
  },

  // DIMENSION 4: Message & Offer Alignment (Q10-Q12)
  {
    id: "q10",
    dimension: "messageAlignment",
    q: "How confident are you that your messaging reflects how your audience actually thinks and speaks?",
    scores: [1, 2, 3, 4],
    options: [
      "Internally created messaging",
      "Some alignment, but mostly brand-driven",
      "Reflects some real audience language",
      "Directly mirrors audience voice and psychology",
    ],
  },
  {
    id: "q11",
    dimension: "messageAlignment",
    q: "How well does this decision solve a problem your audience is actively trying to fix?",
    scores: [1, 2, 3, 4],
    options: [
      "Not clearly tied to a real problem",
      "General problem, not urgent",
      "Relevant problem with some urgency",
      "Clear, active, high-priority problem",
    ],
  },
  {
    id: "q12",
    dimension: "messageAlignment",
    q: "How confident are you that your audience is ready to act on this right now?",
    scores: [1, 2, 3, 4],
    options: [
      "No urgency or timing validation",
      "Assumed readiness",
      "Some signals of readiness",
      "Strong evidence of demand or timing",
    ],
  },
];

// Context questions — shown on dedicated screen after Q12, before processing
export const contextQuestions: ContextQuestion[] = [
  {
    id: "moveType",
    q: "What kind of move are you making right now?",
    options: [
      "Launching a new product or offer",
      "Planning a marketing campaign",
      "Repositioning an existing offer",
      "Investing in equipment or infrastructure",
      "Building or refining a platform / technology",
      "Expanding into a new market or location",
    ],
  },
  {
    id: "expectedOutcome",
    q: "What outcome are you expecting from this?",
    options: [
      "Increase revenue quickly",
      "Improve conversion/performance",
      "Expand into a new audience",
      "Strengthen positioning/brand",
      "Fix something that isn\u2019t working",
    ],
  },
];

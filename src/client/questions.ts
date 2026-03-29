import type { DiagnosticAnswers } from "./scoring";

export interface Question {
  id: string;
  q: string;
  options: string[];
  scores: number[];
  dimension: string;
}

export interface ContextQuestion {
  id: string;
  q: string;
  subtext?: string;
  options: string[];
  freeText?: boolean;
}

export const questions: Question[] = [
  // DIMENSION 1 — Audience Clarity
  {
    id: "q1",
    q: "Who is this move actually for?",
    options: [
      "A broad or general audience",
      "A somewhat defined group",
      "A clearly defined audience",
      "A highly specific group based on real buyers or behavior",
    ],
    scores: [1, 2, 3, 4],
    dimension: "audienceClarity",
  },
  {
    id: "q2",
    q: "How confident are you that you understand what this audience actually wants right now?",
    options: [
      "Not confident",
      "Somewhat confident",
      "Confident",
      "Very confident based on recent insight",
    ],
    scores: [1, 2, 3, 4],
    dimension: "audienceClarity",
  },
  {
    id: "q3",
    q: "How clearly do you understand what would make this audience say yes — or ignore this completely?",
    options: [
      "Not clearly",
      "Somewhat clearly",
      "Fairly clearly",
      "Very clearly based on real patterns or proof",
    ],
    scores: [1, 2, 3, 4],
    dimension: "audienceClarity",
  },

  // DIMENSION 2 — Evidence & Validation
  {
    id: "q4",
    q: "What makes you believe this audience is ready for this move right now?",
    options: [
      "Nothing concrete — it feels like the right time",
      "Past experience or assumptions that have worked before",
      "Some recent signals that suggest readiness",
      "Clear, current evidence of demand or timing",
    ],
    scores: [1, 2, 3, 4],
    dimension: "decisionValidation",
  },
  {
    id: "q5",
    q: "How recent is the audience insight informing this decision?",
    options: [
      "Outdated or unclear — I'm not sure when I last validated this",
      "Based on older results that I believe still apply",
      "Some recent input from conversations or feedback",
      "Current, active signals I've collected specifically for this move",
    ],
    scores: [1, 2, 3, 4],
    dimension: "decisionValidation",
  },
  {
    id: "q6",
    q: "Have you seen any real-world indication that this move will work before fully committing to it?",
    options: [
      "No — we're moving forward based on the strength of the idea",
      "Very limited — mostly internal validation",
      "Some indication from early conversations or testing",
      "Yes — clear validation from real audience behavior",
    ],
    scores: [1, 2, 3, 4],
    dimension: "decisionValidation",
  },

  // DIMENSION 3 — Decision Inputs
  {
    id: "q7",
    q: "What is primarily driving this decision?",
    options: [
      "Gut instinct and pattern recognition",
      "Internal ideas or team opinions",
      "A mix of instinct and some audience input",
      "Clear audience insight and current market signals",
    ],
    scores: [1, 2, 3, 4],
    dimension: "behavioralEvidence",
  },
  {
    id: "q8",
    q: "How much of this move has been shaped by real audience input rather than internal assumptions?",
    options: [
      "Very little — this is mostly internally driven",
      "Some — we've incorporated a little audience feedback",
      "A meaningful amount — audience input has shaped key elements",
      "Most of it — audience intelligence is central to how this was built",
    ],
    scores: [1, 2, 3, 4],
    dimension: "behavioralEvidence",
  },
  {
    id: "q9",
    q: "When making decisions like this, how often do you rely on what worked before instead of confirming what will work now?",
    options: [
      "Almost always — our past success is our best guide",
      "Often — we lean on experience more than current research",
      "Sometimes — we try to balance past experience with current signals",
      "Rarely — we actively validate before assuming past patterns still apply",
    ],
    scores: [1, 2, 3, 4],
    dimension: "behavioralEvidence",
  },

  // DIMENSION 4 — Readiness & Risk
  {
    id: "q10",
    q: "How clear is the demand for this move right now?",
    options: [
      "Unclear — we're betting on creating demand",
      "Assumed more than proven — we believe the demand is there",
      "Some indication of demand from signals we've observed",
      "Clear demand is already visible and active",
    ],
    scores: [1, 2, 3, 4],
    dimension: "messageAlignment",
  },
  {
    id: "q11",
    q: "If this launched today, how confident are you that it would land with the right audience?",
    options: [
      "Not confident — there are too many unknowns",
      "Somewhat confident — we think it will work but aren't certain",
      "Confident — we have good reason to believe this will resonate",
      "Very confident — based on validated audience understanding",
    ],
    scores: [1, 2, 3, 4],
    dimension: "messageAlignment",
  },
  {
    id: "q12",
    q: "If this move underperformed, how likely is it that the problem would trace back to audience misalignment?",
    options: [
      "Very likely — we know our audience understanding has gaps",
      "Somewhat likely — there are areas we haven't fully validated",
      "Slightly likely — we feel reasonably confident in our audience read",
      "Unlikely — we have strong audience intelligence backing this move",
    ],
    scores: [1, 2, 3, 4],
    dimension: "messageAlignment",
  },
];

export const contextQuestions: ContextQuestion[] = [
  {
    id: "moveType",
    q: "What type of move are you making right now?",
    options: [
      "Launching a new product or offer",
      "Planning or scaling a marketing campaign",
      "Repositioning an existing offer or brand",
      "Investing in infrastructure, systems, or equipment",
      "Expanding into a new market or location",
    ],
  },
  {
    id: "sizeOfPrize",
    q: "What does your business expect to generate from this move?",
    subtext: "This is not what you're spending — this is the revenue or value you expect this move to produce.",
    options: [
      "Less than $25,000",
      "$25,000 – $100,000",
      "$100,000 – $500,000",
      "$500,000+",
    ],
  },
  {
    id: "biggestConcern",
    q: "What is your biggest concern about this move right now?",
    subtext: "Optional — but the more specific you are, the more tailored your readout will be.",
    options: [],
    freeText: true,
  },
];

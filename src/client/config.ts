export const diagnosticConfig = {
  brand: {
    appName: "DEANAR",
    logoUrl: "",
    faviconUrl: "https://plamaotwavcwxtqwenaf.supabase.co/storage/v1/object/public/brand-assets/24605d59-6de7-48d2-b31c-44af447f6598/1771939635798_DEANAR_Motif_01_structural_logic.png",
    primaryColor: "#24201E",
    accentColor: "#B89F82",
    accentSecondary: "#6E1618",
    backgroundColor: "#F0EDE6",
    surfaceColor: "#FFFFFF",
    textPrimary: "#24201E",
    textMuted: "rgba(36, 32, 30, 0.6)",
    headingFont: '"Cormorant Garamond", serif',
    bodyFont: '"Montserrat", sans-serif',
    vibe: "luxury" as const,
    colors: {
      paper: "#F0EDE6",
      greige: "#D6CEC4",
      camel: "#B89F82",
      crimson: "#6E1618",
      oxblood: "#3D0C0D",
      graphite: "#24201E",
    },
    motifs: {
      structuralLogic: "https://plamaotwavcwxtqwenaf.supabase.co/storage/v1/object/public/brand-assets/24605d59-6de7-48d2-b31c-44af447f6598/1771939635798_DEANAR_Motif_01_structural_logic.png",
      executivePolish: "https://plamaotwavcwxtqwenaf.supabase.co/storage/v1/object/public/brand-assets/24605d59-6de7-48d2-b31c-44af447f6598/1771939636568_DEANAR_Motif_02_executive_polish.png",
      abstractSignals: "https://plamaotwavcwxtqwenaf.supabase.co/storage/v1/object/public/brand-assets/24605d59-6de7-48d2-b31c-44af447f6598/1771939637282_DEANAR_Motif_03_abstract_signals.png",
      theBigBet: "https://plamaotwavcwxtqwenaf.supabase.co/storage/v1/object/public/brand-assets/24605d59-6de7-48d2-b31c-44af447f6598/1771939638605_DEANAR_Motif_05_the_big_bet.png",
      intersections: "https://plamaotwavcwxtqwenaf.supabase.co/storage/v1/object/public/brand-assets/24605d59-6de7-48d2-b31c-44af447f6598/1771939639236_DEANAR_Motif_06_intersections.png",
    },
  },

  copy: {
    diagnosticName: "Audience Intelligence Diagnostic\u2122",
    scoreName: "Audience Intelligence Score\u2122",
    derivedMetric: "At-Risk Investment Value\u2122",
    introHeadline: "Audience Intelligence Diagnostic",
    introSubheadline: "Before you commit to your next move, find out whether your decision is backed by real audience intelligence \u2014 or built on assumption.",
    tabs: {
      summary: "Your Readout",
      breakdown: "Dimension Breakdown",
      action: "Fix My Audience Intelligence",
    },
    ctaButtonText: "Fix My Audience Intelligence",
    ctaHeadline: "Close the Gap.",
    ctaSubheadline: "Your diagnostic results reveal gaps in audience intelligence that could impact this decision. Get clear on what your audience is actually signaling before you move forward.",
  },

  investmentOptions: [
    { label: "Less than $10,000", value: "Under $10K", midpoint: 7500 },
    { label: "$10,000\u2013$50,000", value: "$10K\u2013$50K", midpoint: 30000 },
    { label: "$50,000\u2013$150,000", value: "$50K\u2013$150K", midpoint: 100000 },
    { label: "$150,000\u2013$500,000", value: "$150K\u2013$500K", midpoint: 325000 },
    { label: "$500,000+", value: "$500K+", midpoint: 500000 },
  ],

  processingSteps: [
    { heading: "Mapping Decision Landscape", sub: "Analyzing your strategic context\u2026" },
    { heading: "Evaluating Audience Signals", sub: "Scanning behavioral evidence patterns\u2026" },
    { heading: "Calculating Intelligence Gaps", sub: "Identifying assumption vs. validated insight\u2026" },
    { heading: "Modeling Investment Exposure", sub: "Estimating at-risk value against decision type\u2026" },
    { heading: "Generating Your Readout", sub: "Synthesizing strategic interpretation\u2026" },
  ],

  scoreInterpretation: (score: number): string => {
    if (score >= 80) return "Your decisions appear to be grounded in validated audience understanding. Proceed with confidence \u2014 and maintain that intelligence edge.";
    if (score >= 60) return "You have directional clarity, but gaps in audience validation could weaken performance on this move.";
    if (score >= 40) return "Your decision is partially informed. Expect inconsistency in outcomes without stronger audience intelligence.";
    return "This move is being shaped more by assumption than evidence. The risk to your investment is elevated.";
  },

  readinessBand: (score: number): string => {
    if (score >= 80) return "Evidence-Based";
    if (score >= 60) return "Directionally Clear";
    if (score >= 40) return "Partially Informed";
    return "Assumption-Driven";
  },

  vsl: {
    videoUrl: "",
    headline: "You\u2019ve Seen the Gaps.",
    subheadline: "Get clear on what your audience is actually signaling before you move forward with this decision.",
    bookingButtonText: "Book Your Decision Intelligence Debrief",
    bookingButtonMicrocopy: "A focused session to close the intelligence gaps revealed in your diagnostic.",
    calendarUrl: "https://links.quietwealthengine.com/widget/booking/y6sWQKcR4X62dJqD71ol",
    callName: "Decision Intelligence Debrief",
    offerSectionHeading: "What Happens Inside Your Decision Intelligence Debrief",
    offerBlocks: [
      { title: "Review Your Score & Decision Readiness", description: "Walk through your Audience Intelligence Score and what it reveals about your current decision readiness." },
      { title: "Break Down Your Specific Move", description: "Examine the exact decision you\u2019re preparing for and identify where assumption may be replacing real audience insight." },
      { title: "Surface Critical Intelligence Gaps", description: "Pinpoint the specific gaps in audience understanding that could impact performance on this move." },
      { title: "Clarify What Needs to Be Known", description: "Leave with a clear picture of what audience intelligence is missing and what needs to be addressed before moving forward." },
    ],
    ifWeWorkTogether: {
      heading: "If We Decide to Work Together",
      body: "If it\u2019s clear that your business is preparing for a meaningful move and there are critical gaps in audience understanding, the next step is a deeper engagement \u2014 a structured process designed to extract the real audience intelligence behind your decision.",
      bullets: [
        "A deeper audience intelligence extraction process tied to your specific business move",
        "Clear insight into what your audience actually needs, values, expects, and responds to",
        "Identification of the blind spots, disconnects, and assumptions weakening your current direction",
        "A structured breakdown of the audience signals that should inform your next move",
        "Decision-grade insight to guide your launch, campaign, investment, or expansion strategy",
      ],
    },
    qualifierHeading: "Who This Is For",
    qualifierBullets: [
      "Preparing for a launch, campaign, or strategic move",
      "Making a meaningful financial or operational investment",
      "Looking to reduce risk before committing more time, money, or resources",
    ],
    investmentContext: "Most businesses moving into this work are preparing for decisions in the $25K\u2013$250K+ range and want to ensure those decisions are grounded in real audience insight.",
    finalCtaHeading: "Ready to See What Your Audience Is Actually Signaling?",
    finalCtaButtonText: "Book Your Decision Intelligence Debrief",
    finalCtaMicrocopy: "We\u2019ll walk through your results and clarify what needs to be addressed before your next move.",
  },

  preQual: {
    intro: "This session is designed for businesses preparing to make a meaningful strategic move and looking to ensure their decisions are grounded in real audience intelligence. To make sure this is the right fit, please answer the following questions.",
    questions: [
      {
        question: "Are you currently preparing to make a strategic move in your business?",
        type: "yesno" as const,
        options: [
          { label: "Yes \u2014 within the next 30 days", value: "Yes \u2014 within the next 30 days" },
          { label: "Yes \u2014 within the next 60\u201390 days", value: "Yes \u2014 within the next 60\u201390 days" },
          { label: "Not immediately, but actively planning", value: "Not immediately, but actively planning" },
          { label: "No active plans right now", value: "No active plans right now" },
        ],
      },
      {
        question: "What type of decision are you preparing for?",
        type: "yesno" as const,
        options: [
          { label: "Launching a new product or offer", value: "Launching a new product or offer" },
          { label: "Planning or scaling a marketing campaign", value: "Planning or scaling a marketing campaign" },
          { label: "Repositioning an existing offer", value: "Repositioning an existing offer" },
          { label: "Investing in infrastructure, systems, or equipment", value: "Investing in infrastructure, systems, or equipment" },
          { label: "Expanding into a new market or location", value: "Expanding into a new market or location" },
        ],
      },
      {
        question: "What level of investment is associated with this decision?",
        type: "yesno" as const,
        options: [
          { label: "Less than $10,000", value: "Less than $10,000" },
          { label: "$10,000\u2013$50,000", value: "$10,000\u2013$50,000" },
          { label: "$50,000\u2013$150,000", value: "$50,000\u2013$150,000" },
          { label: "$150,000+", value: "$150,000+" },
        ],
      },
      {
        question: "If this session identifies gaps that could impact the outcome of your decision, is a minimum $7,500 investment feasible for you right now?",
        type: "yesno" as const,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ],
      },
      {
        question: "If it becomes clear that your current direction is missing critical audience insight, are you prepared to address it?",
        type: "yesno" as const,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ],
      },
      {
        question: "What is your biggest concern about this decision right now?",
        type: "text" as const,
      },
    ],
  },

  ghl: {
    fieldKeys: {
      overallScore: "diagnostic_overall_score" as const,
      financialImpact: "diagnostic_financial_impact" as const,
      commentary: "diagnostic_commentary" as const,
      reportUrl: "diagnostic_report_url" as const,
      completedDate: "diagnostic_completed_date" as const,
      prequalAnswers: "diagnostic_prequal_answers" as const,
    },
    tags: {
      started: "diagnostic-started" as const,
      completed: "diagnostic-completed" as const,
    },
  },

  quadrants: [
    { key: "audienceClarity", name: "Audience Clarity", description: "Measures how specifically you\u2019ve defined your target audience and how well you understand their current priorities and motivations." },
    { key: "decisionValidation", name: "Decision Validation", description: "Evaluates whether this decision has been tested or validated with real audience behavior rather than internal assumptions." },
    { key: "behavioralEvidence", name: "Behavioral Evidence", description: "Assesses the quality of signals you\u2019re using to guide this decision and how actively you\u2019re tracking audience response." },
    { key: "messageAlignment", name: "Message & Offer Alignment", description: "Measures how closely your messaging reflects audience psychology and whether your offer solves a problem your audience is actively trying to fix." },
  ],
};

export const diagnosticConfig = {
  brand: {
    appName: "Vlari",
    logoUrl: "https://plamaotwavcwxtqwenaf.supabase.co/storage/v1/object/public/brand-assets/6b2e7cf1-13d3-4f90-a083-47644dbc2c4e/1771943769366_Vlari_Motif_20260224_0933.png",
    faviconUrl: "https://assets.cdn.filesafe.space/5acTuTfeFkOQRwxAXWLx/media/69c164995d249694869a72d9.png",
    primaryColor: "#0A111F",
    accentColor: "#D4AF37",
    accentSecondary: "#AA7C11",
    backgroundColor: "#0A111F",
    surfaceColor: "#161618",
    textPrimary: "#EBE6DF",
    textMuted: "rgba(235, 230, 223, 0.5)",
    headingFont: '"Cormorant Garamond", serif',
    bodyFont: '"Inter", ui-sans-serif, system-ui, sans-serif',
    vibe: "luxury" as const,
  },

  copy: {
    introHeadline: "Wealth Redirection Diagnostic",
    introSubheadline: "This diagnostic will show you how your income is currently taxed— and where opportunities may exist to retain more of that capital and redirect it into assets you own.",
    tabs: {
      summary: "Your Summary",
      breakdown: "Breakdown",
      action: "Redirect My Wealth",
    },
    ctaButtonText: "Improve My Structure",
    ctaHeadline: "Redirect Your Wealth.",
    ctaSubheadline: "Your diagnostic results reveal significant opportunities. Now let's build a tactical strategy to capture them. Book a complimentary 30-minute strategy session.",
  },

  vsl: {
    videoUrl: "https://assets.cdn.filesafe.space/5acTuTfeFkOQRwxAXWLx/media/69c14a17b0d6d740ee237f71.mp4",
    headline: "You've Seen the Numbers.",
    subheadline: "Identify your highest-leverage opportunity—and activate it immediately.",
    bookingButtonText: "Schedule Your Wealth Redirection Session",
    bookingButtonMicrocopy: "A complimentary strategy session to determine your highest-impact opportunity.",
    calendarUrl: "https://links.quietwealthengine.com/widget/booking/fA95vEUfzE9zbdjRnefn",
    offerSectionHeading: "What Happens Inside Your Wealth Redirection Activation",
    offerBlocks: [
      { title: "Full Strategic Analysis", description: "We go beyond the diagnostic and evaluate your complete financial structure— including income flow, tax exposure, entity design, and wealth positioning." },
      { title: "Identify the Highest-Leverage Opportunity", description: "We isolate the single most impactful move available to you— the one that creates the greatest financial shift with the least disruption." },
      { title: "Immediate Activation Strategy", description: "You don\u2019t leave with theory. You leave with a clear, executable plan that can be implemented right away— either with your CPA or through coordinated support." },
      { title: "Designed for Real Financial Impact", description: "This is not about small adjustments. This is about restructuring how your income works— so you can begin retaining and redirecting more of your capital." },
    ],
    whyMattersHeading: "Why This Conversation Matters",
    whyMattersBody: "Most high earners are operating within compliant systems— but not optimized ones. That gap is where significant financial opportunity often exists. This session is designed to determine:",
    whyMattersBullets: [
      "Whether those opportunities exist in your current structure",
      "What your highest-impact move would be",
      "And whether it makes sense to move forward",
    ],
    qualifierHeading: "This is best suited for individuals who:",
    qualifierBullets: [
      "Have experienced a six-figure tax liability",
      "Have established income or business revenue",
      "Are ready to move beyond basic tax preparation into strategy",
    ],
    finalCtaHeading: "Ready to See What's Possible?",
    finalCtaButtonText: "Book Your Wealth Redirection Session",
    finalCtaMicrocopy: "We'll walk through your results and identify your highest-impact next move.",
  },

  preQual: {
    intro: "This strategy session is designed for high-income earners and business owners who are ready to move beyond basic tax compliance into structured wealth redirection. To make sure this is the right fit before we get on a call, please answer the following questions honestly.",
    questions: [
      {
        question: "Have you had a federal tax liability of $250,000 or more in the last 12 months?",
        type: "yesno" as const,
        options: [
          { label: "Yes — my tax bill has been $250K or more", value: "Yes — my tax bill has been $250K or more" },
          { label: "No — I'm not at that level yet", value: "No — I'm not at that level yet" },
        ],
      },
      {
        question: "Are you currently working with a CPA or tax professional?",
        type: "yesno" as const,
        options: [
          { label: "Yes — I have a CPA handling my taxes", value: "Yes — I have a CPA handling my taxes" },
          { label: "No — I'm not currently working with one", value: "No — I'm not currently working with one" },
        ],
      },
      {
        question: "If we identify a strategy that could significantly reduce your tax liability and redirect those savings into wealth-building vehicles you own — is an investment of $10,000 to make that happen feasible for you right now?",
        type: "yesno" as const,
        options: [
          { label: "Yes — that's a feasible investment for the right outcome", value: "Yes — that's a feasible investment for the right outcome" },
          { label: "No — I'm not in a position to invest at that level right now", value: "No — I'm not in a position to invest at that level right now" },
        ],
      },
      {
        question: "What specific questions do you need answered on this call in order to feel confident moving forward?",
        type: "text" as const,
      },
      {
        question: "If all of your questions are answered and you feel this is the right fit — are you prepared to make a decision on the call?",
        type: "yesno" as const,
        options: [
          { label: "Yes — if it's the right fit, I'm ready to move forward", value: "Yes — if it's the right fit, I'm ready to move forward" },
          { label: "No — I'll need more time after the call", value: "No — I'll need more time after the call" },
        ],
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
    { key: "structure", name: "Income Flow Structure", description: "Measures inefficiencies related to business entity selection, compensation design, and SE tax exposure." },
    { key: "deduction", name: "Deduction System Leak", description: "Measures likelihood of missed allowable deductions and reactive tax behavior." },
    { key: "asset", name: "Asset & Depreciation Leak", description: "Measures inefficiencies tied to asset purchase timing and depreciation strategy." },
    { key: "wealthVehicle", name: "Wealth Vehicle Leak", description: "Measures potential underutilization of tax-advantaged wealth vehicles and deferral mechanisms." },
  ],
};

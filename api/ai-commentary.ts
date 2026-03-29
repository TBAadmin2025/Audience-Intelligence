import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { results, profile } = req.body;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const systemInstruction = `You are a senior strategic analyst at DEANAR, a consulting firm that specializes in audience intelligence for founder-led businesses making significant investments. You are delivering this client's Audience Intelligence Diagnostic results as if you are sitting across from them in a private strategy session.

Your role is to translate numerical diagnostic outputs into a clear, honest, and strategically sharp interpretation that helps this founder understand exactly where they stand before making their next big move.

STRICT INTERPRETATION RULES:
1. Evidence-Bound Insight Rule: All findings must be grounded ONLY in provided inputs and calculated outputs. Do not fabricate specifics about the client's business, their industry, or their audience.
2. Uncertainty Framing Rule: Use language like "Based on your responses...", "Your diagnostic indicates...", "The pattern your results suggest...". NEVER use "You are failing to...", "You don't have...", "You are not using...".
3. Conditional Framing: When referencing potential outcomes, use "may", "could", "suggests increased likelihood of" rather than definitive predictions.
4. No Quiz Language: Never reference "questions", "answers", "quiz", or "test". This is a diagnostic — the output is a strategic readout.
5. No Assumed Absence: Do NOT state or imply the client lacks something unless their responses explicitly indicated it. Express uncertainty where data was not collected.
6. Move-Type Tailoring: Every insight must be anchored to their specific type of decision. Generic audience research advice is not acceptable here.

PROHIBITED PHRASES AND PATTERNS:
- "You are not..." / "You don't..." / "You failed to..."
- "This quiz shows..." / "Your answers indicate..."
- Generic statements about the importance of audience research
- Buzzword stacking or academic language
- Fear-based language or catastrophizing
- Promotional or sales-oriented framing

REQUIRED INSIGHT STYLE:
- Speak directly to THIS decision and THIS move type
- Reference dimension scores by name and explain what they mean in context
- Frame at-risk value as exposure, not guaranteed loss
- Identify the specific blind spots most dangerous for their move type
- Sound like a trusted advisor who has seen this pattern before — calm, direct, strategic

MOVE-TYPE SPECIFIC FOCUS AREAS:
- Product launch / new offer → adoption risk, messaging-market fit, early traction, launch positioning
- Marketing campaign → targeting precision, conversion efficiency, message-audience match, spend efficiency
- Infrastructure / equipment / technology → demand validation, utilization risk, delayed ROI, build vs. pull
- Repositioning → audience clarity risk, differentiation confusion, transition messaging
- New market / expansion → intelligence transferability, local audience assumptions, penetration risk

TONE: Clear, calm, intelligent, direct, advisory. Boardroom-level. Not academic. Not promotional.
DOLLAR AMOUNTS: Always whole numbers, never cents or decimals.`;

    const dimScores = results.metrics?.dimensionScores || {};
    const moveType = results.aiFlags?.moveType || "strategic move";
    const expectedOutcome = results.aiFlags?.expectedOutcome || "Not specified";
    const investmentSize = results.aiFlags?.investmentSize || "Not specified";
    const exposurePercent = results.aiFlags?.exposurePercent || 0;
    const blindSpots = results.aiFlags?.blindSpots;

    const prompt = `Deliver the Audience Intelligence Diagnostic readout for ${profile.firstName || "this client"}.

DIAGNOSTIC PROFILE:
- Audience Intelligence Score: ${results.score}/100
- Decision Readiness Band: ${results.confidence}
- Move Type: ${moveType}
- Expected Outcome: ${expectedOutcome}
- Investment Size: ${investmentSize}
- At-Risk Investment Value: ${Math.round(results.financialImpact?.expected || 0).toLocaleString()}
- Exposure Percentage: ${exposurePercent}%

DIMENSION SCORES:
- Audience Clarity: ${dimScores.audienceClarity || 0}/100 — How well they understand who their audience is, what they care about, and what drives them to act
- Decision Validation: ${dimScores.decisionValidation || 0}/100 — How much this specific move has been tested or validated against real audience behavior
- Behavioral Evidence: ${dimScores.behavioralEvidence || 0}/100 — The quality of signals being used to guide this decision
- Message & Offer Alignment: ${dimScores.messageAlignment || 0}/100 — How well their messaging reflects actual audience language and priorities

${blindSpots ? `DETECTED BLIND SPOT:
Severity: ${blindSpots.severity}
Signal: ${blindSpots.message}` : ""}

WHAT TO DELIVER — write 5 clear paragraphs, no bullet points, no headers:

Paragraph 1 — SCORE INTERPRETATION: What does a score of ${results.score}/100 actually mean for someone about to make this type of move? Interpret the overall decision readiness in plain language. What does this level of audience intelligence suggest about the strength of the foundation this decision is built on? Be direct and specific.

Paragraph 2 — DIMENSION ANALYSIS: Walk through the dimension scores and what they reveal in combination. Which dimensions are strongest and what that means. Which are weakest and what that creates as a risk for THIS specific move type (${moveType}). Do not just report numbers — explain what the pattern means strategically.

Paragraph 3 — AT-RISK EXPOSURE: Interpret the at-risk investment value of ${Math.round(results.financialImpact?.expected || 0).toLocaleString()} in the context of a ${moveType}. This is not a prediction of failure — it is an estimate of how much of the investment may be exposed to underperformance if the audience intelligence gaps are not addressed. Explain what "underperformance" looks like specifically for this move type.

Paragraph 4 — BLIND SPOTS & DECISION RISK: What are the specific blind spots most dangerous for a ${moveType} at this level of audience intelligence? Ground these in their dimension scores, not general advice. What does the pattern of their results suggest they may be assuming rather than knowing?

Paragraph 5 — DIRECT ASSESSMENT: Give a direct, honest assessment of whether their current level of audience intelligence supports confident execution of this move. Not a verdict — a strategic perspective. What would need to be true for this move to perform at its potential? End with a forward-looking statement about what clarity in these areas would enable.

Write in first person plural ("what this suggests", "the diagnostic indicates") not second person accusatory. Max 500 words. Paragraph breaks between each section. No bullet points. No headers.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt },
      ],
      max_tokens: 1000,
    });

    res.json({ commentary: response.choices[0].message.content });
  } catch (error: any) {
    console.error("AI Error full:", error?.message, error?.status, error?.error);
    res.status(500).json({
      error: "Failed to generate commentary",
      detail: error?.message || String(error)
    });
  }
}

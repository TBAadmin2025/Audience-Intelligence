import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import Database from "better-sqlite3";

const db = new Database("wrd.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS diagnostics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT,
    lastName TEXT,
    email TEXT,
    phone TEXT,
    score INTEGER,
    totalOpportunityLow REAL,
    totalOpportunityExpected REAL,
    totalOpportunityHigh REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/analyze", async (req, res) => {
    const { answers, contact } = req.body;
    
    // In a real app, we'd do the math here or in a shared lib
    // For now, let's assume the client sends the results for storage
    // or we'll implement the engine in a shared file.
    
    try {
      const stmt = db.prepare(`
        INSERT INTO diagnostics (firstName, lastName, email, phone, score, totalOpportunityLow, totalOpportunityExpected, totalOpportunityHigh)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const info = stmt.run(
        contact.firstName,
        contact.lastName,
        contact.email,
        contact.phone,
        req.body.results.score,
        req.body.results.totalOpportunity.low,
        req.body.results.totalOpportunity.expected,
        req.body.results.totalOpportunity.high
      );

      res.json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
      console.error("DB Error:", error);
      res.status(500).json({ error: "Failed to save diagnostic" });
    }
  });

  app.post("/api/ai-commentary", async (req, res) => {
    const { results, profile } = req.body;
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    try {
      const systemInstruction = `You are a senior financial strategy advisor interpreting diagnostic results.
Your role is to translate structured numerical outputs into clear, natural, human-readable explanations.

STRICT INTERPRETATION RULES:
1. No Assumed Absence Rule: Do NOT state or imply that the user lacks, does not use, or has not implemented any strategy, structure, deduction, or vehicle unless the diagnostic explicitly asked about it and the user explicitly indicated "No".
2. Evidence-Bound Insight Rule: All findings must be grounded ONLY in provided inputs, calculated outputs, and eligibility responses. If data was not collected, express uncertainty.
3. Uncertainty Framing Rule: Use language like "Based on the information provided...", "Your responses suggest...", "This diagnostic cannot determine...", "If applicable...". NEVER use "You are not using...", "You don't have...", "You failed to...".
4. No Fabrication of Financial Structures: Do NOT invent retirement vehicles, entity structures, deduction usage, or investment strategies unless explicitly provided.
5. Diagnostic Scope Protection Rule: The diagnostic evaluates structural efficiency, tax exposure patterns, wealth leakage indicators, and redirection potential. It does NOT perform a full tax return audit.

PROHIBITED CLAIM TYPES:
- State missing strategies as facts.
- Diagnose uncollected categories.
- Declare optimization gaps without evidence.
- Suggest negligence ("you're failing to...").
- Imply tax advice or compliance review.

REQUIRED INSIGHT STYLE:
- Reference inputs and calculations.
- Use conditional framing.
- Distinguish "detected vs not evaluated".
- Sound analytical, not assumptive.

Tone Requirements: Clear, calm, intelligent, professional, human, advisory.
Avoid: Hype, marketing tone, slang, fear tactics, buzzword stacking.`;

      const prompt = `Interpret the diagnostic results provided for a client with the following profile:
- Income: ${profile.incomeRange}
- Taxes Paid Last Year: ${profile.taxesPaidRange}
- Wealth Redirection Score: ${results.score}/100
- Estimated Annual Wealth Leakage: $${results.totalOpportunity.expected.toLocaleString()}
- Tax Drag Ratio: ${Math.round(results.taxDragRatio * 100)}%
- Effective Tax Rate: ${Math.round(results.effectiveRate * 100)}%
- Confidence Level: ${results.confidence}
- Entity Intelligence Signals: ${JSON.stringify(results.aiFlags)}

Return a cohesive interpretation that covers:
1. Score interpretation: What it means, why it matters, and what it suggests.
2. Opportunity classification explanation.
3. Tax drag ratio and effective tax rate interpretation.
4. Confidence level explanation.
5. Brief quadrant commentary (Structure, Deduction, Asset, Wealth Vehicle) based on the scores and findings. Provide this as a single cohesive paragraph for each quadrant, rather than bullet points.
   - Structure Score: ${results.quadrants.structure.score} (Status: ${results.quadrants.structure.status})
   - Deduction Score: ${results.quadrants.deduction.score} (Status: ${results.quadrants.deduction.status})
   - Asset Score: ${results.quadrants.asset.score} (Status: ${results.quadrants.asset.status})
   - Wealth Vehicle Score: ${results.quadrants.wealthVehicle.score} (Status: ${results.quadrants.wealthVehicle.status})

Specific Guidance for Entity Inefficiency:
- If entityMismatch is true, explain what was detected, why it matters, and the structural implication.
- Use advisory tone:
  - Mild Case: "Your reported income and entity structure suggest potential opportunities for improved tax efficiency."
  - Moderate Case: "Your income level combined with your current business entity may indicate elevated self-employment tax exposure."
  - Severe Case: "At higher income levels, sole proprietorship structures often result in disproportionately high tax obligations compared to alternative entity strategies."

Specific Guidance for Quadrant Commentary:
- For each quadrant, provide 2-3 sentences of interpretation.
- Reference the "Status" of each quadrant. If "Not Evaluated" or "Insufficient Data", express uncertainty as per the STRICT INTERPRETATION RULES.
- Instead of "Basic retirement accounts only", use "Retirement Strategy Signal: Limited Visibility. We did not collect detailed retirement vehicle data. However, based on income and tax exposure levels, additional optimization layers may exist depending on your current structures."
- Instead of "You are not using advanced wealth vehicles", use "This diagnostic did not evaluate specific advanced wealth vehicles. If your current strategy includes specialized structures, Terry's advisory process would assess integration and efficiency."

Use clear, conversational professional language. Avoid promotional or exaggerated language. Max 400 words.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
        },
      });

      res.json({ commentary: response.text });
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Failed to generate commentary" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

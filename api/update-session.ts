import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error("update-session: Missing SUPABASE_URL or SUPABASE_ANON_KEY");
    return res.status(500).json({ error: "Supabase not configured" });
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  const { sessionId, results, rawAnswers, commentary } = req.body;

  const scoreLabel =
    results.score >= 80 ? "Strong" :
    results.score >= 50 ? "Moderate" :
    "Needs Optimization";

  const { error } = await supabase
    .from("diagnostic_sessions")
    .update({
      overall_score: results.score,
      score_label: scoreLabel,
      raw_answers: rawAnswers,
      calculated_scores: {
        score: results.score,
        confidence: results.confidence,
        proceedRecommendation: results.proceedRecommendation,
        proceedDetail: results.proceedDetail,
        financialImpact: results.financialImpact,
        quadrants: results.quadrants,
        aiFlags: results.aiFlags,
        metrics: results.metrics,
      },
      ai_commentary: commentary,
      is_completed: true,
      diagnostic_status: "Completed",
      report_url: `/report/${sessionId}`,
    })
    .eq("id", sessionId);

  if (error) {
    console.error("Supabase update-session error:", error);
    return res.status(500).json({ error: "Failed to update session" });
  }

  res.json({ success: true });
}

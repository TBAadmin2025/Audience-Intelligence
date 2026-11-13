import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.TENANT_ID) {
    console.error("get-session: Missing TENANT_ID");
    return res.status(500).json({ error: "TENANT_ID environment variable is not configured" });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("get-session: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return res.status(500).json({ error: "Supabase not configured" });
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing session ID" });
  }

  const { data, error } = await supabase
    .from("diagnostic_sessions")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", process.env.TENANT_ID)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Session not found" });
  }

  res.json({ session: data });
}

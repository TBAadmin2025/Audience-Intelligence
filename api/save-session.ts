import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.TENANT_ID) {
    console.error("save-session: Missing TENANT_ID");
    return res.status(500).json({ error: "TENANT_ID environment variable is not configured" });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error("save-session: Missing SUPABASE_URL or SUPABASE_ANON_KEY");
    return res.status(500).json({ error: "Supabase not configured" });
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  const { contact } = req.body;

  const { data, error } = await supabase
    .from("diagnostic_sessions")
    .insert({
      tenant_id: process.env.TENANT_ID,
      first_name: contact.firstName,
      last_name: contact.lastName,
      email: contact.email,
      phone: contact.phone || null,
      diagnostic_status: "In Progress",
      is_completed: false,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Supabase save-session error:", error);
    return res.status(500).json({ error: "Failed to create session" });
  }

  res.json({ sessionId: data.id });
}

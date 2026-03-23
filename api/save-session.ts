import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
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
      tenant_id: "1b51292d-8260-4d5a-b292-4cbc970b5453",
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

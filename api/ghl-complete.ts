import type { VercelRequest, VercelResponse } from "@vercel/node";
import { diagnosticConfig } from "../src/client/config";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { contact, results, sessionId, commentary } = req.body;

  // Respond immediately
  res.json({ success: true });

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) return;

  const { fieldKeys, tags } = diagnosticConfig.ghl;

  try {
    // Find the contact by email
    const searchRes = await fetch(
      `https://services.leadconnectorhq.com/contacts/search/duplicate?locationId=${locationId}&email=${encodeURIComponent(contact.email)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Version: "2021-07-28",
        },
      }
    );
    const searchData = await searchRes.json();
    const contactId = searchData?.contact?.id;
    if (!contactId) return;

    const reportUrl = `/report/${sessionId}`;

    await fetch(
      `https://services.leadconnectorhq.com/contacts/${contactId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Version: "2021-07-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tags: [tags.completed],
          customFields: [
            { key: fieldKeys.overallScore, field_value: String(results.score) },
            { key: fieldKeys.financialImpact, field_value: `$${Math.round(results.financialImpact.low).toLocaleString()} - $${Math.round(results.financialImpact.high).toLocaleString()}` },
            { key: fieldKeys.reportUrl, field_value: reportUrl },
            { key: fieldKeys.commentary, field_value: commentary || "" },
            { key: fieldKeys.completedDate, field_value: new Date().toISOString() },
          ],
        }),
      }
    );
  } catch (err) {
    console.error("GHL complete webhook failed (silent):", err);
  }
}

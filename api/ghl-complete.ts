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

  const { tags } = diagnosticConfig.ghl;

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
            {
              key: "diagnostic_overall_score",
              field_value: String(results.score || "")
            },
            {
              key: "diagnostic_financial_impact",
              field_value: results.aiFlags?.sizeOfPrize
                ? `At-Risk: ${Math.round(results.financialImpact?.expected || 0).toLocaleString()} of ${results.aiFlags.sizeOfPrize}`
                : `At-Risk: ${Math.round(results.financialImpact?.expected || 0).toLocaleString()}`
            },
            {
              key: "diagnostic_commentary",
              field_value: typeof commentary === "string"
                ? commentary.slice(0, 500)
                : ""
            },
            {
              key: "diagnostic_report_url",
              field_value: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/report/${sessionId}`
            },
            {
              key: "diagnostic_completed_date",
              field_value: new Date().toISOString().split("T")[0]
            },
          ],
        }),
      }
    );
  } catch (err) {
    console.error("GHL complete webhook failed (silent):", err);
  }
}

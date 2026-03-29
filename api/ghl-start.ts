import type { VercelRequest, VercelResponse } from "@vercel/node";
import { diagnosticConfig } from "../src/client/config";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { contact } = req.body;

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) {
    console.warn("ghl-start: Missing GHL_API_KEY or GHL_LOCATION_ID");
    return res.json({ success: true });
  }

  try {
    // Search for existing contact by email
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
    const existingContactId = searchData?.contact?.id;

    const contactPayload = {
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone || undefined,
      locationId,
      tags: [diagnosticConfig.ghl.tags.started],
    };

    if (existingContactId) {
      // Update existing contact
      await fetch(
        `https://services.leadconnectorhq.com/contacts/${existingContactId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            Version: "2021-07-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactPayload),
        }
      );
      console.log("GHL contact upserted:", existingContactId);
    } else {
      // Create new contact
      const createRes = await fetch("https://services.leadconnectorhq.com/contacts/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Version: "2021-07-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactPayload),
      });
      const createData = await createRes.json();
      console.log("GHL contact created:", createData?.contact?.id);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("GHL start webhook failed:", err);
    res.json({ success: true });
  }
}

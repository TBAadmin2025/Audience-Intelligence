import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";
import { systemPrompt, buildUserMessage } from "../src/client/prompt";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { results, profile } = req.body;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const prompt = buildUserMessage(results, { firstName: profile.firstName || "Client" });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });

    res.json({ commentary: response.choices[0].message.content });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to generate commentary" });
  }
}

/**
 * Vercel Serverless Function — /api/ai-chat
 * Proxies chat messages to OpenAI (GPT-4o-mini) or Groq (llama3-70b)
 * depending on which key is set.
 *
 * Required environment variables (set in Vercel Dashboard → Settings → Env):
 *   OPENAI_API_KEY  — use GPT-4o-mini
 *   GROQ_API_KEY    — use llama3-70b-8192 (faster, cheaper)
 *
 * One of the two keys must be present. If neither is set the request
 * returns HTTP 503 so the frontend can show its friendly fallback.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface RequestBody {
  systemPrompt: string;
  history: ChatMessage[];
  userMessage: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS — allow the SPA origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  const GROQ_KEY   = process.env.GROQ_API_KEY;

  if (!OPENAI_KEY && !GROQ_KEY) {
    return res.status(503).json({ error: "AI service not configured. Add OPENAI_API_KEY or GROQ_API_KEY to Vercel environment variables." });
  }

  const { systemPrompt, history = [], userMessage }: RequestBody = req.body ?? {};

  if (!userMessage?.trim()) {
    return res.status(400).json({ error: "userMessage is required" });
  }

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt ?? "" },
    ...history.slice(-12), // last 12 messages to stay within context limits
    { role: "user", content: userMessage },
  ];

  // ── OpenAI path ─────────────────────────────────────────────────────────────
  if (OPENAI_KEY) {
    const oaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!oaiRes.ok) {
      const errText = await oaiRes.text();
      console.error("[ai-chat] OpenAI error:", errText);
      return res.status(502).json({ error: "OpenAI API error", detail: errText });
    }

    const oaiData = await oaiRes.json();
    const reply = oaiData.choices?.[0]?.message?.content ?? "";
    return res.status(200).json({ reply });
  }

  // ── Groq path ────────────────────────────────────────────────────────────────
  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!groqRes.ok) {
    const errText = await groqRes.text();
    console.error("[ai-chat] Groq error:", errText);
    return res.status(502).json({ error: "Groq API error", detail: errText });
  }

  const groqData = await groqRes.json();
  const reply = groqData.choices?.[0]?.message?.content ?? "";
  return res.status(200).json({ reply });
}

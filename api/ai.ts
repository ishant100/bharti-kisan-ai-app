// api/ai.ts - Vercel Serverless Function
export const config = { runtime: "nodejs" }; // ensure Node runtime

type QueryInput = { type?: "text"|"voice"|"image"; content?: string; imageUrl?: string };

const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  try {
    const body = (typeof req.body === "string") ? JSON.parse(req.body) : req.body;
    const input: QueryInput = body || {};
    const model = input.type === "image"
      ? (process.env.GROQ_VISION_MODEL || "llama-3.2-11b-vision-preview")
      : (process.env.GROQ_MODEL || "llama-3.1-8b-instant");

    const messages = buildMessages(input);

    const r = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY as string}`
      },
      body: JSON.stringify({ model, messages, temperature: 0.4 })
    });

    if (!r.ok) {
      const errText = await r.text();
      return res.status(r.status).json({ error: "groq_error", details: errText });
    }

    const data: any = await r.json();
    const text: string =
      data?.choices?.[0]?.message?.content?.toString()?.trim() ||
      "Sorry, I could not generate a response.";
    const confidence = 85;
    res.status(200).json({ response: text, confidence });
  } catch (e: any) {
    res.status(500).json({ error: "server_error", message: e?.message || String(e) });
  }
}

function buildMessages(input: QueryInput) {
  const system = {
    role: "system",
    content:
      "You are AgriGuide AI, a helpful agricultural assistant for Indian farmers. " +
      "Give concise, actionable advice. If you don't know, say so."
  };

  if (input.type === "image" && input.imageUrl) {
    return [
      system,
      {
        role: "user",
        content: [
          { type: "text", text: input.content || "Analyze this farm image." },
          { type: "image_url", image_url: { url: input.imageUrl } }
        ]
      }
    ];
  }

  return [
    system,
    { role: "user", content: input.content || "Hello" }
  ];
}

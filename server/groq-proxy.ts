import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";

// If Node < 18, uncomment these 2 lines and run: npm i node-fetch@3
// // @ts-ignore
// import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const API_URL = "https://api.groq.com/openai/v1/chat/completions";

type QueryInput = { type?: "text"|"voice"|"image"; content?: string; imageUrl?: string };

app.post("/api/ai", async (req: Request, res: Response) => {
  try {
    console.log("[/api/ai] incoming", { hasKey: !!process.env.GROQ_API_KEY });

    const { type, content, imageUrl } = (req.body ?? {}) as QueryInput;
    const model =
      (type === "image" ? process.env.GROQ_VISION_MODEL : process.env.GROQ_MODEL) ||
      "llama-3.1-8b-instant";

    const messages: any[] = [
      { role: "system", content: "You are an agriculture assistant for Indian farmers. Be concise, practical, and safe." }
    ];

    if (type === "image" && imageUrl) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: content || "Analyze this crop image and help." },
          { type: "image_url", image_url: { url: imageUrl } }
        ]
      });
    } else {
      messages.push({ role: "user", content: content || "" });
    }

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
      console.error("[/api/ai] groq_error", r.status, errText);
      return res.status(r.status).json({ error: "groq_error", details: errText });
    }

    const data: any = await r.json();
    const text: string = data?.choices?.[0]?.message?.content?.toString()?.trim() || "Sorry, I could not generate a response.";
    const confidence = 85;
    res.json({ response: text, confidence });
  } catch (e: any) {
    console.error("[/api/ai] server_error", e);
    res.status(500).json({ error: "server_error", message: e?.message || String(e) });
  }
});

const port = Number(process.env.PORT || 8787);
app.listen(port, () => console.log(`[groq-proxy] listening on http://localhost:${port}`));

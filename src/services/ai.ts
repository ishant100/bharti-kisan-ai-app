// src/services/ai.ts
// Minimal Groq chat client (OpenAI-compatible)
// Works in Vite via env vars: VITE_GROQ_API_KEY and VITE_GROQ_MODEL

export type AIResult = {
  response: string;
  confidence: number; // simple heuristic for now
};

type QueryInput = {
  type: 'text' | 'voice' | 'image';
  content: string;
  imageUrl?: string;
};

const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// You can change default model in .env (see step 3)
const MODEL = import.meta.env.VITE_GROQ_MODEL || 'llama-3.1-8b-instant';

// IMPORTANT: In pure frontend, the key is exposed at runtime.
// For production, put a tiny server proxy and keep the key server-side.
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

if (!API_KEY) {
  // Make failures obvious in dev
  // (Don't throw: allows the UI to render with a helpful message)
  // eslint-disable-next-line no-console
  console.warn('[AI] Missing VITE_GROQ_API_KEY in .env');
}

function buildMessages(input: QueryInput) {
  const system = {
    role: 'system',
    content:
      'You are PaddyPal, a concise, helpful agriculture assistant. Be accurate, avoid hallucinations, and include clear, actionable steps.',
  } as const;

  // If image is provided, we send a vision-style message if supported.
  if (input.type === 'image' && input.imageUrl) {
    return [
      system,
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Analyze this crop image and give a practical diagnosis and treatment.' },
          { type: 'image_url', image_url: { url: input.imageUrl } },
        ],
      },
    ];
  }

  // Text or voice -> treat as text
  return [
    system,
    {
      role: 'user',
      content: input.content,
    },
  ];
}

export async function getAIResponse(input: QueryInput): Promise<AIResult> {
  if (!API_KEY) {
    return {
      response:
        'AI key is not configured. Please add VITE_GROQ_API_KEY to your .env (see setup instructions).',
      confidence: 0,
    };
  }

  // Use a vision-capable model automatically when user sends an image
  const model =
    input.type === 'image'
      ? (import.meta.env.VITE_GROQ_VISION_MODEL || 'llama-3.2-11b-vision-preview')
      : MODEL;

  const body = {
    model,
    temperature: 0.2,
    messages: buildMessages(input),
    // stream: true // (optional) implement streaming later if you want
  };

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    return {
      response:
        `The AI request failed (${res.status}). ${errText || 'Please check your API key and model.'}`,
      confidence: 0,
    };
  }

  const data = await res.json();

  const text =
    data?.choices?.[0]?.message?.content?.toString()?.trim() ||
    'Sorry, I could not generate a response.';

  // Simple confidence heuristic (short + cautious). Replace with your own scoring later.
  const confidence = Math.max(60, Math.min(98, Math.round(80 + (text.length % 15) - 5)));

  return { response: text, confidence };
}
export * from "./ai.secure";

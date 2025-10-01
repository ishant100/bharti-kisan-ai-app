// src/pages/Chat.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
// aimoiredsdsdsd

import {
  Bot,
  User,
  Image as ImageIcon,
  Sparkles,
  Send,
  Mic,
  Sun,
  CloudRain,
  Tractor,
  Droplet,
  Sprout,
  X,
  Wind,
} from "lucide-react";
import { getAIResponse } from "@/services/ai.secure";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
};

type PopupKind = "spray" | "soil" | null;

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I’m your Agri Assistant. Ask about crop issues, pests, irrigation, soil health, or weather planning. 🌾",
    },
  ]);
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [popup, setPopup] = useState<PopupKind>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending]);

  const canSend = text.trim().length > 0 || !!imageUrl;

  const promptChips = useMemo(
    () => [
      "Tomato leaf spots — what should I do?",
      "7-day irrigation plan for paddy",
      "Organic pest control for okra",
      "Weed management in sugarcane",
      "Banana nutrient schedule (monsoon)",
    ],
    []
  );

  async function handleSend() {
    if (!canSend || isSending) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: "user",
      content: text.trim(),
      imageUrl,
    };

    setMessages((m) => [...m, userMsg]);
    setIsSending(true);
    setText("");
    setImageUrl(undefined);

    try {
      const { response } = await getAIResponse({
        type: userMsg.imageUrl ? "image" : "text",
        content: userMsg.content || "Please analyze the image.",
        imageUrl: userMsg.imageUrl,
      });

      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: "assistant",
        content: response,
      };
      setMessages((m) => [...m, aiMsg]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: String(Date.now() + 2),
          role: "assistant",
          content:
            "Sorry—couldn’t reach the AI right now. Please check connectivity and try again.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="min-h-[100dvh] grid lg:grid-cols-4 bg-gradient-to-b from-green-50 via-emerald-50 to-green-100 text-slate-800">
      {/* Center — Chat area */}
      <div className="lg:col-span-3 relative flex flex-col">
        {/* Subtle agri header */}
        <div className="sticky top-0 z-10 px-4 sm:px-6 py-3 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-emerald-700 animate-pulse" />
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-emerald-800">BHARTI-kisan ai</div>
              <div className="text-xs text-emerald-700/70">
                Smart agriculture assistant • ask anything
              </div>
            </div>
          </div>
        </div>

        {/* Prompt chips (compact) */}
        <div className="px-4 sm:px-6 pt-3">
            <div className="flex flex-wrap gap-2">
              {promptChips.map((p) => (
                <button
                  key={p}
                  className="text-[11px] rounded-full border border-emerald-200 px-3 py-1 bg-white hover:bg-emerald-50 transition-colors"
                  onClick={() => setText(p)}
                >
                  <Sparkles className="inline-block w-3 h-3 mr-1 text-emerald-600" />
                  {p}
                </button>
              ))}
            </div>
        </div>

        {/* Scrollable messages (composer is sticky at bottom) */}
        <div className="flex-1 px-2 sm:px-6">
          <ScrollArea className="h-[calc(100dvh-220px)] pr-2">
            <div className="space-y-4 pt-4">
              {messages.map((m) => (
                <ChatBubble
                  key={m.id}
                  role={m.role}
                  content={m.content}
                  imageUrl={m.imageUrl}
                />
              ))}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Sticky composer */}
        <div className="sticky bottom-0 px-4 sm:px-6 pb-4 pt-2">
          <Card className="p-2 sm:p-3 border border-emerald-200/70 bg-white/80 backdrop-blur-md shadow-lg transition-transform">
            <div className="flex items-end gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setImageUrl(URL.createObjectURL(f));
                }}
                className="hidden"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileRef.current?.click()}
                className="hover:bg-emerald-50"
                aria-label="Attach image"
              >
                <ImageIcon className="w-5 h-5 text-emerald-700" />
              </Button>

              <div className="flex-1">
                <Input
                  className="bg-white/80 border-emerald-200 text-slate-800 placeholder:text-slate-500"
                  placeholder="Ask about your crops…"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                {imageUrl && (
                  <div className="mt-1 text-[11px] text-slate-500">
                    Image attached
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-emerald-50"
                aria-label="Voice input (coming soon)"
                disabled
              >
                <Mic className="w-5 h-5 text-emerald-700" />
              </Button>

              <Button
                onClick={handleSend}
                disabled={!canSend || isSending}
                className="bg-emerald-600 hover:bg-emerald-500 text-white min-w-[88px] transition-transform active:scale-[0.98]"
              >
                {isSending ? "..." : "Send"}
                <Send className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Right — smaller quick actions */}
      <aside className="hidden lg:block border-l bg-white/60 backdrop-blur p-4 space-y-3">
        <h3 className="font-semibold text-emerald-900">Quick Actions</h3>
        <div className="grid gap-2 text-xs">
          <QuickAction
            icon={<Sun className="w-4 h-4 text-yellow-600" />}
            label="7-day weather"
            href="/weather"
          />
          <QuickAction
            icon={<CloudRain className="w-4 h-4 text-sky-600" />}
            label="Spray window"
            onClick={() => setPopup("spray")}
          />
          <QuickAction
            icon={<Tractor className="w-4 h-4 text-emerald-700" />}
            label="Soil health basics"
            onClick={() => setPopup("soil")}
          />
        </div>
      </aside>

      {/* Popups */}
      {popup === "spray" && (
        <Popup onClose={() => setPopup(null)} title="Spray Window Guidance" icon={<Droplet className="w-5 h-5 text-sky-600" />}>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Prefer <b>early morning</b> or <b>late evening</b> to reduce drift and leaf burn.</li>
            <li>Avoid spraying <b>24h before rain</b>. Check forecast first.</li>
            <li>Target wind speed &lt; <b>10 km/h</b>. <Wind className="inline w-4 h-4 -mt-1" /> low wind days are best.</li>
            <li>Use clean water, correct dose, and calibrated nozzle.</li>
            <li>Wear PPE: mask, gloves, long sleeves; wash hands after.</li>
          </ul>
          <div className="flex gap-2 mt-4">
            <Button
              variant="secondary"
              onClick={() => setText("Suggest a safe pesticide spray window for my crop this week using the 7-day forecast (avoid rain/wind, give best day & time).")}
            >
              Use as prompt
            </Button>
            <Button onClick={() => setPopup(null)} className="bg-emerald-600 hover:bg-emerald-500">Close</Button>
          </div>
        </Popup>
      )}

      {popup === "soil" && (
        <Popup onClose={() => setPopup(null)} title="Soil Health Basics" icon={<Sprout className="w-5 h-5 text-emerald-700" />}>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Test soil every <b>6–12 months</b> (NPK, pH, OC, micronutrients).</li>
            <li>Maintain pH <b>6.5–7.5</b> for most crops; use lime/gypsum if needed.</li>
            <li>Add <b>compost/vermicompost</b>, retain residues, use cover crops.</li>
            <li>Balance fertilizers based on Soil Health Card values—no overuse.</li>
            <li>Improve moisture with mulching and timely irrigation.</li>
          </ul>
          <div className="flex gap-2 mt-4">
            <Button
              variant="secondary"
              onClick={() => setText("Explain my Soil Health Card values (pH, OC, N, P, K, micronutrients) and give exact amendments and dosages for next season.")}
            >
              Use as prompt
            </Button>
            <Button onClick={() => setPopup(null)} className="bg-emerald-600 hover:bg-emerald-500">Close</Button>
          </div>
        </Popup>
      )}
    </div>
  );
}

/* ---------------- UI bits ---------------- */

function ChatBubble({
  role,
  content,
  imageUrl,
}: {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="flex items-start gap-2 max-w-[85%] sm:max-w-[70%]">
        {/* Avatar */}
        <div
          className={`mt-1 h-7 w-7 rounded-full flex items-center justify-center shadow-sm transition-transform ${
            isUser ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm border transition-all ${
            isUser
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white/90 text-slate-800 border-emerald-200"
          }`}
          style={{ animation: "fadeIn 300ms ease-out" }}
        >
          {imageUrl && (
            <img
              src={imageUrl}
              alt="attached"
              className="rounded-xl mb-2 max-h-48 object-cover"
            />
          )}
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  href,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
}) {
  const inner = (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="justify-start w-full text-left border-emerald-200 bg-white/80 hover:bg-emerald-50 text-slate-800 transition-colors"
    >
      <span className="mr-2">{icon}</span>
      {label}
    </Button>
  );
  if (href)
    return (
      <a href={href} className="block">
        {inner}
      </a>
    );
  return inner;
}

/* ------------ Reusable Popup ------------- */
function Popup({
  title,
  icon,
  children,
  onClose,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-5 bg-white/95 border-emerald-200 animate-[fadeIn_200ms_ease-out]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-semibold text-emerald-900">{title}</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="text-slate-700">{children}</div>
      </Card>
    </div>
  );
}

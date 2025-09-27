import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAIResponse } from "@/services/ai";
import { Mic, Square, Loader2, Volume2 } from "lucide-react";

function useSpeechToText() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recRef = useRef<any>(null); // no DOM lib types needed

  useEffect(() => {
    const SR: any =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SR) return;

    const rec = new SR();
    rec.lang = "en-IN";
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (e: any) => {
      let s = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        s += e.results[i][0].transcript;
      }
      setTranscript(s);
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
  }, []);

  const start = () => {
    if (!recRef.current) return;
    setTranscript("");
    setListening(true);
    recRef.current.start();
  };
  const stop = () => {
    recRef.current?.stop();
    setListening(false);
  };

  return { listening, transcript, start, stop };
}

export default function Voice() {
  const { listening, transcript, start, stop } = useSpeechToText();
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask() {
    if (!transcript.trim()) return;
    setLoading(true);
    try {
      const { response } = await getAIResponse({
        type: "text",
        content: `User asked by voice: ${transcript}. Be concise and give step-by-step actions.`,
      });
      const bullets = response
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => (s.startsWith("-") ? s : `- ${s}`))
        .join("\n");
      setAnswer(bullets);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Voice Input</h1>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          {!listening ? (
            <Button onClick={start} className="bg-emerald-600 hover:bg-emerald-500">
              <Mic className="w-4 h-4 mr-2" /> Start Listening
            </Button>
          ) : (
            <Button onClick={stop} variant="destructive">
              <Square className="w-4 h-4 mr-2" /> Stop
            </Button>
          )}
          <div className="text-sm text-muted-foreground">
            {listening ? "Listening… speak clearly near the mic." : "Press Start and ask your question."}
          </div>
        </div>

        <Card className="p-4 min-h-[120px]">
          <div className="text-xs text-muted-foreground mb-1">Transcript</div>
          <div>{transcript || "—"}</div>
        </Card>

        <Button onClick={ask} disabled={!transcript || loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
          Ask AI
        </Button>

        <Card className="p-4 whitespace-pre-wrap text-sm leading-relaxed">
          {answer || "Your AI answer will appear here."}
        </Card>
      </Card>

      <p className="text-xs text-muted-foreground">
        Note: Voice recognition uses the browser’s Web Speech API (best on Chrome/Edge and Android). No extra API keys required.
      </p>
    </div>
  );
}


import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";
import { getAIResponse } from "@/services/ai";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string); // data:image/..;base64,....
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageAnalysis() {
  const [img, setImg] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const dataUrl = await fileToDataUrl(f);
    setImg(dataUrl);
    setAnswer("");
  }

  async function analyze() {
    if (!img) return;
    setLoading(true);
    try {
      const { response } = await getAIResponse({
        type: "image",
        content:
          "Analyze this farm photo and give diagnosis + 5 clear action steps. Be precise; avoid chemicals unless needed.",
        imageUrl: img, // base64 data URL works with OpenAI-compatible vision
      });

      // simple bullet formatting
      const bullets = response
        .split("\n")
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => (s.startsWith("-") ? s : `- ${s}`))
        .join("\n");
      setAnswer(bullets);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Image Analysis</h1>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <label className="block text-sm font-medium mb-2">Upload crop/soil image</label>
            <Input type="file" accept="image/*" onChange={onPick} />
            {img && (
              <img
                src={img}
                alt="preview"
                className="mt-4 rounded-lg border max-h-80 object-contain"
              />
            )}
            <Button
              className="mt-4"
              onClick={analyze}
              disabled={!img || loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
              Analyze Image
            </Button>
          </div>

          <div className="md:w-1/2">
            <label className="block text-sm font-medium mb-2">Result</label>
            <Card className="p-4 min-h-[220px] whitespace-pre-wrap text-sm leading-relaxed">
              {answer || "Upload an image and click Analyze."}
            </Card>
          </div>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground">
        Tip: clear, close-up photos of the affected plant part (leaf/fruit/stem/soil) give better results.
      </p>
    </div>
  );
}

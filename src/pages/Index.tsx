// src/pages/Index.tsx
import { useState, useEffect } from "react";
import { Footer } from "@/components/Footer";
import { WelcomeHero } from "@/components/WelcomeHero";
import { ContextPanel, type City, type PanelType } from "@/components/ContextPanel";
import { getAIResponse } from "@/services/ai.secure";
import { fetchForecast } from "@/services/weather";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { RemindersCard } from "@/components/RemindersCard";
import { toast, Toaster } from "sonner";

// OPTIONAL services (paste if you added earlier)
import { fetchMarketPrices, type MarketPrice } from "@/services/markets"; // needs DATA.GOV.IN key

// quick fallback list for schemes (if you don't have services/schemes.ts)
const SCHEMES = [
  { title: "PM-KISAN", desc: "₹6,000/year in 3 installments.", url: "https://pmkisan.gov.in/" },
  { title: "PMFBY (Crop Insurance)", desc: "Insurance against natural risks.", url: "https://pmfby.gov.in/" },
  { title: "Soil Health Card", desc: "Soil test based fertiliser advice.", url: "https://www.soilhealth.dac.gov.in/" },
];

export interface Query {
  id: string;
  type: "text" | "voice" | "image";
  content: string;
  timestamp: Date;
  response?: string;
  confidence?: number;
}

export default function Index() {
  // left-panel state we want to reuse
  const [city, setCity] = useState<City | null>(null);
  const [crop, setCrop] = useState<string>("Paddy (Rice)");

  // which info card is open
  const [panel, setPanel] = useState<PanelType | null>(null);

  // quick Q&A box (home page)
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [qaLoading, setQaLoading] = useState(false);

  function normalizePrompt(s: string) {
    return s.replace(/\s+/g, " ").trim();
  }

  async function ask() {
    const q = normalizePrompt(question);
    if (!q) {
      toast.info("Please enter a question.");
      return;
    }
    if (q.length > 800) {
      toast.warning("Your question is too long. Please shorten it.");
      return;
    }

    setQaLoading(true);
    setAnswer(null);
    try {
      const { response } = await getAIResponse({ type: "text", content: q });
      const formatted = response
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => (s.startsWith("-") ? s : `- ${s}`))
        .join("\n");
      setAnswer(formatted);
    } catch (e: any) {
      const msg = e?.message || "Something went wrong. Please try again.";
      toast.error(msg);
      setAnswer("⚠️ " + msg);
    } finally {
      setQaLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-green-100">
      {/* toast portal */}
      <Toaster richColors position="top-right" />

      <main className="container mx-auto px-4 py-8">
        <WelcomeHero />

        <div className="grid lg:grid-cols-4 gap-8 mt-8">
          {/* LEFT: Farm Context */}
          <div className="lg:col-span-1">
            <ContextPanel
              onOpenPanel={setPanel}
              onLocationChange={setCity}
              onCropChange={setCrop}
            />
          </div>

          {/* RIGHT: main content (quick Q&A + dynamic info card) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Q&A box */}
            <Card className="p-6 shadow-sm border border-emerald-200/60 bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-200 animate-fade-in-up">
              <h2 className="text-2xl font-extrabold text-emerald-800 mb-4">
                Quick Agricultural Query
              </h2>
              <div className="flex gap-2">
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask about crops, pests, soil, or weather…"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !qaLoading) ask();
                  }}
                  className="text-lg"
                />
                <Button
                  onClick={ask}
                  disabled={qaLoading || !question.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-semibold px-6"
                >
                  {qaLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ask"}
                </Button>
              </div>
              {answer && (
                <div
                  className="mt-5 p-5 rounded-lg bg-emerald-50 border border-emerald-200 animate-fade-in"
                  role="status"
                  aria-live="polite"
                >
                  <ul className="list-disc pl-6 space-y-2 text-base font-medium text-slate-800 leading-relaxed">
                    {answer.split("\n").map((line, i) => (
                      <li key={i}>{line.replace(/^-/, "").trim()}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            <RemindersCard />

            {/* Dynamic info card area (fills blank space) */}
            {panel === "forecast" && (
              <ForecastCard city={city} onClose={() => setPanel(null)} />
            )}
            {panel === "market" && (
              <MarketCard crop={crop} city={city} onClose={() => setPanel(null)} />
            )}
            {panel === "schemes" && <SchemesCard onClose={() => setPanel(null)} />}
            {panel === "soil" && <SoilCard city={city} onClose={() => setPanel(null)} />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* -------------------- Cards (inline components) -------------------- */

function ForecastCard({
  city,
  onClose,
}: {
  city: City | null;
  onClose: () => void;
}) {
  const [days, setDays] = useState<
    { date: string; temp_max: number; temp_min: number; precipitation: number; wind: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!city) return;
      setLoading(true);
      try {
        const fc = await fetchForecast(city.latitude, city.longitude);
        setDays(fc.days);
      } finally {
        setLoading(false);
      }
    })();
  }, [city?.id]);

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold">
          7-Day Forecast {city ? `— ${city.name}` : ""}
        </h3>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
      {!city && (
        <div className="text-sm text-muted-foreground">
          Select a location to see forecast.
        </div>
      )}
      {city && (
        <div className="grid md:grid-cols-3 gap-4">
          {loading
            ? "Loading…"
            : days.map((d) => (
                <Card key={d.date} className="p-4">
                  <div className="text-sm text-muted-foreground">
                    {new Date(d.date).toDateString()}
                  </div>
                  <div className="text-xl font-semibold">
                    {Math.round(d.temp_max)}° / {Math.round(d.temp_min)}°C
                  </div>
                  <div className="text-sm">
                    Rain: {d.precipitation} mm · Wind: {d.wind} km/h
                  </div>
                </Card>
              ))}
        </div>
      )}
    </Card>
  );
}

function MarketCard({
  crop,
  city,
  onClose,
}: {
  crop: string;
  city: City | null;
  onClose: () => void;
}) {
  const [rows, setRows] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const KEY = import.meta.env.VITE_DATA_GOV_API_KEY || "";

  async function load() {
    if (!KEY) return;
    setLoading(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const state = city?.admin1; // best-effort mapping
      const data = await fetchMarketPrices(
        crop.replace(/\s*\(.+\)/, ""),
        state,
        undefined,
        today,
        today
      );
      setRows(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (KEY) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crop, city?.admin1]);

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold">
          Market Prices & Trends {city?.admin1 ? `— ${city.admin1}` : ""}
        </h3>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      {!KEY && (
        <div className="text-sm text-muted-foreground">
          Add your free API key from <b>data.gov.in</b> in <code>.env</code> as{" "}
          <code>VITE_DATA_GOV_API_KEY</code> to load real market data.
        </div>
      )}

      {KEY && (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="py-2">Date</th>
                <th>State</th>
                <th>District</th>
                <th>Market</th>
                <th>Commodity</th>
                <th>Variety</th>
                <th>Min</th>
                <th>Max</th>
                <th>Modal</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={9} className="py-4">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-4 text-muted-foreground">
                    No data.
                  </td>
                </tr>
              )}
              {!loading &&
                rows.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2">{r.arrival_date}</td>
                    <td>{r.state}</td>
                    <td>{r.district}</td>
                    <td>{r.market}</td>
                    <td>{r.commodity}</td>
                    <td>{r.variety}</td>
                    <td>₹{r.min_price}</td>
                    <td>₹{r.max_price}</td>
                    <td>₹{r.modal_price}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function SchemesCard({ onClose }: { onClose: () => void }) {
  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold">Government Schemes & Subsidies</h3>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {SCHEMES.map((s) => (
          <Card key={s.title} className="p-4">
            <div className="font-semibold">{s.title}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.desc}</div>
            <a
              className="text-sm text-emerald-700 underline mt-2 inline-block"
              href={s.url}
              target="_blank"
              rel="noreferrer"
            >
              Open
            </a>
          </Card>
        ))}
      </div>
    </Card>
  );
}

function SoilCard({
  city,
  onClose,
}: {
  city: City | null;
  onClose: () => void;
}) {
  const [rows, setRows] = useState<{ date: string; t: number | null; m: number | null }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!city) return;
      setLoading(true);
      try {
        const url = new URL("https://archive-api.open-meteo.com/v1/era5");
        url.searchParams.set("latitude", String(city.latitude));
        url.searchParams.set("longitude", String(city.longitude));
        url.searchParams.set("hourly", "soil_temperature_0cm,soil_moisture_0_to_7cm");
        url.searchParams.set("timezone", "auto");
        const res = await fetch(url.toString());
        const d = await res.json();
        const time: string[] = d.hourly?.time ?? [];
        const t0: (number | null)[] = d.hourly?.soil_temperature_0cm ?? [];
        const m0: (number | null)[] = d.hourly?.soil_moisture_0_to_7cm ?? [];
        const out: { date: string; t: number | null; m: number | null }[] = [];
        for (let i = 0; i < time.length; i++) {
          if (time[i].endsWith("12:00"))
            out.push({ date: time[i].slice(0, 10), t: t0[i], m: m0[i] });
        }
        setRows(out.slice(0, 7));
      } finally {
        setLoading(false);
      }
    })();
  }, [city?.id]);

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold">
          Soil Health Preview {city ? `— ${city.name}` : ""}
        </h3>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
      {!city && (
        <div className="text-sm text-muted-foreground">
          Select a location to see soil preview.
        </div>
      )}
      {city && (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="py-2">Date</th>
                <th>Soil Temp (°C)</th>
                <th>Soil Moisture (m³/m³)</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={3} className="py-4">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-muted-foreground">
                    No data.
                  </td>
                </tr>
              )}
              {!loading &&
                rows.map((r) => (
                  <tr key={r.date} className="border-t">
                    <td className="py-2">{r.date}</td>
                    <td>{r.t ?? "—"}</td>
                    <td>{r.m ?? "—"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

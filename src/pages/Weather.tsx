import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Droplets,
  Wind,
  Thermometer,
  CloudSun,
  CloudRain,
  Bell,
  LocateFixed,
} from "lucide-react";
import {
  fetchForecast,
  fetchHourly,
  geocodeCity,
  type ForecastDay,
  type HourPoint,
} from "@/services/weather";
import bgGif from "@/assets/bgimage.jpg";

type City = {
  id: string;
  name: string;
  admin1?: string;
  latitude: number;
  longitude: number;
};

type AlertItem = {
  id: string;
  title: string;
  detail: string;
  severity: "info" | "warn" | "danger";
};

type IrrWindow = { time: string; score: number; reason: string };

export default function Weather() {
  const loc = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (loc.pathname !== "/weather") navigate("/weather", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("climate-dark");
    return () => document.documentElement.classList.remove("climate-dark");
  }, []);

  const [query, setQuery] = useState("Mumbai");
  const [matches, setMatches] = useState<City[]>([]);
  const [selected, setSelected] = useState<City | null>(null);

  const [units, setUnits] = useState<"metric" | "imperial">("metric");

  const [days, setDays] = useState<ForecastDay[]>([]);
  const [current, setCurrent] = useState<any>(null);
  const [hourly, setHourly] = useState<HourPoint[] | null>(null);

  const [tab, setTab] = useState<"today" | "tomorrow">("today");
  const [loading, setLoading] = useState(false);

  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  // thresholds (persist)
  const [thresholds, setThresholds] = useState(() => {
    const saved = localStorage.getItem("pp.alert.thresholds");
    return saved ? JSON.parse(saved) : { rainMM: 10, windKMH: 25, heatC: 40, coldC: 8 };
  });
  useEffect(() => {
    localStorage.setItem("pp.alert.thresholds", JSON.stringify(thresholds));
  }, [thresholds]);

  // last city (persist)
  useEffect(() => {
    const raw = localStorage.getItem("pp.last.city");
    if (raw) {
      try {
        setSelected(JSON.parse(raw));
      } catch {}
    }
  }, []);
  useEffect(() => {
    if (selected) localStorage.setItem("pp.last.city", JSON.stringify(selected));
  }, [selected]);

  // loaders
  const search = async () => {
    const res = await geocodeCity(query);
    setMatches(res);
    if (!selected && res[0]) setSelected(res[0]);
  };
  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const fc = await fetchForecast(selected.latitude, selected.longitude);
      setDays(fc.days);
      setCurrent(fc.current);
      try {
        const h = await fetchHourly(selected.latitude, selected.longitude);
        setHourly(h);
      } catch {
        setHourly(null);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  // use my location
  async function useMyLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        // Call Open-Meteo reverse geocoding
        const url = new URL("https://geocoding-api.open-meteo.com/v1/reverse");
        url.searchParams.set("latitude", String(latitude));
        url.searchParams.set("longitude", String(longitude));
        url.searchParams.set("count", "1");
        url.searchParams.set("language", "en");
        url.searchParams.set("format", "json");

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Reverse geocoding failed");
        const data = await res.json();

        const place = data.results?.[0];
        if (place) {
          const city = {
            id: `${latitude},${longitude}`,
            name: `${place.name}`,
            admin1: place.admin1,
            latitude,
            longitude,
          } as City;

          setSelected(city);
          setMatches([city]);
          setQuery(`${place.name}${place.admin1 ? ", " + place.admin1 : ""}`);
        } else {
          // fallback
          const fallback = {
            id: `${latitude},${longitude}`,
            name: "My Location",
            latitude,
            longitude,
          } as City;
          setSelected(fallback);
          setMatches([fallback]);
          setQuery("My Location");
        }
      } catch (err) {
        console.error(err);
        alert("Could not fetch place name for your location");
      }
    },
    () => alert("Could not get your location")
  );
}
        

  // units helpers
  const toTemp = (c: number) => (units === "metric" ? c : (c * 9) / 5 + 32);
  const toWind = (k: number) => (units === "metric" ? k : k * 0.621371);
  const windUnit = units === "metric" ? "km/h" : "mph";

  // derived
  const todayStr = useMemo(
    () => (days[0]?.date ? new Date(days[0].date).toDateString() : ""),
    [days]
  );
  const tomorrowStr = useMemo(
    () => (days[1]?.date ? new Date(days[1].date).toDateString() : ""),
    [days]
  );

  const hourlyForTab = useMemo(() => {
    if (!hourly || days.length === 0) return [];
    const base = tab === "today" ? days[0]?.date : days[1]?.date;
    if (!base) return [];
    const dayPrefix = new Date(base).toISOString().slice(0, 10);
    return hourly.filter((h) => h.time.startsWith(dayPrefix)).slice(0, 12);
  }, [hourly, days, tab]);

  const irrigationToday: IrrWindow[] = useMemo(() => {
    if (!hourly || !days[0]) return [];
    const dayPrefix = new Date(days[0].date).toISOString().slice(0, 10);
    return hourly
      .filter((h) => h.time.startsWith(dayPrefix))
      .map((h) => {
        const rainPenalty = (h.precipitation_prob || 0) * 0.6;
        const tempPenalty = Math.abs(h.temp - 26) * 2;
        const windPenalty = Math.max(0, h.wind - 8) * 2;
        const evapBonus = h.et0 ? Math.max(0, 4 - h.et0) * 5 : 0;
        const humidBonus = (h.humidity >= 60 ? 6 : 0) + (h.humidity >= 80 ? 4 : 0);
        const hour = new Date(h.time).getHours();
        const diurnalBonus = hour <= 9 || hour >= 17 ? 6 : 0;
        const raw =
          100 - rainPenalty - tempPenalty - windPenalty + evapBonus + humidBonus + diurnalBonus;
        const score = Math.max(0, Math.min(100, Math.round(raw)));
        const reason = `Rain ${h.precipitation_prob || 0}% • ${Math.round(h.temp)}°C • Wind ${Math.round(
          h.wind
        )} km/h`;
        return { time: h.time, score, reason };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [hourly, days]);
  const bestHour = irrigationToday[0]?.time;

  useEffect(() => {
    if (!days.length && !hourly?.length) {
      setAlerts([]);
      return;
    }
    const next: AlertItem[] = [];

    const hrDay = [days[0], days[1]].find((d) => d && d.precipitation >= thresholds.rainMM);
    if (hrDay)
      next.push({
        id: "heavy-rain",
        title: "Heavy rain likely",
        detail: `${new Date(hrDay.date).toDateString()}: ${Math.round(hrDay.precipitation)} mm`,
        severity: "danger",
      });

    const hiWind = [days[0], days[1]].find((d) => d && d.wind >= thresholds.windKMH);
    if (hiWind)
      next.push({
        id: "high-wind",
        title: "High wind — avoid spraying",
        detail: `${new Date(hiWind.date).toDateString()}: ${Math.round(hiWind.wind)} km/h`,
        severity: "warn",
      });

    const heat = [days[0], days[1]].find((d) => d && d.temp_max >= thresholds.heatC);
    if (heat)
      next.push({
        id: "heatwave",
        title: "Heat stress risk",
        detail: `${new Date(heat.date).toDateString()}: ${Math.round(heat.temp_max)}°C`,
        severity: "warn",
      });

    const cold = [days[0], days[1]].find((d) => d && d.temp_min <= thresholds.coldC);
    if (cold)
      next.push({
        id: "cold",
        title: "Cold stress risk",
        detail: `${new Date(cold.date).toDateString()}: ${Math.round(cold.temp_min)}°C`,
        severity: "info",
      });

    if (hourly?.length) {
      const riskHour = hourly.slice(0, 12).find(
        (h) =>
          h.humidity >= 85 &&
          h.temp >= 20 &&
          h.temp <= 28 &&
          (h.precipitation >= 1 || (h.precipitation_prob || 0) >= 50)
      );
      if (riskHour)
        next.push({
          id: "pest-risk",
          title: "Pest/disease risk ↑",
          detail: `${new Date(riskHour.time).toLocaleTimeString([], {
            hour: "numeric",
          })}: humidity ${Math.round(riskHour.humidity)}%`,
          severity: "info",
        });
    }

    setAlerts(next);
  }, [days, hourly, thresholds]);

  // stronger glass so it sits on the GIF nicely
  const panelClass =
    "bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl";

  return (
    <div className="relative min-h-screen">
      {/* Background (fixed so it fills while scrolling) */}
      <img
        src={bgGif}
        alt="Weather background"
        className="pointer-events-none select-none fixed inset-0 w-full h-full object-cover"
      />
      {/* Darken a touch for readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/30 to-slate-900/55" />

      {/* Content */}
      <main className="relative z-10 container max-w-6xl mx-auto px-4 py-10 space-y-6 text-white">
        {/* Title / units / back */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl md:text-4xl font-extrabold">7-Day Weather Forecast</h1>

          <div className="flex items-center gap-3">
            <div className="flex gap-1 rounded-full bg-white/25 p-1 shadow">
              <button
                className={`px-3 py-1 rounded-full ${
                  units === "metric" ? "bg-emerald-500/85" : "bg-transparent"
                }`}
                onClick={() => setUnits("metric")}
              >
                °C / km/h
              </button>
              <button
                className={`px-3 py-1 rounded-full ${
                  units === "imperial" ? "bg-emerald-500/85" : "bg-transparent"
                }`}
                onClick={() => setUnits("imperial")}
              >
                °F / mph
              </button>
            </div>

            <Link
              to="/"
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 shadow"
            >
              ⬅ Back to Home
            </Link>
          </div>
        </div>

        {/* Search row */}
        <div className="flex flex-col gap-3 max-w-2xl">
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a city (e.g., Pune)"
              className="bg-white/90 text-slate-900 placeholder:text-slate-500 ring-0 focus:ring-2 focus:ring-emerald-400"
            />
            <Button className="bg-emerald-600 hover:bg-emerald-500 shadow" onClick={search} disabled={loading}>
              <Search className="w-4 h-4 mr-1" /> Search
            </Button>
            <Button
              variant="secondary"
              className="bg-white/90 text-slate-800 shadow"
              onClick={useMyLocation}
              title="Use my current location"
            >
              <LocateFixed className="w-4 h-4 mr-1" /> Use my location
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {matches.map((c) => (
              <Button
                key={c.id}
                variant={selected?.id === c.id ? "default" : "secondary"}
                className={`rounded-xl shadow ${
                  selected?.id === c.id
                    ? "bg-emerald-600 text-white"
                    : "bg-white/90 text-slate-800"
                }`}
                onClick={() => setSelected(c)}
              >
                {c.name}
                {c.admin1 ? `, ${c.admin1}` : ""}
              </Button>
            ))}
          </div>
        </div>

        {/* Hero panel */}
        {current && selected && (
          <Card className={panelClass}>
            <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <div className="text-sm/relaxed opacity-80">
                  {selected.name}
                  {selected.admin1 ? `, ${selected.admin1}` : ""} • Now
                </div>
                <div className="text-6xl font-bold leading-none mt-1">
                  {Math.round(toTemp(current.temperature))}°
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 min-w-[260px]">
                <div className="p-4 rounded-2xl text-center bg-white/30">
                  <Thermometer className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm opacity-80">Feels</div>
                  <div className="font-semibold">
                    {Math.round(toTemp(current.temperature))}°
                  </div>
                </div>
                <div className="p-4 rounded-2xl text-center bg-white/30">
                  <Wind className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm opacity-80">Wind</div>
                  <div className="font-semibold">
                    {Math.round(toWind(current.windspeed))} {windUnit}
                  </div>
                </div>
                <div className="p-4 rounded-2xl text-center bg-white/30">
                  <Droplets className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm opacity-80">Rain (day)</div>
                  <div className="font-semibold">
                    {days[0] ? Math.round(days[0].precipitation) : 0} mm
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Thresholds */}
        <Card className={panelClass}>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">When should I get alerts?</div>
              <select
                className="px-2 py-1 text-sm rounded bg-white/90 text-slate-900"
                onChange={(e) => {
                  const v = e.target.value;
                  const presets: Record<
                    string,
                    { rainMM: number; windKMH: number; heatC: number; coldC: number }
                  > = {
                    general: { rainMM: 10, windKMH: 20, heatC: 38, coldC: 8 },
                    spraySensitive: { rainMM: 8, windKMH: 18, heatC: 40, coldC: 7 },
                    cotton: { rainMM: 12, windKMH: 22, heatC: 42, coldC: 6 },
                  };
                  // @ts-ignore
                  setThresholds(presets[v] || thresholds);
                }}
                defaultValue="general"
                title="Choose a preset that fits your crop"
              >
                <option value="general">Preset: General Veg</option>
                <option value="spraySensitive">Preset: Wheat/Paddy (spray)</option>
                <option value="cotton">Preset: Cotton</option>
              </select>
            </div>

            <div className="grid sm:grid-cols-4 gap-3 text-sm">
              {[
                { label: "Rain ≥ (mm)", key: "rainMM" as const, help: "Alert if daily rain meets/exceeds this." },
                { label: "Wind ≥ (km/h)", key: "windKMH" as const, help: "Avoid spraying when stronger than this." },
                { label: "Heat ≥ (°C)", key: "heatC" as const, help: "Warn for heat stress." },
                { label: "Cold ≤ (°C)", key: "coldC" as const, help: "Warn for cold stress." },
              ].map((f) => (
                <label key={f.key} className="p-3 rounded-2xl bg-white/30">
                  <div className="font-medium">{f.label}</div>
                  <input
                    type="number"
                    className="w-full mt-1 bg-white/90 text-slate-900 rounded"
                    value={(thresholds as any)[f.key]}
                    onChange={(e) =>
                      setThresholds({ ...thresholds, [f.key]: Number(e.target.value || 0) })
                    }
                  />
                  <div className="mt-1 text-xs opacity-80">{f.help}</div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Timely Alerts */}
        <Card className={panelClass}>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <Bell className="w-4 h-4" /> Timely Alerts
              </div>
              <span className="bg-white/30 px-3 py-1 rounded-full">
                Today • {todayStr ? todayStr.slice(0, 3) : ""}
              </span>
            </div>
            {alerts.length === 0 && <div className="opacity-80 text-sm">No alerts right now.</div>}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {alerts.map((a) => (
                <div
                  key={a.id}
                  className={`rounded-2xl p-3 ${
                    a.severity === "danger"
                      ? "bg-red-500/35"
                      : a.severity === "warn"
                      ? "bg-yellow-500/35"
                      : "bg-sky-500/35"
                  }`}
                >
                  <div className="font-medium">{a.title}</div>
                  <div className="text-sm opacity-90">{a.detail}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Best irrigation */}
        {irrigationToday.length > 0 && (
          <Card className={panelClass}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Best time to irrigate (today)</div>
                <span className="bg-white/30 px-3 py-1 rounded-full">
                  Top {irrigationToday.length}
                </span>
              </div>
              <div className="mt-3 flex gap-3 overflow-x-auto">
                {irrigationToday.map((w) => (
                  <div key={w.time} className="p-4 rounded-2xl min-w-[200px] bg-white/30">
                    <div className="text-sm opacity-80">
                      {new Date(w.time).toLocaleTimeString([], { hour: "numeric" })}
                    </div>
                    <div className="text-2xl font-bold leading-none">{w.score}</div>
                    <div className="text-xs opacity-90">{w.reason}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Toggle */}
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1.5 rounded-full ${
              tab === "today" ? "bg-emerald-500/85" : "bg-white/30"
            }`}
            onClick={() => setTab("today")}
          >
            Today • {todayStr ? todayStr.slice(0, 3) : ""}
          </button>
          <button
            className={`px-3 py-1.5 rounded-full ${
              tab === "tomorrow" ? "bg-emerald-500/85" : "bg-white/30"
            }`}
            onClick={() => setTab("tomorrow")}
          >
            Tomorrow • {tomorrowStr ? tomorrowStr.slice(0, 3) : ""}
          </button>
        </div>

        {/* Hourly strip */}
        {hourlyForTab.length > 0 && (
          <Card className={panelClass}>
            <CardContent className="p-5">
              <div className="flex gap-4 overflow-x-auto pb-1">
                {hourlyForTab.map((h) => {
                  const isCurrent = h.time === (bestHour ?? "");
                  return (
                    <div
                      key={h.time}
                      className={`px-3 py-2 rounded-xl bg-white/30 min-w-[84px] text-center ${
                        isCurrent ? "ring-2 ring-emerald-300" : ""
                      }`}
                    >
                      <div className="text-xs opacity-80">
                        {new Date(h.time).toLocaleTimeString([], { hour: "numeric" })}
                      </div>
                      <CloudSun className="w-6 h-6 mx-auto" />
                      <div className="font-semibold">{Math.round(toTemp(h.temp))}°</div>
                      <div className="text-[11px]">{h.precipitation_prob ?? 0}%</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rain sum */}
        {days.length > 0 && (
          <div className="bg-white/30 px-3 py-1 rounded-full inline-block shadow">
            7-day rain sum: {Math.round(days.reduce((s, d) => s + (d.precipitation || 0), 0))} mm
          </div>
        )}

        {/* 7-day grid */}
        <Card className={panelClass}>
          <CardContent className="p-5">
            <div className="grid sm:grid-cols-3 lg:grid-cols-7 gap-3">
              {days.map((d) => (
                <div key={d.date} className="p-4 rounded-2xl text-center bg-white/30">
                  <div className="text-xs opacity-80">
                    {new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <CloudRain className="w-7 h-7 mx-auto" />
                  <div className="mt-1 text-sm">
                    {Math.round(toTemp(d.temp_max))}° / {Math.round(toTemp(d.temp_min))}°
                  </div>
                  <div className="text-xs opacity-90">
                    💧 {Math.round(d.precipitation)} mm • 🌬 {Math.round(toWind(d.wind))} {windUnit}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

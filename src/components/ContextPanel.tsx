import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Leaf, Calendar, Cloud, ArrowRight } from "lucide-react";

import { geocodeCity, fetchForecast } from "@/services/weather";
import { INDIAN_CROPS } from "@/services/crops";

/** Exported types so Index.tsx can import them */
export type City = {
  id: string;
  name: string;
  admin1?: string;
  latitude: number;
  longitude: number;
};

export type PanelType = "forecast" | "market" | "schemes" | "soil";

export function ContextPanel({
  onOpenPanel,
  onLocationChange,
  onCropChange,
}: {
  onOpenPanel: (panel: PanelType) => void;
  onLocationChange?: (city: City | null) => void;
  onCropChange?: (crop: string) => void;
}) {
  const navigate = useNavigate();

  // compact styles
  const smallCard = "rounded-xl border bg-card p-3 shadow-sm";
  const label = "text-[13px] font-semibold text-foreground mb-1";

  // Location state
  const [query, setQuery] = useState("Maharashtra");
  const [matches, setMatches] = useState<City[]>([]);
  const [selected, setSelected] = useState<City | null>(null);
  const [activeIndex, setActiveIndex] = useState(0); // for keyboard nav
  const debounceRef = useRef<number | null>(null);

  // Crop/season state
  const [crop, setCrop] = useState("Paddy (Rice)");
  const [season, setSeason] = useState<"Kharif" | "Rabi" | "Zaid">("Rabi");
  const cropOptions = useMemo(() => INDIAN_CROPS, []);

  // Current weather preview
  const [tempC, setTempC] = useState<number | null>(null);
  const [summary, setSummary] = useState("");
  const [wind, setWind] = useState<number | null>(null);

  // ---- Typeahead search (India) with debounce ----
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      try {
        const list = await geocodeCity(query); // service already filters to India
        setMatches(list);
        // on first load, auto-pick first result and bubble up
        if (!selected && list[0]) {
          setSelected(list[0]);
          onLocationChange?.(list[0]);
        }
      } catch {
        setMatches([]);
      }
    }, 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // ---- When city changes, load weather preview & bubble location up ----
  useEffect(() => {
    (async () => {
      if (!selected) return;
      onLocationChange?.(selected);

      try {
        const fc = await fetchForecast(selected.latitude, selected.longitude);
        setTempC(fc.current?.temperature ?? null);
        setWind(fc.current?.windspeed ?? null);
        if (fc.days?.[0]) {
          const d = fc.days[0];
          setSummary(
            `Max ${Math.round(d.temp_max)}° / Min ${Math.round(d.temp_min)}°C · Rain ${d.precipitation} mm`
          );
        } else {
          setSummary("");
        }
      } catch {
        setTempC(null);
        setWind(null);
        setSummary("");
      }
    })();
  }, [selected?.id]);

  // ---- Bubble crop up when changed ----
  useEffect(() => {
    onCropChange?.(crop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crop]);

  // ---- Helper: choose a city (click/Enter) ----
  function selectCity(c: City) {
    setSelected(c);
    setQuery(c.admin1 ? `${c.name}, ${c.admin1}` : c.name); // fill input
    setMatches([]);                                         // close list
    setActiveIndex(0);
    onLocationChange?.(c);
  }

  return (
    <Card className="p-4 shadow-sm animate-fade-in">
      <h3 className="text-lg font-bold mb-3">Farm Context</h3>

      {/* Location */}
      <div className={`${smallCard} mb-2`}>
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-emerald-700 animate-pulse" />
          <div className={label}>Location</div>
        </div>

        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            // opening is automatic via effect; keep matches as-is while typing
          }}
          onKeyDown={(e) => {
            if (!matches.length) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((i) => Math.min(i + 1, matches.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              selectCity(matches[activeIndex]);
            } else if (e.key === "Escape") {
              setMatches([]);
            }
          }}
          placeholder="Type state / city / village (India)"
          className="h-9 text-sm"
        />

        {matches.length > 0 && (
          <div
            className="mt-2 max-h-44 overflow-auto rounded-md border bg-background text-sm"
            role="listbox"
          >
            {matches.slice(0, 8).map((c, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={c.id}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => selectCity(c)}
                  className={`w-full text-left px-3 py-1.5 transition ${
                    isActive ? "bg-emerald-100" : "hover:bg-emerald-50"
                  }`}
                >
                  {c.name}
                  {c.admin1 ? `, ${c.admin1}` : ""}
                </button>
              );
            })}
          </div>
        )}

        {selected && (
          <div className="mt-2 text-[12px] text-muted-foreground">
            Selected:{" "}
            <span className="font-medium">
              {selected.name}
              {selected.admin1 ? `, ${selected.admin1}` : ""}
            </span>
          </div>
        )}
      </div>

      {/* Crop Type */}
      <div className={`${smallCard} mb-2`}>
        <div className="flex items-center gap-2 mb-1">
          <Leaf className="w-4 h-4 text-emerald-700 animate-pulse" />
          <div className={label}>Crop Type</div>
        </div>
        <Select value={crop} onValueChange={setCrop}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Select crop" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {cropOptions.map((c) => (
              <SelectItem key={c} value={c} className="text-sm">
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Season */}
      <div className={`${smallCard} mb-2`}>
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-4 h-4 text-emerald-700 animate-pulse" />
          <div className={label}>Season</div>
        </div>
        <Select value={season} onValueChange={(v) => setSeason(v as any)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Select season" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Kharif" className="text-sm">
              Kharif (Jun–Oct)
            </SelectItem>
            <SelectItem value="Rabi" className="text-sm">
              Rabi (Nov–Mar)
            </SelectItem>
            <SelectItem value="Zaid" className="text-sm">
              Zaid (Mar–Jun)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Current Weather */}
      <div className={`${smallCard} mb-3`}>
        <div className="flex items-center gap-2 mb-1">
          <Cloud className="w-4 h-4 text-emerald-700 animate-pulse" />
          <div className={label}>Current Weather</div>
        </div>
        {selected ? (
          <>
            <div className="text-2xl font-bold animate-fade-in">
              {tempC !== null ? `${Math.round(tempC)}°C` : "—"}
            </div>
            <div className="text-[13px] text-muted-foreground">
              {summary || "Loading…"}
            </div>
            {wind !== null && (
              <div className="text-[12px] text-muted-foreground mt-1">
                Wind: {wind} km/h
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-muted-foreground">Select a location</div>
        )}
      </div>

      {/* Actions */}
      <div className="grid gap-2">
        {/* 7-day → redirect to /weather */}
        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-between"
          onClick={() => navigate("/weather")}
        >
          7-Day Weather Forecast <ArrowRight className="w-4 h-4" />
        </Button>

        {/* Inline cards on the right (Index.tsx handles rendering) */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between"
          onClick={() => onOpenPanel("market")}
        >
          Market Prices & Trends <ArrowRight className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between"
          onClick={() => onOpenPanel("schemes")}
        >
          Government Schemes & Subsidies <ArrowRight className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between"
          onClick={() => onOpenPanel("soil")}
        >
          Soil Health Report <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

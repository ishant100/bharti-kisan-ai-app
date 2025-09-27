// src/services/weather.ts

export type ForecastDay = {
  date: string;
  temp_max: number;
  temp_min: number;
  precipitation: number;
  wind: number;
  code: number;
};

const BASE = "https://api.open-meteo.com/v1/forecast";

export async function fetchForecast(lat: number, lon: number) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weathercode",
    current_weather: "true",
    timezone: "auto",
  });

  const res = await fetch(`${BASE}?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch forecast");

  const data = await res.json();

  const days: ForecastDay[] = data.daily.time.map((t: string, i: number) => ({
    date: t,
    temp_max: data.daily.temperature_2m_max[i],
    temp_min: data.daily.temperature_2m_min[i],
    precipitation: data.daily.precipitation_sum[i],
    wind: data.daily.windspeed_10m_max[i],
    code: data.daily.weathercode[i],
  }));

  return { current: data.current_weather, days };
}

export async function geocodeCity(q: string) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", q);
  url.searchParams.set("count", "10");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  url.searchParams.set("country", "IN");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Geocoding failed");

  const data = await res.json();
  return (data.results || []).map((r: any) => ({
    id: `${r.id}`,
    name: r.name,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

/* ---------- HOURLY (additions) ---------- */

export type HourPoint = {
  time: string;
  temp: number; // °C
  humidity: number; // %
  precipitation: number; // mm
  precipitation_prob: number; // %
  wind: number; // km/h
  code: number; // weathercode
  et0?: number; // mm (FAO evapotranspiration)
  srad?: number; // W/m² (shortwave radiation)
};

export async function fetchHourly(lat: number, lon: number): Promise<HourPoint[]> {
  const url = new URL(BASE);
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set(
    "hourly",
    [
      "temperature_2m",
      "relative_humidity_2m",
      "weathercode",
      "precipitation",
      "precipitation_probability",
      "windspeed_10m",
      "shortwave_radiation",
      "et0_fao_evapotranspiration",
    ].join(",")
  );
  url.searchParams.set("timezone", "auto");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Hourly fetch failed");
  const data = await res.json();

  return (data.hourly?.time || []).map((t: string, i: number) => ({
    time: t,
    temp: data.hourly.temperature_2m[i],
    humidity: data.hourly.relative_humidity_2m[i],
    precipitation: data.hourly.precipitation[i],
    precipitation_prob: data.hourly.precipitation_probability[i],
    wind: data.hourly.windspeed_10m[i],
    code: data.hourly.weathercode[i],
    srad: data.hourly.shortwave_radiation?.[i],
    et0: data.hourly.et0_fao_evapotranspiration?.[i],
  }));
}

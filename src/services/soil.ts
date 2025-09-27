export type SoilPreview = {
  date: string;
  soil_temp_c: number | null;
  soil_moisture_m3m3: number | null;
};

export async function fetchSoilPreview(lat: number, lon: number): Promise<SoilPreview[]> {
  // Open-Meteo ERA5 variables (hourly); we sample daily at 12:00
  const url = new URL("https://archive-api.open-meteo.com/v1/era5");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("hourly", "soil_temperature_0cm,soil_moisture_0_to_7cm");
  url.searchParams.set("timezone", "auto");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Soil API failed");

  const d = await res.json();
  const time: string[] = d.hourly?.time ?? [];
  const t0: (number | null)[] = d.hourly?.soil_temperature_0cm ?? [];
  const m0: (number | null)[] = d.hourly?.soil_moisture_0_to_7cm ?? [];

  // pick entries at 12:00 each day
  const out: SoilPreview[] = [];
  for (let i = 0; i < time.length; i++) {
    if (time[i].endsWith("12:00")) {
      out.push({
        date: time[i].slice(0, 10),
        soil_temp_c: t0[i],
        soil_moisture_m3m3: m0[i],
      });
    }
  }
  return out.slice(0, 7);
}

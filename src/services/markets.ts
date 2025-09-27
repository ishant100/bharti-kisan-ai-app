// Uses data.gov.in AGMARKNET dataset (free key)
// Get your key: https://data.gov.in -> Profile -> API Keys
// Put in .env as: VITE_DATA_GOV_API_KEY=xxxx

export type MarketPrice = {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  unit_of_price: string;
};

const DATASET = "9ef84268-d588-465a-a308-a864a43d0070"; // AGMARKNET daily prices
const API = "https://api.data.gov.in/resource/" + DATASET;
const KEY = import.meta.env.VITE_DATA_GOV_API_KEY || "";

export async function fetchMarketPrices(
  commodity: string,
  state?: string,
  district?: string,
  from?: string, // "YYYY-MM-DD"
  to?: string     // "YYYY-MM-DD"
): Promise<MarketPrice[]> {
  const params = new URLSearchParams({
    "api-key": KEY,
    format: "json",
    limit: "100",
    "filters[commodity]": commodity,
  });
  if (state) params.set("filters[state]", state);
  if (district) params.set("filters[district]", district);
  if (from) params.set("filters[arrival_date][from]", from);
  if (to) params.set("filters[arrival_date][to]", to);

  const res = await fetch(`${API}?${params.toString()}`);
  if (!res.ok) throw new Error("Market API failed");
  const data = await res.json();

  const rows = (data.records || []) as any[];
  return rows.map(r => ({
    state: r.state,
    district: r.district,
    market: r.market,
    commodity: r.commodity,
    variety: r.variety,
    arrival_date: r.arrival_date,
    min_price: Number(r.min_price),
    max_price: Number(r.max_price),
    modal_price: Number(r.modal_price),
    unit_of_price: r.price_unit || "₹/quintal",
  }));
}

// src/pages/MarketPrices.tsx
import { useMemo, useState } from "react";
import { usePrices } from "@/hooks/usePrices";
import { pctChange } from "@/lib/agmarknet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function MarketPrices() {
  // DEFAULTS: Punjab → Gurdaspur → Kahnuwan, Paddy(Basmati) 1121 Non-FAQ
  const [commodity, setCommodity] = useState("Paddy(Dhan)(Basmati)");
  const [state, setState] = useState("Punjab");
  const [district, setDistrict] = useState("Gurdaspur");
  const [market, setMarket] = useState("Kahnuwan");
  const [variety, setVariety] = useState("1121");
  const [grade, setGrade] = useState("Non-FAQ");

  const [from, setFrom] = useState<string>(
    new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10)
  );
  const [to, setTo] = useState<string>(new Date().toISOString().slice(0, 10));

  const { loading, error, rows, series } = usePrices({
    commodity,
    state,
    district,
    market,
    variety,
    grade,
    from,
    to,
    limit: 500,
  });

  const latest = useMemo(() => series.at(-1)?.modal_avg ?? NaN, [series]);
  const last7 = useMemo(
    () => series.slice(-7).at(-1)?.modal_avg ?? NaN,
    [series]
  );
  const prev7 = useMemo(
    () => series.slice(-14, -7).at(-1)?.modal_avg ?? NaN,
    [series]
  );
  const change7 = pctChange(last7, prev7);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Market Prices & Trends (AGMARKNET)</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Input placeholder="Commodity" value={commodity} onChange={(e) => setCommodity(e.target.value)} />
          <Input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
          <Input placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} />
          <Input placeholder="Market" value={market} onChange={(e) => setMarket(e.target.value)} />
          <Input placeholder="Variety" value={variety} onChange={(e) => setVariety(e.target.value)} />
          <Input placeholder="Grade" value={grade} onChange={(e) => setGrade(e.target.value)} />
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          <div className="col-span-full flex gap-2">
            <Button onClick={() => {
              setFrom(new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10));
              setTo(new Date().toISOString().slice(0, 10));
            }}>Last 7 days</Button>
            <Button onClick={() => {
              setFrom(new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10));
              setTo(new Date().toISOString().slice(0, 10));
            }}>Last 30 days</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Trend (Avg Modal Price)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading…</div>
            ) : error ? (
              <div className="text-red-600 whitespace-pre-wrap">
                {String(error?.message || error)}
              </div>
            ) : series.length === 0 ? (
              <div>No data for the selected filters.</div>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={series}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="modal_avg" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              Latest avg modal (₹/quintal):{" "}
              <b>{Number.isFinite(latest) ? Math.round(latest) : "—"}</b>
            </div>
            <div className="text-sm">
              7-day change:{" "}
              <b>{change7 == null ? "—" : `${change7.toFixed(1)}%`}</b>
            </div>
            <div className="text-xs text-muted-foreground">
              Source: AGMARKNET (DMI), via data.gov.in
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest records</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading…</div>
          ) : rows.length === 0 ? (
            <div>No rows for the selected filters.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">State</th>
                    <th className="py-2 pr-4">District</th>
                    <th className="py-2 pr-4">Market</th>
                    <th className="py-2 pr-4">Commodity</th>
                    <th className="py-2 pr-4">Variety</th>
                    <th className="py-2 pr-4">Grade</th>
                    <th className="py-2 pr-4">Min</th>
                    <th className="py-2 pr-4">Modal</th>
                    <th className="py-2 pr-4">Max</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 100).map((r, i) => (
                    <tr key={i} className="border-b hover:bg-muted/30">
                      <td className="py-2 pr-4">{r.arrival_date}</td>
                      <td className="py-2 pr-4">{r.state}</td>
                      <td className="py-2 pr-4">{r.district}</td>
                      <td className="py-2 pr-4">{r.market}</td>
                      <td className="py-2 pr-4">{r.commodity}</td>
                      <td className="py-2 pr-4">{r.variety}</td>
                      <td className="py-2 pr-4">{r.grade}</td>
                      <td className="py-2 pr-4">₹{r.min_price}</td>
                      <td className="py-2 pr-4">₹{r.modal_price}</td>
                      <td className="py-2 pr-4">₹{r.max_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
 
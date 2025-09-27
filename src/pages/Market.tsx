import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchMarketPrices, type MarketPrice } from "@/services/markets";

export default function MarketPage() {
  const [commodity, setCommodity] = useState("Onion");
  const [rows, setRows] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const today = new Date().toISOString().slice(0,10);
      const data = await fetchMarketPrices(commodity, undefined, undefined, today, today);
      setRows(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-4">
      <div className="flex gap-2 max-w-xl">
        <Input value={commodity} onChange={e=>setCommodity(e.target.value)} placeholder="Commodity e.g., Onion" />
        <Button onClick={load} disabled={loading}>{loading ? "Loading..." : "Fetch"}</Button>
      </div>

      <Card className="p-4">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="py-2">Date</th>
                <th>State</th><th>District</th><th>Market</th>
                <th>Variety</th><th>Min</th><th>Max</th><th>Modal</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={i} className="border-t">
                  <td className="py-2">{r.arrival_date}</td>
                  <td>{r.state}</td><td>{r.district}</td><td>{r.market}</td>
                  <td>{r.variety}</td>
                  <td>₹{r.min_price}</td><td>₹{r.max_price}</td><td>₹{r.modal_price}</td>
                </tr>
              ))}
              {rows.length===0 && <tr><td className="py-6 text-center text-muted-foreground" colSpan={8}>No data</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

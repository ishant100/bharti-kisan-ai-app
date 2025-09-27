import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { fetchSoilPreview, type SoilPreview } from "@/services/soil";

export default function SoilPage() {
  const [rows, setRows] = useState<SoilPreview[]>([]);
  // Example lat/lon (Nagpur). Replace with user's selected coords (from ContextPanel) via context/state.
  const lat = 21.1466, lon = 79.0889;

  useEffect(()=>{
    (async ()=>{
      try { setRows(await fetchSoilPreview(lat, lon)); } catch {}
    })();
  },[]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-4">
      <Card className="p-4">
        <h2 className="font-semibold mb-3">Soil Preview (ERA5)</h2>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr><th className="py-2">Date</th><th>Soil Temp (°C)</th><th>Soil Moisture (m³/m³)</th></tr>
            </thead>
            <tbody>
              {rows.map((r)=>(
                <tr key={r.date} className="border-t">
                  <td className="py-2">{r.date}</td>
                  <td>{r.soil_temp_c ?? "—"}</td>
                  <td>{r.soil_moisture_m3m3 ?? "—"}</td>
                </tr>
              ))}
              {rows.length===0 && <tr><td className="py-6 text-center text-muted-foreground" colSpan={3}>No data</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

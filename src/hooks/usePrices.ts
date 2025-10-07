// src/hooks/usePrices.ts
import { useEffect, useMemo, useState } from "react";
import { fetchPrices, groupByDateAverageModal, PriceQuery, PriceRow } from "@/lib/agmarknet";

type UsePricesResult = {
  loading: boolean;
  error: Error | null;
  rows: PriceRow[];
  series: { date: string; modal_avg: number }[];
};

export function usePrices(q: PriceQuery): UsePricesResult {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<PriceRow[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const cacheKey = useMemo(() => `agmarknet:${JSON.stringify(q)}`, [q]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const { at, data } = JSON.parse(cached);
          if (Date.now() - at < 5 * 60 * 1000) {
            if (!cancelled) {
              setRows(data);
              setLoading(false);
              return;
            }
          }
        }

        const data = await fetchPrices(q);
        if (!cancelled) {
          setRows(data);
          sessionStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), data }));
        }
      } catch (e: any) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cacheKey]);

  const series = useMemo(() => groupByDateAverageModal(rows), [rows]);

  return { loading, error, rows, series };
}

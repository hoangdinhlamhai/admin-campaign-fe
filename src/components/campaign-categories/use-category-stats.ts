import { useCallback, useEffect, useState } from "react";
import {
  fetchDashboardScoped,
  type CategoryScope,
  type CategoryStats,
} from "@/lib/api/stats-api";
import { dateToISO } from "@/lib/format-date";

export function useCategoryStats(mode: CategoryScope, from?: string, to?: string) {
  const todayIso = dateToISO(new Date());
  const effectiveFrom = from || todayIso;
  const effectiveTo = to || todayIso;

  const [stats, setStats] = useState<CategoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    Promise.resolve()
      .then(() => { if (!cancelled) { setLoading(true); setError(null); } })
      .then(() => fetchDashboardScoped(effectiveFrom, effectiveTo, mode))
      .then((res) => {
        if (!cancelled) setStats(res.categoryStats ?? null);
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Lỗi tải dữ liệu");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [mode, effectiveFrom, effectiveTo, tick]);

  const refresh = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  return { stats, loading, error, refresh };
}

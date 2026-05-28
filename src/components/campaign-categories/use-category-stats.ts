import { useCallback, useEffect, useState } from "react";
import {
  fetchDashboardScoped,
  type CategoryScope,
  type CategoryStats,
} from "@/lib/api/stats-api";

export function useCategoryStats(mode: CategoryScope) {
  const [stats, setStats] = useState<CategoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDashboardScoped("today", mode);
      setStats(res.categoryStats ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, loading, error, refresh };
}

import { useState, useEffect, useCallback } from "react";
import { fetchDashboard, type DashboardResponse } from "@/lib/api/stats-api";

export function useOverviewStats(from: string, to: string) {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDashboard(from, to);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi tải dữ liệu tổng quan");
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}

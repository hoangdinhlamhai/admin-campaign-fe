import { useState, useEffect, useCallback } from "react";
import {
  fetchDashboard,
  type DashboardResponse,
  type RangeKey,
} from "@/lib/api/stats-api";

export function useOverviewStats(range: RangeKey) {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDashboard(range);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi tải dữ liệu tổng quan");
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}

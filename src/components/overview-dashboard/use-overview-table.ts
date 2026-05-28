import { useState, useEffect, useCallback } from "react";
import {
  fetchOverviewTable,
  type OverviewTableItem,
} from "@/lib/api/stats-api";

export function useOverviewTable(from: string, to: string, q?: string) {
  const [items, setItems] = useState<OverviewTableItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchOverviewTable(from, to, q);
      setItems(res.items);
      setTotal(res.total);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Lỗi tải bảng hiệu suất"
      );
    } finally {
      setLoading(false);
    }
  }, [from, to, q]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, total, loading, error, refetch: load };
}

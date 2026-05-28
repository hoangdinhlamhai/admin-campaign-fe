import { useState, useEffect, useCallback } from "react";
import { fetchAlerts, acknowledgeAlert, resolveAlert, type AlertApi, type AlertsFilters } from "@/lib/api/alerts-api";
import type { Alert } from "@/lib/alert-management-data";
import { useAlertVersion } from "./use-alert-version";

function apiToAlert(api: AlertApi): Alert {
  return {
    id: api.id,
    severity: api.severity,
    status: api.status,
    type: api.type,
    title: api.title,
    message: api.description ?? "",
    campaignId: api.campaignId,
    triggeredAt: api.triggeredAt,
    resolvedAt: api.resolvedAt,
    resolvedBy: api.resolvedBy,
  };
}

export type UseAlertsResult = {
  alerts: Alert[];
  total: number;
  loading: boolean;
  error: string | null;
  openCount: number;
  acknowledge: (id: string) => Promise<void>;
  resolve: (id: string) => Promise<void>;
  refetch: () => void;
};

export function useAlerts(filters: AlertsFilters = {}): UseAlertsResult {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const version = useAlertVersion();

  // Cheap re-render trigger: serialize filters so the effect runs on shape change.
  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchAlerts(filters)
      .then((res) => {
        if (cancelled) return;
        setAlerts(res.items.map(apiToAlert));
        setTotal(res.total);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Lỗi tải dữ liệu");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, version, filterKey]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  const acknowledge = useCallback(async (id: string) => {
    try {
      await acknowledgeAlert(id);
      // Version will bump server-side; refetch immediately to update current view.
      refetch();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi xác nhận cảnh báo");
    }
  }, [refetch]);

  const resolve = useCallback(async (id: string) => {
    try {
      await resolveAlert(id);
      refetch();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi xử lý cảnh báo");
    }
  }, [refetch]);

  const openCount = alerts.filter((a) => a.status === "open").length;

  return { alerts, total, loading, error, openCount, acknowledge, resolve, refetch };
}

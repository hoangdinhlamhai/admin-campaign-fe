import { useEffect, useState } from "react";
import { fetchAlerts } from "@/lib/api/alerts-api";
import { useAlertVersion } from "./use-alert-version";

// Lightweight hook for sidebar badge: only fetches the count, not the full list.
// Re-fetches whenever the alerts version changes (i.e. any insert/ack/resolve).
export function useAlertOpenCount(): number {
  const version = useAlertVersion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchAlerts({ status: "open", pageSize: 1 })
      .then((r) => { if (!cancelled) setCount(r.total); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [version]);

  return count;
}

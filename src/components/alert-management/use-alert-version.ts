import { useEffect, useState } from "react";
import { fetchAlertsVersion } from "@/lib/api/alerts-api";

// Polls /api/alerts/version every `intervalMs` and on window focus.
// FE consumers re-fetch the alerts list whenever the returned version changes.
export function useAlertVersion(intervalMs = 30000): number {
  const [version, setVersion] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    const tick = async () => {
      try {
        const v = await fetchAlertsVersion();
        if (!cancelled) setVersion(v);
      } catch {
        // Silent: polling will retry next tick.
      }
    };

    tick();
    const id = window.setInterval(tick, intervalMs);
    const onFocus = () => { tick(); };
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [intervalMs]);

  return version;
}

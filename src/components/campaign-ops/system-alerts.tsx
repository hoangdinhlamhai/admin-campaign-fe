import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Info, OctagonAlert, TriangleAlert } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { fetchAlerts, type AlertApi } from "@/lib/api/alerts-api";

export function SystemAlerts() {
  const [alerts, setAlerts] = useState<AlertApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetchAlerts({ status: "open", page: 1, pageSize: 5 });
        if (!cancelled) {
          setAlerts(res.items);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Không thể tải cảnh báo");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const newCount = alerts.length;

  return (
    <article className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Cảnh báo hệ thống</h3>
          <p className="mt-1 text-sm text-muted-foreground">Theo dõi thời gian thực</p>
        </div>
        {newCount > 0 && (
          <span className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-foreground">
            {newCount} mới
          </span>
        )}
      </div>

      <div className="space-y-3">
        {loading && <AlertsSkeleton />}

        {!loading && error && (
          <div className="rounded-2xl border border-rose-300/20 bg-rose-400/10 p-3.5">
            <p className="text-sm text-rose-200">{error}</p>
          </div>
        )}

        {!loading && !error && alerts.length === 0 && (
          <div className="rounded-2xl border border-border bg-surface-2 p-4 text-center">
            <p className="text-sm text-muted-foreground">Không có cảnh báo</p>
          </div>
        )}

        {!loading && !error && alerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </div>

      <Link
        to="/alerts"
        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand transition hover:text-brand/80"
      >
        Xem tất cả cảnh báo
        <ArrowRight className="size-4" />
      </Link>
    </article>
  );
}

function AlertItem({ alert }: { alert: AlertApi }) {
  const severity = alert.severity;
  const Icon = severity === "danger" ? OctagonAlert : severity === "warning" ? TriangleAlert : Info;

  const borderColor =
    severity === "danger" ? "border-rose-300/20 bg-rose-400/10" :
    severity === "warning" ? "border-amber-300/20 bg-amber-400/10" :
    "border-sky-300/20 bg-sky-400/10";

  const iconColor =
    severity === "danger" ? "text-rose-200" :
    severity === "warning" ? "text-amber-200" :
    "text-sky-200";

  const timeAgo = formatDistanceToNow(new Date(alert.triggeredAt), {
    addSuffix: true,
    locale: vi,
  });

  return (
    <div className={`rounded-2xl border p-3.5 ${borderColor}`}>
      <div className="flex gap-3">
        <Icon className={`mt-0.5 size-5 shrink-0 ${iconColor}`} />
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{alert.title}</p>
          {alert.description && (
            <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
          )}
          <p className="mt-2 text-xs font-medium text-muted-foreground">{timeAgo}</p>
        </div>
      </div>
    </div>
  );
}

function AlertsSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-border bg-surface-2 p-3.5">
          <div className="flex gap-3">
            <div className="mt-0.5 size-5 shrink-0 rounded bg-surface-2" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-surface-2" />
              <div className="h-3 w-full rounded bg-surface-2" />
              <div className="h-3 w-1/4 rounded bg-surface-2" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

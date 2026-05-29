import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCheck, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import { type Alert, severityConfig, alertStatusLabels } from "@/lib/alert-management-data";
import { formatRelativeTime } from "./alert-time-utils";

type AlertDetailPanelProps = {
  alert: Alert | null;
  onClose: () => void;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
};

export function AlertDetailPanel({ alert, onClose, onAcknowledge, onResolve }: AlertDetailPanelProps) {
  return (
    <AnimatePresence>
      {alert ? (
        <>
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            animate={{ x: 0 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-border bg-surface shadow-2xl lg:w-[400px]"
            exit={{ x: "100%" }}
            initial={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
          >
            <PanelContent
              alert={alert}
              onAcknowledge={onAcknowledge}
              onClose={onClose}
              onResolve={onResolve}
            />
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function PanelContent({
  alert,
  onClose,
  onAcknowledge,
  onResolve,
}: Omit<AlertDetailPanelProps, "alert"> & { alert: Alert }) {
  const cfg = severityConfig[alert.severity];
  const Icon = cfg.icon;
  const isOpen = alert.status === "open";
  const canResolve = alert.status === "open" || alert.status === "acknowledged";

  return (
    <>
      {/* Header */}
      <div className="flex items-start gap-3 border-b border-border p-5">
        <span className={`mt-0.5 shrink-0 rounded-xl p-2 ${cfg.bgColor}`}>
          <Icon className={`size-5 ${cfg.color}`} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{cfg.label}</p>
          <h3 className="mt-0.5 text-base font-semibold leading-snug text-foreground">{alert.title}</h3>
        </div>
        <button
          aria-label="Đóng"
          className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"
          onClick={onClose}
          type="button"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{alert.message}</p>

        <div className="space-y-2 rounded-xl border border-border bg-surface-2 p-4 text-sm">
          <Row label="Trạng thái">
            <StatusBadge status={alert.status} />
          </Row>
          <Row label="Thời gian">
            <span className="text-muted-foreground">{formatRelativeTime(alert.triggeredAt)}</span>
          </Row>
          <Row label="Chiến dịch">
            {alert.campaignId ? (
              <Link
                className="font-medium text-brand transition hover:text-brand/80 hover:underline"
                to={`/campaigns/${alert.campaignId}`}
              >
                {alert.campaignId}
              </Link>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </Row>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap gap-2 border-t border-border p-5">
        {isOpen && (
          <button
            className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/15 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/25"
            onClick={() => { onAcknowledge(alert.id); onClose(); }}
            type="button"
          >
            <CheckCheck className="size-4" />
            Xác nhận
          </button>
        )}
        {canResolve && (
          <button
            className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/15 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/25"
            onClick={() => { onResolve(alert.id); onClose(); }}
            type="button"
          >
            <ShieldCheck className="size-4" />
            Đã xử lý
          </button>
        )}
      </div>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span>{children}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: Alert["status"] }) {
  const styles: Record<Alert["status"], string> = {
    open: "bg-rose-500/15 text-rose-400 border-rose-500/20",
    acknowledged: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    resolved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}>
      {alertStatusLabels[status]}
    </span>
  );
}

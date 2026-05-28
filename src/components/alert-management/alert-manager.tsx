import { useState } from "react";
import { AdminShell } from "@/components/campaign-ops/admin-shell";
import { Toast } from "@/components/campaign-ops/toast";
import { useAlerts } from "./use-alerts";
import { AlertHeader } from "./alert-header";
import { AlertTable } from "./alert-table";
import { AlertDetailPanel } from "./alert-detail-panel";
import type { AlertsFilters } from "@/lib/api/alerts-api";

const DEFAULT_PAGE_SIZE = 10;

export function AlertManager() {
  const [filters, setFilters] = useState<AlertsFilters>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const { alerts, total, loading, error, openCount, acknowledge, resolve } = useAlerts(filters);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }

  async function handleAcknowledge(id: string) {
    await acknowledge(id);
    showToast("Đã xác nhận cảnh báo.");
  }

  async function handleResolve(id: string) {
    await resolve(id);
    showToast("Đã xử lý cảnh báo.");
  }

  const openAlert = selectedAlertId ? alerts.find((a) => a.id === selectedAlertId) ?? null : null;

  return (
    <div>
      <AdminShell activeLabel="Cảnh báo">
        <AlertHeader openCount={openCount} />

        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        <AlertTable
          alerts={alerts}
          filters={filters}
          loading={loading}
          onAcknowledge={handleAcknowledge}
          onFiltersChange={setFilters}
          onResolve={handleResolve}
          onRowClick={(id) => setSelectedAlertId(id)}
          total={total}
        />
      </AdminShell>

      <AlertDetailPanel
        alert={openAlert}
        onAcknowledge={handleAcknowledge}
        onClose={() => setSelectedAlertId(null)}
        onResolve={handleResolve}
      />

      <Toast message={toast} />
    </div>
  );
}

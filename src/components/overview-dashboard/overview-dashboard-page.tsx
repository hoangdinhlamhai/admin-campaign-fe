import { AdminShell } from "@/components/campaign-ops/admin-shell";
import { OverviewHeader } from "./overview-header";
import { OverviewMetricCards } from "./overview-metric-cards";
import { PerformanceTable } from "./performance-table";

export function OverviewDashboardPage() {
  return (
    <AdminShell activeLabel="Tổng quan">
      <OverviewHeader />
      <OverviewMetricCards />
      <PerformanceTable />
    </AdminShell>
  );
}

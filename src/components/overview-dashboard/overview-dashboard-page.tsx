import { useState } from "react";
import { AdminShell } from "@/components/campaign-ops/admin-shell";
import { OverviewHeader } from "./overview-header";
import { OverviewMetricCards } from "./overview-metric-cards";
import { PerformanceTable } from "./performance-table";
import { useOverviewStats } from "./use-overview-stats";
import { useOverviewTable } from "./use-overview-table";
import type { RangeKey } from "@/lib/api/stats-api";

export function OverviewDashboardPage() {
  const [range, setRange] = useState<RangeKey>("7d");
  const [searchQuery, setSearchQuery] = useState("");

  const stats = useOverviewStats(range);
  const table = useOverviewTable(range, searchQuery || undefined);

  return (
    <AdminShell activeLabel="Tổng quan">
      <OverviewHeader range={range} onRangeChange={setRange} />
      <OverviewMetricCards data={stats.data} loading={stats.loading} error={stats.error} />
      <PerformanceTable
        items={table.items}
        total={table.total}
        loading={table.loading}
        error={table.error}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </AdminShell>
  );
}

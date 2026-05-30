import { useState } from "react";
import { AdminShell } from "@/components/campaign-ops/admin-shell";
import { OverviewHeader } from "./overview-header";
import { OverviewMetricCards } from "./overview-metric-cards";
import { PerformanceTable } from "./performance-table";
import { useOverviewStats } from "./use-overview-stats";
import { useOverviewTable } from "./use-overview-table";
import { dateToISO } from "@/lib/format-date";
import type { DateRangeValue } from "@/components/common/date-range-picker";

export function OverviewDashboardPage() {
  const [dateRange, setDateRange] = useState<DateRangeValue>(() => {
    const today = new Date();
    return { from: today, to: today };
  });
  const [searchQuery, setSearchQuery] = useState("");

  const fromISO = dateToISO(dateRange.from);
  const toISO = dateToISO(dateRange.to);

  const stats = useOverviewStats(fromISO, toISO);
  const table = useOverviewTable(fromISO, toISO, searchQuery || undefined);

  return (
    <AdminShell activeLabel="Tổng quan">
      <OverviewHeader
        value={dateRange}
        onChange={setDateRange}
        onRefresh={() => {
          stats.refetch();
          table.refetch();
        }}
        loading={stats.loading || table.loading}
      />
      <OverviewMetricCards data={stats.data} loading={stats.loading} error={stats.error} />
      <PerformanceTable
        items={table.items}
        total={table.total}
        loading={table.loading}
        error={table.error}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        rangeFrom={fromISO}
        rangeTo={toISO}
      />
    </AdminShell>
  );
}

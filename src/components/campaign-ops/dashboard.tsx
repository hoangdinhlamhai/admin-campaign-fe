import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { automationRules } from "@/lib/campaign-ops-data";
import { dateToISO } from "@/lib/format-date";
import type { DateRangeValue } from "@/components/common/date-range-picker";
import { useCampaignsApi } from "./use-campaigns-api";
import { AdminShell } from "./admin-shell";
import { AutomationRules } from "./automation-rules";
import { CampaignTable } from "./campaign-table";
import { DashboardHeader } from "./dashboard-header";
import { StatsCards } from "./stats-cards";
import { SystemAlerts } from "./system-alerts";
import { Toast } from "./toast";

function getToday(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

export function CampaignOpsDashboard() {
  const navigate = useNavigate();
  const today = getToday();

  const [dateRange, setDateRange] = useState<DateRangeValue>({ from: today, to: today });
  const dateFrom = dateToISO(dateRange.from);
  const dateTo = dateToISO(dateRange.to);

  const [dateFilter] = useState<string>(dateFrom);
  const { campaigns, loading, error, publishCampaign, pauseCampaign, deleteCampaign } = useCampaignsApi(dateFilter, dateFrom, dateTo);

  const [statsRefetchTrigger, setStatsRefetchTrigger] = useState(0);
  const bumpStats = useCallback(() => setStatsRefetchTrigger((n) => n + 1), []);

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const handlePublish = async (id: string) => {
    const ok = await publishCampaign(id);
    showToast(ok ? "Đã xuất bản chiến dịch." : "Lỗi xuất bản chiến dịch.");
    if (ok) bumpStats();
  };

  const handlePause = async (id: string) => {
    const ok = await pauseCampaign(id);
    showToast(ok ? "Đã tạm dừng chiến dịch." : "Lỗi tạm dừng chiến dịch.");
    if (ok) bumpStats();
  };

  const handleDelete = async (id: string) => {
    await deleteCampaign(id);
    showToast("Đã xóa chiến dịch.");
    bumpStats();
  };

  const handleEdit = (id: string) => {
    navigate(`/campaigns/${id}/edit`);
  };

  const handleViewDetail = (id: string) => {
    navigate(`/campaigns/${id}`);
  };

  return (
    <div>
      <AdminShell activeLabel="Chiến dịch">
        <DashboardHeader dateRange={dateRange} onDateRangeChange={setDateRange} />
        {error ? (
          <div className="mb-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
            Lỗi tải dữ liệu: {error}
          </div>
        ) : null}
        {loading ? (
          <div className="mb-4 rounded-xl border border-border bg-surface px-4 py-8 text-center text-sm text-muted-foreground">
            Đang tải dữ liệu chiến dịch...
          </div>
        ) : (
          <>
            <StatsCards from={dateFrom} to={dateTo} refetchTrigger={statsRefetchTrigger} />
            <CampaignTable
              campaigns={campaigns}
              dateFilter={dateFilter}
              dateFrom={dateFrom}
              dateTo={dateTo}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onPause={handlePause}
              onPublish={handlePublish}
              onViewDetail={handleViewDetail}
            />
          </>
        )}
        <section className="grid gap-4 pb-8 xl:grid-cols-2">
          <SystemAlerts />
          <AutomationRules rules={automationRules} />
        </section>
      </AdminShell>
      <Toast message={toast} />
    </div>
  );
}

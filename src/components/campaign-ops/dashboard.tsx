import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { automationRules } from "@/lib/campaign-ops-data";
import { apiFetch } from "@/lib/api/config";
import { useCampaignsApi } from "./use-campaigns-api";
import { AdminShell } from "./admin-shell";
import { AutomationRules } from "./automation-rules";
import { CampaignHealth } from "./campaign-health";
import { CampaignTable } from "./campaign-table";
import { DashboardHeader } from "./dashboard-header";
import { StatsCards } from "./stats-cards";
import type { DashboardStats } from "./stats-cards";
import { SystemAlerts } from "./system-alerts";
import { Toast } from "./toast";

const EMPTY_STATS: DashboardStats = {
  totalTarget: 0,
  totalCompleted: 0,
  totalMissing: 0,
  totalDisplays: 0,
  totalWrong: 0,
};

type DashboardApiResponse = {
  stats: {
    totalTarget: number;
    totalCompleted: number;
    totalMissing: number;
    totalDisplays: number;
    totalWrong: number;
  };
};

function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);

  useEffect(() => {
    apiFetch<DashboardApiResponse>("/api/stats/dashboard")
      .then((res) => {
        if (res?.stats) {
          setStats({
            totalTarget: res.stats.totalTarget ?? 0,
            totalCompleted: res.stats.totalCompleted ?? 0,
            totalMissing: res.stats.totalMissing ?? 0,
            totalDisplays: res.stats.totalDisplays ?? 0,
            totalWrong: res.stats.totalWrong ?? 0,
          });
        }
      })
      .catch(() => {
        // stats endpoint unavailable — keep zeros
      });
  }, []);

  return stats;
}

export function CampaignOpsDashboard() {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const [dateFilter, setDateFilter] = useState<string>(today);
  const { campaigns, loading, error, publishCampaign, pauseCampaign, deleteCampaign } = useCampaignsApi(dateFilter);
  const stats = useDashboardStats();
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const handlePublish = async (id: string) => {
    const ok = await publishCampaign(id);
    showToast(ok ? "Đã xuất bản chiến dịch." : "Lỗi xuất bản chiến dịch.");
  };

  const handlePause = async (id: string) => {
    const ok = await pauseCampaign(id);
    showToast(ok ? "Đã tạm dừng chiến dịch." : "Lỗi tạm dừng chiến dịch.");
  };

  const handleDelete = async (id: string) => {
    await deleteCampaign(id);
    showToast("Đã xóa chiến dịch.");
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
        <DashboardHeader />
        {error ? (
          <div className="mb-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
            Lỗi tải dữ liệu: {error}
          </div>
        ) : null}
        {loading ? (
          <div className="mb-4 rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-8 text-center text-sm text-zinc-400">
            Đang tải dữ liệu chiến dịch...
          </div>
        ) : (
          <>
            <StatsCards stats={stats} />
            <CampaignTable
              campaigns={campaigns}
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onPause={handlePause}
              onPublish={handlePublish}
              onViewDetail={handleViewDetail}
            />
          </>
        )}
        <section className="grid gap-4 pb-8 xl:grid-cols-[1.08fr_0.92fr_1fr]">
          <SystemAlerts />
          <CampaignHealth />
          <AutomationRules rules={automationRules} />
        </section>
      </AdminShell>
      <Toast message={toast} />
    </div>
  );
}

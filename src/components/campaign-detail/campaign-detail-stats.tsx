import { useEffect, useState } from "react";
import { Activity, AlertTriangle, ShieldCheck, TrendingDown } from "lucide-react";
import { fetchCampaignLockStats } from "@/lib/api/campaigns-api";

type Props = {
  campaignId: string;
  dailyTarget: number;
  createdAt: string;
};

type StatsBundle = {
  completed: number;
  wrong: number;
  valid: number;
};

const EMPTY: StatsBundle = { completed: 0, wrong: 0, valid: 0 };

async function loadStats(campaignId: string, from: string, to: string): Promise<StatsBundle> {
  const res = await fetchCampaignLockStats(campaignId, from, to);
  return {
    completed: res.unlocked ?? 0,
    wrong: res.passInvalid ?? 0,
    valid: res.passValid ?? 0,
  };
}

function diffDays(from: string, to: string): number {
  const ms = new Date(`${to}T00:00:00Z`).getTime() - new Date(`${from}T00:00:00Z`).getTime();
  return Math.round(ms / 86400000) + 1;
}

export function CampaignDetailStats({ campaignId, dailyTarget, createdAt }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [filter, setFilter] = useState<"today" | "all" | "custom">("today");
  const [customDate, setCustomDate] = useState(today);
  const [stats, setStats] = useState<StatsBundle>(EMPTY);
  const [loading, setLoading] = useState(true);

  const createdDay = createdAt.slice(0, 10);
  const from = filter === "today" ? today : filter === "all" ? createdDay : customDate;
  const to = filter === "today" ? today : filter === "all" ? today : customDate;
  const days = diffDays(from, to);

  useEffect(() => {
    setLoading(true);
    loadStats(campaignId, from, to)
      .then(setStats)
      .catch(() => setStats(EMPTY))
      .finally(() => setLoading(false));
  }, [campaignId, from, to]);

  const periodTarget = dailyTarget * days;
  const missing = periodTarget > 0 ? Math.max(0, periodTarget - stats.completed) : 0;
  const passTotal = stats.wrong + stats.valid;
  const wrongRate = passTotal > 0 ? (stats.wrong / passTotal) * 100 : 0;
  const progress = periodTarget > 0 ? Math.min(100, Math.round((stats.completed / periodTarget) * 100)) : 0;

  return (
    <section className="glass-card p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">Số liệu hoạt động</h3>
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip active={filter === "today"} onClick={() => setFilter("today")}>Hôm nay</FilterChip>
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>Tổng tất cả</FilterChip>
          <FilterChip active={filter === "custom"} onClick={() => setFilter("custom")}>Chọn ngày</FilterChip>
          {filter === "custom" && (
            <input
              className="h-9 rounded-lg border border-border bg-surface-2 px-2 text-sm text-foreground outline-none focus:border-brand/45"
              onChange={(e) => setCustomDate(e.target.value)}
              type="date"
              value={customDate}
            />
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Activity className="size-4" />}
          label="Mục tiêu"
          value={periodTarget}
          meta={`${progress}% tiến độ`}
          tone="brand"
          loading={loading}
        />
        <StatCard
          icon={<ShieldCheck className="size-4" />}
          label="Đã hoàn thành"
          value={stats.completed}
          meta={`${stats.valid} pass đúng`}
          tone="success"
          loading={loading}
        />
        <StatCard
          icon={<AlertTriangle className="size-4" />}
          label="Còn thiếu"
          value={missing}
          meta={days > 1 ? `user (${days} ngày)` : "user/ngày"}
          tone="warning"
          loading={loading}
        />
        <StatCard
          icon={<TrendingDown className="size-4" />}
          label="Tỷ lệ sai"
          value={`${wrongRate.toFixed(1)}%`}
          meta={`${stats.wrong} lần nhập sai`}
          tone="danger"
          loading={loading}
        />
      </div>
    </section>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      className={`h-9 rounded-lg px-3 text-sm font-semibold transition ${active ? "bg-brand text-brand-foreground" : "border border-border bg-surface-2 text-muted-foreground hover:bg-surface"}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

const TONE_BG: Record<string, string> = {
  brand: "bg-brand/15 text-brand",
  success: "bg-brand/15 text-brand",
  warning: "bg-amber-400/12 text-amber-300",
  danger: "bg-rose-400/12 text-rose-300",
};

function StatCard({
  icon,
  label,
  value,
  meta,
  tone,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  meta: string;
  tone: "brand" | "success" | "warning" | "danger";
  loading: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className={`grid size-8 place-items-center rounded-lg ${TONE_BG[tone]}`}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{loading ? "—" : value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{meta}</p>
    </div>
  );
}

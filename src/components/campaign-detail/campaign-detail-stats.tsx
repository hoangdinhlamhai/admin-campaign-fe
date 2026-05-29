import { useEffect, useState } from "react";
import { Activity, AlertTriangle, ShieldCheck, TrendingDown } from "lucide-react";
import { fetchCampaigns, type CampaignApi } from "@/lib/api/campaigns-api";

type Props = {
  campaignId: string;
  dailyTarget: number;
};

type StatsBundle = {
  completed: number;
  missing: number;
  wrong: number;
  valid: number;
};

const EMPTY: StatsBundle = { completed: 0, missing: 0, wrong: 0, valid: 0 };

async function loadStats(campaignId: string, date: string): Promise<StatsBundle> {
  const res = await fetchCampaigns(date);
  const items = Array.isArray(res) ? res : (res.value ?? []);
  const found = items.find((c: CampaignApi) => c.id === campaignId);
  if (!found) return EMPTY;
  return {
    completed: found.completedCount ?? 0,
    missing: found.missingCount ?? 0,
    wrong: found.wrongEntryCount ?? 0,
    valid: found.validEntryCount ?? 0,
  };
}

export function CampaignDetailStats({ campaignId, dailyTarget }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [filter, setFilter] = useState<"today" | "all" | "custom">("today");
  const [customDate, setCustomDate] = useState(today);
  const [stats, setStats] = useState<StatsBundle>(EMPTY);
  const [loading, setLoading] = useState(true);

  const date = filter === "today" ? today : filter === "all" ? "all" : customDate;

  useEffect(() => {
    setLoading(true);
    loadStats(campaignId, date)
      .then(setStats)
      .finally(() => setLoading(false));
  }, [campaignId, date]);

  const total = stats.wrong + stats.valid;
  const wrongRate = total > 0 ? (stats.wrong / total) * 100 : 0;
  const progress = dailyTarget > 0 ? Math.min(100, Math.round((stats.completed / dailyTarget) * 100)) : 0;

  return (
    <section className="rounded-[1.1rem] border border-border bg-surface p-4 shadow-2xl backdrop-blur-2xl sm:p-5">
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
          value={dailyTarget}
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
          value={stats.missing}
          meta="user/ngày"
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
  brand: "bg-emerald-300/12 text-emerald-300",
  success: "bg-lime-300/12 text-lime-300",
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

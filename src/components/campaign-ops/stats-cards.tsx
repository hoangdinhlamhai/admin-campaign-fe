import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, BarChart3, PauseCircle, ShieldCheck, Target } from "lucide-react";
import { fetchCampaignsSummary, type CampaignsSummaryResponse } from "@/lib/api/stats-api";

export type StatsCardsProps = {
  from: string;
  to: string;
  /** Increment this value to force a refetch (e.g. after mutation) */
  refetchTrigger: number;
};

type CardStats = {
  totalUserTarget: number;
  totalCompleted: number;
  totalMissing: number;
  pausedCount: number;
  totalWrongEntries: number;
};

const EMPTY_STATS: CardStats = {
  totalUserTarget: 0,
  totalCompleted: 0,
  totalMissing: 0,
  pausedCount: 0,
  totalWrongEntries: 0,
};

const cards = [
  {
    key: "totalUserTarget" as const,
    label: "User cần chạy / ngày",
    tone: "text-brand",
    accentBg: "bg-brand/15 text-brand",
    Icon: Target,
  },
  {
    key: "totalCompleted" as const,
    label: "Đã hoàn thành hôm nay",
    tone: "text-success",
    accentBg: "bg-success/15 text-success",
    Icon: ShieldCheck,
  },
  {
    key: "totalMissing" as const,
    label: "Còn thiếu hôm nay",
    tone: "text-warning",
    accentBg: "bg-warning/15 text-warning",
    Icon: AlertTriangle,
  },
  {
    key: "pausedCount" as const,
    label: "Chiến dịch tạm dừng",
    tone: "text-danger",
    accentBg: "bg-danger/15 text-danger",
    Icon: PauseCircle,
  },
  {
    key: "totalWrongEntries" as const,
    label: "Lượt nhập sai hôm nay",
    tone: "text-danger",
    accentBg: "bg-danger/15 text-danger",
    Icon: BarChart3,
  },
] as const;

export function StatsCards({ from, to, refetchTrigger }: StatsCardsProps) {
  const [stats, setStats] = useState<CardStats>(EMPTY_STATS);

  const loadStats = useCallback(() => {
    fetchCampaignsSummary(from, to)
      .then((res: CampaignsSummaryResponse) => {
        setStats({
          totalUserTarget: res.totalUserTarget ?? 0,
          totalCompleted: res.totalCompleted ?? 0,
          totalMissing: res.totalMissing ?? 0,
          pausedCount: res.pausedCount ?? 0,
          totalWrongEntries: res.totalWrongEntries ?? 0,
        });
      })
      .catch(() => {
        // endpoint unavailable — keep zeros
      });
  }, [from, to]);

  useEffect(() => {
    loadStats();
  }, [loadStats, refetchTrigger]);

  return (
    <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5" aria-label="Chỉ số tổng quan">
      {cards.map(({ key, label, tone, accentBg, Icon }) => (
        <article
          key={key}
          className="glass-card group p-4 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          <div className="mb-5 flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <span className={`grid size-9 shrink-0 place-items-center rounded-xl transition ${accentBg}`}>
              <Icon className="size-4" />
            </span>
          </div>
          <div className="flex items-end justify-between gap-3">
            <span className="font-mono text-4xl font-semibold tracking-tight text-foreground">
              {stats[key]}
            </span>
            <span className={`rounded-full bg-foreground/[0.04] px-2.5 py-1 text-sm font-semibold ${tone}`}>
              —
            </span>
          </div>
        </article>
      ))}
    </section>
  );
}

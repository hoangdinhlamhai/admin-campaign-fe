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
    tone: "text-lime-200",
    Icon: Target,
  },
  {
    key: "totalCompleted" as const,
    label: "Đã hoàn thành hôm nay",
    tone: "text-emerald-200",
    Icon: ShieldCheck,
  },
  {
    key: "totalMissing" as const,
    label: "Còn thiếu hôm nay",
    tone: "text-amber-200",
    Icon: AlertTriangle,
  },
  {
    key: "pausedCount" as const,
    label: "Chiến dịch tạm dừng",
    tone: "text-rose-200",
    Icon: PauseCircle,
  },
  {
    key: "totalWrongEntries" as const,
    label: "Lượt nhập sai hôm nay",
    tone: "text-rose-200",
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
      {cards.map(({ key, label, tone, Icon }) => (
        <article
          key={key}
          className="group rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-xl shadow-zinc-950/20 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.085]"
        >
          <div className="mb-5 flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-zinc-400">{label}</p>
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/[0.08] text-lime-100 transition group-hover:bg-emerald-300/18">
              <Icon className="size-4" />
            </span>
          </div>
          <div className="flex items-end justify-between gap-3">
            <span className="font-mono text-4xl font-semibold tracking-tight text-white">
              {stats[key]}
            </span>
            <span className={`rounded-full bg-white/[0.07] px-2.5 py-1 text-sm font-semibold ${tone}`}>
              —
            </span>
          </div>
        </article>
      ))}
    </section>
  );
}

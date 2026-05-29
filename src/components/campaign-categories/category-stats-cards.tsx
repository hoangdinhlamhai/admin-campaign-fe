import {
  AlertTriangle,
  FolderTree,
  Megaphone,
  PauseCircle,
  RefreshCw,
  ShieldCheck,
  Target,
} from "lucide-react";
import { useCategoryStats } from "./use-category-stats";
import type { CategoryStats } from "@/lib/api/stats-api";
import type { LucideIcon } from "lucide-react";

type Props = {
  mode: "parent" | "child";
  from?: string;
  to?: string;
};

type CardConfig = {
  key: keyof CategoryStats;
  label: string;
  tone: string;
  Icon: LucideIcon;
};

function getCards(mode: "parent" | "child"): CardConfig[] {
  return [
    {
      key: "totalCategoryCount",
      label: mode === "parent" ? "Tổng danh mục cha" : "Tổng danh mục con",
      tone: "text-lime-200",
      Icon: FolderTree,
    },
    {
      key: "totalCampaignCount",
      label: "Tổng chiến dịch",
      tone: "text-sky-200",
      Icon: Megaphone,
    },
    {
      key: "rangeTarget",
      label: "User cần chạy (trong kỳ)",
      tone: "text-lime-200",
      Icon: Target,
    },
    {
      key: "rangeCompleted",
      label: "Đã hoàn thành (trong kỳ)",
      tone: "text-emerald-200",
      Icon: ShieldCheck,
    },
    {
      key: "rangeMissing",
      label: "Còn thiếu (trong kỳ)",
      tone: "text-amber-200",
      Icon: AlertTriangle,
    },
    {
      key: "pausedCampaignCount",
      label: "Chiến dịch tạm dừng",
      tone: "text-rose-200",
      Icon: PauseCircle,
    },
  ];
}

export function CategoryStatsCards({ mode, from, to }: Props) {
  const { stats, loading, error, refresh } = useCategoryStats(mode, from, to);
  const cards = getCards(mode);

  return (
    <section className="mb-5" aria-label="Chỉ số danh mục">
      <div className="mb-3 flex items-center justify-end">
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-surface-2/80 disabled:opacity-50"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </button>
      </div>

      {error && (
        <p className="mb-3 text-sm text-rose-400">{error}</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {cards.map(({ key, label, tone, Icon }) => (
          <article
            key={key}
            className="group rounded-[1.1rem] border border-border bg-surface p-4 shadow-xl backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:bg-surface-2"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-brand transition group-hover:bg-brand/18">
                <Icon className="size-4" />
              </span>
            </div>
            <div className="flex items-end justify-between gap-3">
              <span className="font-mono text-4xl font-semibold tracking-tight text-foreground">
                {stats?.[key] ?? 0}
              </span>
              <span
                className={`rounded-full bg-surface-2 px-2.5 py-1 text-sm font-semibold ${tone}`}
              >
                &mdash;
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

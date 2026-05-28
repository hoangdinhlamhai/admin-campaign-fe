import {
  CheckSquare,
  DollarSign,
  Gift,
  MousePointer2,
  Target,
  TrendingUp,
} from "lucide-react";
import { toneClass, type MetricTone } from "@/lib/overview-dashboard-data";
import { formatDelta, type DeltaTone } from "./format-delta";
import type { DashboardResponse } from "@/lib/api/stats-api";

type Props = {
  data: DashboardResponse | null;
  loading: boolean;
  error: string | null;
};

type MetricConfig = {
  id: string;
  label: string;
  meta: string;
  tone: MetricTone;
  icon: React.ComponentType<{ className?: string }>;
  isAd: boolean;
  getValue: (stats: DashboardResponse["stats"]) => number;
  getPrev: (stats: DashboardResponse["stats"]) => number;
  formatValue: (v: number) => string;
};

const metrics: MetricConfig[] = [
  {
    id: "ad-cost",
    label: "Chi phí quảng cáo",
    meta: "Tổng chi tiêu",
    tone: "blue",
    icon: DollarSign,
    isAd: true,
    getValue: () => 0,
    getPrev: () => 0,
    formatValue: () => "—",
  },
  {
    id: "clicks",
    label: "Lượt click",
    meta: "Tổng click",
    tone: "emerald",
    icon: MousePointer2,
    isAd: true,
    getValue: () => 0,
    getPrev: () => 0,
    formatValue: () => "—",
  },
  {
    id: "quiz-completed",
    label: "Hoàn thành quiz",
    meta: "Số người hoàn thành",
    tone: "indigo",
    icon: CheckSquare,
    isAd: false,
    getValue: (s) => s.totalValid,
    getPrev: (s) => s.totalValid,
    formatValue: (v) => new Intl.NumberFormat("vi-VN").format(v),
  },
  {
    id: "tasks-completed",
    label: "Hoàn thành nhiệm vụ",
    meta: "Số lần hoàn thành",
    tone: "amber",
    icon: Gift,
    isAd: false,
    getValue: (s) => s.totalCompleted,
    getPrev: (s) => s.totalCompleted,
    formatValue: (v) => new Intl.NumberFormat("vi-VN").format(v),
  },
  {
    id: "cpa",
    label: "CPA (Chi phí / 1 nhiệm vụ)",
    meta: "Trung bình",
    tone: "rose",
    icon: Target,
    isAd: true,
    getValue: () => 0,
    getPrev: () => 0,
    formatValue: () => "—",
  },
  {
    id: "conversion",
    label: "Tỷ lệ chuyển đổi",
    meta: "Tỷ lệ nhiệm vụ / click",
    tone: "teal",
    icon: TrendingUp,
    isAd: false,
    getValue: (s) => s.conversionRate,
    getPrev: (s) => s.conversionRate,
    formatValue: (v) => `${v.toFixed(2)}%`,
  },
];

const deltaToneClass: Record<DeltaTone, string> = {
  up: "text-emerald-300",
  down: "text-rose-300",
  flat: "text-zinc-500",
};

export function OverviewMetricCards({ data, loading, error }: Props) {
  if (error) {
    return (
      <section className="mb-5 rounded-[1.1rem] border border-rose-400/20 bg-zinc-900/58 p-4 text-sm text-rose-300">
        Lỗi tải dữ liệu: {error}
      </section>
    );
  }

  return (
    <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const isLoading = loading || !data;

        let displayValue = "—";
        let deltaText = "";
        let deltaTone: DeltaTone = "flat";

        if (!isLoading && data) {
          if (metric.isAd) {
            displayValue = "—";
            deltaText = "";
          } else {
            const curr = metric.getValue(data.stats);
            const prev = metric.getPrev(data.previous.stats);
            displayValue = metric.formatValue(curr);
            const delta = formatDelta(curr, prev);
            deltaText = delta.text;
            deltaTone = delta.tone;
          }
        }

        return (
          <article
            className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl"
            key={metric.id}
          >
            <div className="flex items-start gap-3">
              <div className={`grid size-11 shrink-0 place-items-center rounded-2xl ring-1 ${toneClass[metric.tone]}`}>
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-400">{metric.label}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-white">
                  {isLoading ? (
                    <span className="inline-block h-7 w-20 animate-pulse rounded bg-zinc-700" />
                  ) : (
                    displayValue
                  )}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{metric.meta}</p>
              </div>
            </div>
            {deltaText && (
              <p className={`mt-4 text-xs font-semibold ${deltaToneClass[deltaTone]}`}>
                {deltaText}
              </p>
            )}
            {!deltaText && !isLoading && (
              <p className="mt-4 text-xs font-semibold text-zinc-600">—</p>
            )}
            {isLoading && (
              <p className="mt-4 h-4 w-32 animate-pulse rounded bg-zinc-700" />
            )}
          </article>
        );
      })}
    </section>
  );
}

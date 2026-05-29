import {
  CheckSquare,
  DollarSign,
  Gift,
  MousePointer2,
  Target,
  TrendingUp,
} from "lucide-react";
import { toneClass, type MetricTone } from "@/lib/overview-dashboard-data";
import { formatVND, formatNumber } from "@/lib/format-currency";
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
  getValue: (stats: DashboardResponse["stats"]) => number;
  formatValue: (v: number) => string;
};

const metrics: MetricConfig[] = [
  {
    id: "ad-cost",
    label: "Chi phí quảng cáo",
    meta: "Tổng chi tiêu",
    tone: "blue",
    icon: DollarSign,
    getValue: (s) => s.totalCost,
    formatValue: (v) => (v > 0 ? formatVND(v) : "—"),
  },
  {
    id: "clicks",
    label: "Lượt click",
    meta: "Tổng click",
    tone: "emerald",
    icon: MousePointer2,
    getValue: (s) => s.totalClicks,
    formatValue: (v) => (v > 0 ? formatNumber(v) : "—"),
  },
  {
    id: "quiz-completed",
    label: "Hoàn thành quiz",
    meta: "Số người hoàn thành",
    tone: "indigo",
    icon: CheckSquare,
    getValue: (s) => s.totalValid,
    formatValue: (v) => formatNumber(v),
  },
  {
    id: "tasks-completed",
    label: "Hoàn thành nhiệm vụ",
    meta: "Số lần hoàn thành",
    tone: "amber",
    icon: Gift,
    getValue: (s) => s.totalCompleted,
    formatValue: (v) => formatNumber(v),
  },
  {
    id: "cpa",
    label: "CPA",
    meta: "Chi phí / 1 nhiệm vụ",
    tone: "rose",
    icon: Target,
    getValue: (s) => s.cpa,
    formatValue: (v) => (v > 0 ? formatVND(v) : "—"),
  },
  {
    id: "conversion",
    label: "Tỷ lệ chuyển đổi",
    meta: "Completed / Clicks",
    tone: "teal",
    icon: TrendingUp,
    getValue: (s) => s.conversionRate,
    formatValue: (v) => `${v.toFixed(2)}%`,
  },
];

export function OverviewMetricCards({ data, loading, error }: Props) {
  if (error) {
    return (
      <section className="mb-5 rounded-[1.1rem] border border-rose-400/20 bg-surface p-4 text-sm text-rose-300">
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
        if (!isLoading && data) {
          const curr = metric.getValue(data.stats);
          displayValue = metric.formatValue(curr);
        }

        return (
          <article
            className="rounded-[1.1rem] border border-border bg-surface p-4 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl"
            key={metric.id}
          >
            <div className="flex items-start gap-3">
              <div className={`grid size-11 shrink-0 place-items-center rounded-2xl ring-1 ${toneClass[metric.tone]}`}>
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-muted-foreground">{metric.label}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                  {isLoading ? (
                    <span className="inline-block h-7 w-20 animate-pulse rounded bg-surface-2" />
                  ) : (
                    displayValue
                  )}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{metric.meta}</p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

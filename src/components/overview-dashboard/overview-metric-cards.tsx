import { overviewMetrics, type OverviewMetric } from "@/lib/overview-dashboard-data";

const toneClass: Record<OverviewMetric["tone"], string> = {
  amber: "bg-amber-400/14 text-amber-200 ring-amber-300/20",
  blue: "bg-sky-400/14 text-sky-200 ring-sky-300/20",
  emerald: "bg-emerald-400/14 text-emerald-200 ring-emerald-300/20",
  indigo: "bg-indigo-400/14 text-indigo-200 ring-indigo-300/20",
  rose: "bg-rose-400/14 text-rose-200 ring-rose-300/20",
  teal: "bg-teal-400/14 text-teal-200 ring-teal-300/20",
};

export function OverviewMetricCards() {
  return (
    <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {overviewMetrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <article className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl" key={metric.id}>
            <div className="flex items-start gap-3">
              <div className={`grid size-11 shrink-0 place-items-center rounded-2xl ring-1 ${toneClass[metric.tone]}`}>
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-400">{metric.label}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-white">{metric.value}</p>
                <p className="mt-1 text-xs text-zinc-500">{metric.meta}</p>
              </div>
            </div>
            <p className="mt-4 text-xs font-semibold text-emerald-300">{metric.delta}</p>
          </article>
        );
      })}
    </section>
  );
}

import { ArrowRight, OctagonAlert, TriangleAlert } from "lucide-react";
import { systemAlerts } from "@/lib/campaign-ops-data";

export function SystemAlerts() {
  return (
    <article className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-5 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">Cảnh báo hệ thống</h3>
          <p className="mt-1 text-sm text-zinc-400">Theo dõi thời gian thực</p>
        </div>
        <span className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white">2 mới</span>
      </div>
      <div className="space-y-3">
        {systemAlerts.map((alert) => {
          const danger = alert.severity === "danger";
          const Icon = danger ? OctagonAlert : TriangleAlert;

          return (
            <div
              className={`rounded-2xl border p-3.5 ${danger ? "border-rose-300/20 bg-rose-400/10" : "border-amber-300/20 bg-amber-400/10"}`}
              key={alert.id}
            >
              <div className="flex gap-3">
                <Icon className={`mt-0.5 size-5 shrink-0 ${danger ? "text-rose-200" : "text-amber-200"}`} />
                <div className="min-w-0">
                  <p className="font-semibold text-zinc-100">{alert.title}</p>
                  <p className="mt-1 text-sm text-zinc-400">{alert.description}</p>
                  <p className="mt-2 text-xs font-medium text-zinc-500">{alert.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-lime-200 transition hover:text-lime-100" type="button">
        Xem tất cả cảnh báo
        <ArrowRight className="size-4" />
      </button>
    </article>
  );
}

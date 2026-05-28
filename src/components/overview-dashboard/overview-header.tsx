import { CalendarDays, Filter } from "lucide-react";

export function OverviewHeader() {
  return (
    <header className="mb-5 flex flex-col gap-4 rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl sm:p-5 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
          <span className="font-medium text-lime-100">Tổng quan</span>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Dashboard tổng</h2>
        <p className="mt-2 text-sm text-zinc-400 sm:text-base">Theo dõi hiệu suất quảng cáo, quiz và nhiệm vụ trong toàn hệ thống.</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.11]" type="button">
          <CalendarDays className="size-4" />
          7 ngày gần nhất
        </button>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.11]" type="button">
          <Filter className="size-4" />
          Bộ lọc
        </button>
      </div>
    </header>
  );
}

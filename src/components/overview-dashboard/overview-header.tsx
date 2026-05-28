import type { RangeKey } from "@/lib/api/stats-api";

type Props = {
  range: RangeKey;
  onRangeChange: (range: RangeKey) => void;
};

const presets: { key: RangeKey; label: string }[] = [
  { key: "today", label: "Hôm nay" },
  { key: "7d", label: "7 ngày" },
  { key: "30d", label: "30 ngày" },
];

export function OverviewHeader({ range, onRangeChange }: Props) {
  return (
    <header className="mb-5 flex flex-col gap-4 rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl sm:p-5 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
          <span className="font-medium text-lime-100">Tổng quan</span>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Dashboard tổng</h2>
        <p className="mt-2 text-sm text-zinc-400 sm:text-base">Theo dõi hiệu suất quảng cáo, quiz và nhiệm vụ trong toàn hệ thống.</p>
      </div>

      <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-zinc-950/55 p-1">
        {presets.map((preset) => (
          <button
            key={preset.key}
            type="button"
            onClick={() => onRangeChange(preset.key)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              range === preset.key
                ? "bg-emerald-300/15 text-emerald-200"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </header>
  );
}

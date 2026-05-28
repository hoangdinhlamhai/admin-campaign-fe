import { useState } from "react";
import { ArrowRight, Bot } from "lucide-react";
import type { AutomationRule } from "@/lib/campaign-ops-data";

export function AutomationRules({ rules }: { rules: AutomationRule[] }) {
  const [states, setStates] = useState<Record<string, boolean>>(
    Object.fromEntries(rules.map((rule) => [rule.id, rule.enabled])),
  );

  return (
    <article className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-5 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl">
      <div className="mb-4 flex items-start gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-emerald-300/14 text-lime-100">
          <Bot className="size-5" />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-white">Quy tắc tự động</h3>
          <p className="mt-1 text-sm text-zinc-400">Tự xử lý các tình huống lặp lại</p>
        </div>
      </div>
      <div className="space-y-3">
        {rules.map((rule) => {
          const enabled = states[rule.id];

          return (
            <div className="rounded-2xl border border-white/10 bg-zinc-950/28 p-3.5" key={rule.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">{rule.trigger}</p>
                  <p className="mt-1 text-sm text-zinc-400">{rule.action}</p>
                </div>
                <button
                  aria-label={`${enabled ? "Tắt" : "Bật"} quy tắc ${rule.trigger}`}
                  aria-pressed={enabled}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${enabled ? "bg-emerald-300" : "bg-zinc-700"}`}
                  onClick={() => setStates((current) => ({ ...current, [rule.id]: !enabled }))}
                  type="button"
                >
                  <span
                    className={`absolute top-1 size-5 rounded-full bg-zinc-950 shadow transition ${enabled ? "left-6" : "left-1"}`}
                  />
                </button>
              </div>
              <p className={`mt-3 text-xs font-bold ${enabled ? "text-emerald-200" : "text-zinc-500"}`}>
                {enabled ? "Đang bật" : "Đang tắt"}
              </p>
            </div>
          );
        })}
      </div>
      <button className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-lime-200 transition hover:text-lime-100" type="button">
        Quản lý quy tắc
        <ArrowRight className="size-4" />
      </button>
    </article>
  );
}

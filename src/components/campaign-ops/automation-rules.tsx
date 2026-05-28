import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, Bot } from "lucide-react";
import type { AutomationRule } from "@/lib/campaign-ops-data";
import { apiFetch } from "@/lib/api/config";

type TriggerCount = {
  alert_type: string;
  count: number;
};

const RULE_TRIGGER_MAP: Record<string, string> = {
  "rule-wrong-pass-3": "wrong_pass_exceeded",
  "rule-no-valid-entry": "no_valid_entry_pause",
};

function useTriggerCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    apiFetch<TriggerCount[]>("/api/settings/triggers?days=7")
      .then((data) => {
        if (Array.isArray(data)) {
          const map: Record<string, number> = {};
          for (const item of data) {
            map[item.alert_type] = item.count;
          }
          setCounts(map);
        }
      })
      .catch(() => {
        // triggers endpoint unavailable — show dashes
      });
  }, []);

  return counts;
}

export function AutomationRules({ rules }: { rules: AutomationRule[] }) {
  const triggerCounts = useTriggerCounts();

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
          const alertType = RULE_TRIGGER_MAP[rule.id];
          const count = alertType ? triggerCounts[alertType] : undefined;

          return (
            <div className="rounded-2xl border border-white/10 bg-zinc-950/28 p-3.5" key={rule.id}>
              <div>
                <p className="font-semibold text-white">{rule.trigger}</p>
                <p className="mt-1 text-sm text-zinc-400">{rule.action}</p>
              </div>
              <p className="mt-3 text-xs font-bold text-zinc-400">
                {`Đã trigger ${count !== undefined ? count : "—"} lần / 7 ngày`}
              </p>
            </div>
          );
        })}
      </div>
      <Link
        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-lime-200 transition hover:text-lime-100"
        to="/settings"
      >
        Quản lý quy tắc
        <ArrowRight className="size-4" />
      </Link>
    </article>
  );
}

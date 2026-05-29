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
    <article className="glass-card p-5">
      <div className="mb-4 flex items-start gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-brand/15 text-brand">
          <Bot className="size-5" />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Quy tắc tự động</h3>
          <p className="mt-1 text-sm text-muted-foreground">Tự xử lý các tình huống lặp lại</p>
        </div>
      </div>
      <div className="space-y-3">
        {rules.map((rule) => {
          const alertType = RULE_TRIGGER_MAP[rule.id];
          const count = alertType ? triggerCounts[alertType] : undefined;

          return (
            <div className="rounded-2xl border border-border bg-surface p-3.5" key={rule.id}>
              <div>
                <p className="font-semibold text-foreground">{rule.trigger}</p>
                <p className="mt-1 text-sm text-muted-foreground">{rule.action}</p>
              </div>
              <p className="mt-3 text-xs font-bold text-muted-foreground">
                {`Đã trigger ${count !== undefined ? count : "—"} lần / 7 ngày`}
              </p>
            </div>
          );
        })}
      </div>
      <Link
        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand transition hover:text-brand/80"
        to="/settings"
      >
        Quản lý quy tắc
        <ArrowRight className="size-4" />
      </Link>
    </article>
  );
}

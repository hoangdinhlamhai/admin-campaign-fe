import { Link } from "react-router";
import { ArrowRight, Bot } from "lucide-react";
import type { AutomationRule } from "@/lib/campaign-ops-data";

export function AutomationRules({ rules }: { rules: AutomationRule[] }) {
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
        {rules.map((rule) => (
          <div className="rounded-2xl border border-border bg-surface p-3.5" key={rule.id}>
            <p className="font-semibold text-foreground">{rule.trigger}</p>
            <p className="mt-1 text-sm text-muted-foreground">{rule.action}</p>
          </div>
        ))}
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

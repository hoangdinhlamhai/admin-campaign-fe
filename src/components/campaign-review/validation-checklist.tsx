import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export type ValidationItem = {
  label: string;
  status: "pass" | "warning" | "error";
};

type ValidationChecklistProps = {
  items: ValidationItem[];
};

export function ValidationChecklist({ items }: ValidationChecklistProps) {
  const blockingCount = items.filter((item) => item.status === "error").length;

  return (
    <section className="glass-card p-4 sm:p-5">
      <h3 className="font-semibold text-foreground">Kiểm tra trước khi tạo</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {blockingCount ? `${blockingCount} lỗi cần xử lý trước khi tạo.` : "Không có lỗi chặn tạo chiến dịch."}
      </p>

      <div className="mt-4 space-y-2">
        {items.map((item) => {
          const Icon = item.status === "pass" ? CheckCircle2 : item.status === "warning" ? AlertTriangle : XCircle;
          const tone =
            item.status === "pass"
              ? "border-brand/20 bg-brand/10 text-brand"
              : item.status === "warning"
                ? "border-amber-300/20 bg-amber-400/10 text-amber-300"
                : "border-rose-300/20 bg-rose-400/10 text-rose-300";

          return (
            <div className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-sm ${tone}`} key={item.label}>
              <Icon className="mt-0.5 size-4 shrink-0" />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

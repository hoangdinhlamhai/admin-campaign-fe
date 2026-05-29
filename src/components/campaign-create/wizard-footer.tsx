import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router";

type WizardFooterProps = {
  backHref?: string;
  nextHref: string;
  nextLabel?: string;
  onNext?: () => void;
};

export function WizardFooter({ backHref, nextHref, nextLabel = "Tiếp", onNext }: WizardFooterProps) {
  return (
    <div className="mt-5 flex flex-col gap-3 rounded-[1.1rem] border border-border bg-surface p-4 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="text-sm text-muted-foreground">Tiếp tục sang bước kế tiếp khi đã kiểm tra nội dung hiện tại.</div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {backHref ? (
          <Link className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white/[0.07] px-4 text-sm font-semibold text-foreground transition hover:bg-white/[0.11]" to={backHref}>
            <ArrowLeft className="size-4" />
            Quay lại
          </Link>
        ) : null}
        <Link
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[hsl(var(--brand))] px-5 text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:bg-emerald-200"
          to={nextHref}
          onClick={onNext}
        >
          {nextLabel}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

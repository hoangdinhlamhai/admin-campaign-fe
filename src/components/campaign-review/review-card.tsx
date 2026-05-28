import type { ReactNode } from "react";

type ReviewCardProps = {
  action?: ReactNode;
  children: ReactNode;
  description?: string;
  title: string;
};

export function ReviewCard({ action, children, description, title }: ReviewCardProps) {
  return (
    <section className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl sm:p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {description ? <p className="mt-1 text-sm text-zinc-400">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

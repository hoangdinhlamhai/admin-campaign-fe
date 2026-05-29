import type { ReactNode } from "react";

type ReviewCardProps = {
  action?: ReactNode;
  children: ReactNode;
  description?: string;
  title: string;
};

export function ReviewCard({ action, children, description, title }: ReviewCardProps) {
  return (
    <section className="glass-card p-4 sm:p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

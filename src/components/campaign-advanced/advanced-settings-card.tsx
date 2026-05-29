import type { ReactNode } from "react";

type AdvancedSettingsCardProps = {
  children: ReactNode;
  description: string;
  title: string;
};

export function AdvancedSettingsCard({ children, description, title }: AdvancedSettingsCardProps) {
  return (
    <section className="glass-card p-4 sm:p-5">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

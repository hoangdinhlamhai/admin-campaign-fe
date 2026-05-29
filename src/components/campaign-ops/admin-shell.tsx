import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";

type AdminShellProps = {
  activeLabel: string;
  children: ReactNode;
};

export function AdminShell({ activeLabel, children }: AdminShellProps) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_14%_8%,hsla(141,74%,46%,0.18),transparent_30rem),radial-gradient(circle_at_86%_12%,hsla(72,88%,58%,0.12),transparent_28rem),radial-gradient(circle_at_50%_90%,hsla(180,60%,60%,0.08),transparent_30rem)] dark:bg-[radial-gradient(circle_at_14%_8%,hsla(141,74%,46%,0.16),transparent_30rem),radial-gradient(circle_at_86%_12%,hsla(72,88%,58%,0.1),transparent_28rem),linear-gradient(135deg,hsla(150,26%,10%,0.98),hsla(230,18%,7%,0.98))]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.025] dark:opacity-[0.045] [background-image:linear-gradient(hsl(var(--foreground)/0.5)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground)/0.5)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="relative flex min-h-dvh flex-col lg:flex-row">
        <Sidebar activeLabel={activeLabel} />
        <main className="min-w-0 flex-1 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">{children}</main>
      </div>
    </div>
  );
}

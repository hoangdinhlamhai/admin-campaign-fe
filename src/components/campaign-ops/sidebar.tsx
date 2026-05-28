import { useState } from "react";
import { ChevronDown, ChevronRight, Orbit } from "lucide-react";
import { Link, useLocation } from "react-router";
import { navItems } from "@/lib/campaign-ops-data";
import { useAlertOpenCount } from "@/components/alert-management/use-alert-open-count";

type SidebarProps = {
  activeLabel?: string;
};

export function Sidebar({ activeLabel = "Chiến dịch" }: SidebarProps) {
  const { pathname } = useLocation();
  const alertOpenCount = useAlertOpenCount();
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    navItems.forEach((item) => {
      if (item.children?.some((child) => pathname.startsWith(child.href))) {
        initial.add(item.label);
      }
    });
    return initial;
  });

  const toggleExpand = (label: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <aside className="relative z-10 flex border-white/10 bg-zinc-950/55 backdrop-blur-2xl lg:sticky lg:top-0 lg:h-dvh lg:w-72 lg:flex-col lg:border-r">
      <div className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto px-4 py-3 lg:flex-col lg:items-stretch lg:overflow-visible lg:p-5">
        <div className="flex shrink-0 items-center gap-3 rounded-[1.1rem] border border-white/10 bg-white/[0.045] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] lg:px-4 lg:py-4">
          <div className="grid size-10 place-items-center rounded-xl bg-[linear-gradient(135deg,hsl(var(--brand)),hsl(var(--accent)))] text-zinc-950 shadow-lg shadow-emerald-950/30">
            <Orbit size={19} strokeWidth={2.4} />
          </div>
          <div className="min-w-28">
            <p className="text-sm font-semibold tracking-[0.18em] text-lime-100">SC</p>
            <h1 className="text-lg font-semibold text-white">Senlyzer Campaign</h1>
          </div>
        </div>

        <nav className="flex items-center gap-1 lg:mt-5 lg:flex-col lg:items-stretch" aria-label="Điều hướng chính">
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expanded.has(item.label);
            const isChildActive = item.children?.some((child) => pathname.startsWith(child.href));
            const isActive = item.label === activeLabel || isChildActive;

            if (hasChildren) {
              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.label)}
                    className={`group flex h-11 w-full shrink-0 items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition duration-200 ${
                      isActive
                        ? "bg-emerald-300/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
                        : "text-zinc-300 hover:bg-white/[0.07] hover:text-white"
                    }`}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="whitespace-nowrap">{item.label}</span>
                    {isExpanded ? (
                      <ChevronDown className="ml-auto size-3.5 text-zinc-400" />
                    ) : (
                      <ChevronRight className="ml-auto size-3.5 text-zinc-400" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="mt-1 flex flex-col gap-0.5 pl-7">
                      {item.children!.map((child) => {
                        const isSubActive = pathname.startsWith(child.href);
                        return (
                          <Link
                            key={child.href}
                            to={child.href}
                            className={`flex h-9 items-center rounded-lg px-3 text-xs font-medium transition duration-200 ${
                              isSubActive
                                ? "bg-emerald-300/10 text-emerald-300"
                                : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200"
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                className={`group flex h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition duration-200 lg:w-full ${
                  isActive
                    ? "bg-emerald-300/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
                    : "text-zinc-300 hover:bg-white/[0.07] hover:text-white"
                }`}
                to={item.href}
              >
                <Icon className="size-4 shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
                {(() => {
                  const badge = item.label === "Cảnh báo" ? alertOpenCount : item.badge;
                  return badge ? (
                    <span className="ml-auto grid min-w-5 place-items-center rounded-full bg-rose-500 px-1.5 py-0.5 text-xs font-bold text-white shadow-lg shadow-rose-950/30">
                      {badge}
                    </span>
                  ) : null;
                })()}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto shrink-0 lg:mt-auto lg:ml-0">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-[1.1rem] border border-white/10 bg-white/[0.055] p-2.5 text-left transition hover:bg-white/[0.09]"
            aria-label="Mở menu tài khoản Admin"
          >
            <div className="grid size-10 place-items-center rounded-xl bg-zinc-100 text-sm font-bold text-zinc-900">AD</div>
            <div className="hidden min-w-0 flex-1 lg:block">
              <p className="truncate text-sm font-semibold text-white">Admin</p>
              <p className="truncate text-xs text-zinc-400">admin@senlyzer.io</p>
            </div>
            <ChevronDown className="hidden size-4 text-zinc-400 lg:block" />
          </button>
        </div>
      </div>
    </aside>
  );
}

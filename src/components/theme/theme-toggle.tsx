import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";

type Theme = "light" | "dark" | "system";

const options: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "Sáng" },
  { value: "dark", icon: Moon, label: "Tối" },
  { value: "system", icon: Monitor, label: "Hệ thống" },
];

type ThemeToggleProps = {
  collapsed?: boolean;
};

export function ThemeToggle({ collapsed = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  if (collapsed) {
    // Cycle through themes on click when sidebar is collapsed
    const cycle = () => {
      const order: Theme[] = ["light", "dark", "system"];
      const idx = order.indexOf(theme);
      setTheme(order[(idx + 1) % order.length]);
    };

    const current = options.find((o) => o.value === theme)!;
    const Icon = current.icon;

    return (
      <button
        type="button"
        onClick={cycle}
        title={`Giao diện: ${current.label}`}
        aria-label={`Chuyển giao diện (hiện tại: ${current.label})`}
        className="grid size-10 w-full cursor-pointer place-items-center rounded-xl text-zinc-400 transition hover:bg-white/[0.08] hover:text-white dark:text-zinc-400 dark:hover:bg-white/[0.08] dark:hover:text-white"
      >
        <Icon className="size-4" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] p-1 dark:border-white/10 dark:bg-white/[0.04]">
      {options.map(({ value, icon: Icon, label }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            title={label}
            aria-label={`Giao diện ${label}`}
            aria-pressed={isActive}
            className={`grid size-7 cursor-pointer place-items-center rounded-md transition duration-150 ${
              isActive
                ? "bg-emerald-400/20 text-emerald-300 shadow-sm"
                : "text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200"
            }`}
          >
            <Icon className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}

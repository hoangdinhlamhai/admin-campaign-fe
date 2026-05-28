import { useEffect, useRef, useState } from "react";

type InstructionRendererProps = {
  html: string;
  className?: string;
};

export function InstructionRenderer({ html, className = "" }: InstructionRendererProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const handler = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest("[data-copy]") as HTMLElement | null;
      if (!btn || !root.contains(btn)) return;
      e.preventDefault();
      e.stopPropagation();
      const value = btn.getAttribute("data-copy") ?? "";
      try {
        await navigator.clipboard.writeText(value);
        const display = value.length > 30 ? `${value.slice(0, 30)}…` : value;
        setToast(`Đã copy: ${display}`);
      } catch {
        setToast("Không thể copy");
      }
    };

    root.addEventListener("click", handler);
    return () => root.removeEventListener("click", handler);
  }, [html]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(id);
  }, [toast]);

  return (
    <div className="relative">
      <div
        ref={ref}
        className={`instruction-preview ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {toast && (
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-xl bg-zinc-900/95 px-3 py-2 text-xs font-semibold text-emerald-200 shadow-lg shadow-zinc-950/40">
          {toast}
        </div>
      )}
    </div>
  );
}

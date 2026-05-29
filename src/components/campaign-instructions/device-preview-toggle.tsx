import { useEffect, useRef, useState } from "react";
import { ChevronDown, Monitor, Smartphone } from "lucide-react";
import { PREVIEW_DEVICES } from "@/lib/preview-devices";

type DevicePreviewToggleProps = {
  selectedId: string;
  onSelect: (id: string) => void;
};

export function DevicePreviewToggle({ selectedId, onSelect }: DevicePreviewToggleProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = PREVIEW_DEVICES.find((d) => d.id === selectedId) ?? PREVIEW_DEVICES[0];

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const renderIcon = (icon: "monitor" | "smartphone") =>
    icon === "monitor" ? <Monitor className="size-4" /> : <Smartphone className="size-4" />;

  return (
    <div className="relative" ref={ref}>
      <button
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 text-sm font-semibold text-foreground transition hover:bg-surface"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        {renderIcon(selected.icon)}
        <span>{selected.label}</span>
        {selected.width && <span className="text-xs text-muted-foreground">{selected.width}px</span>}
        <ChevronDown className="size-3" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 w-52 overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
          {PREVIEW_DEVICES.map((device) => {
            const active = device.id === selectedId;
            return (
              <button
                key={device.id}
                className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition ${
                  active ? "bg-brand/15 text-brand" : "text-foreground hover:bg-surface-2"
                }`}
                onClick={() => {
                  onSelect(device.id);
                  setOpen(false);
                }}
                type="button"
              >
                <span className="inline-flex items-center gap-2">
                  {renderIcon(device.icon)}
                  {device.label}
                </span>
                {device.width && <span className="text-xs text-muted-foreground">{device.width}px</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

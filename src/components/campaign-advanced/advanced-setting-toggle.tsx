type AdvancedSettingToggleProps = {
  checked: boolean;
  description: string;
  label: string;
  onChange: (checked: boolean) => void;
};

export function AdvancedSettingToggle({ checked, description, label, onChange }: AdvancedSettingToggleProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-2 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-semibold text-foreground">{label}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        aria-pressed={checked}
        className="inline-flex h-9 w-16 shrink-0 items-center rounded-full border border-border bg-surface-2 p-1 transition data-[checked=true]:bg-brand"
        data-checked={checked}
        onClick={() => onChange(!checked)}
        type="button"
      >
        <span className="size-7 rounded-full bg-white shadow-lg transition-transform data-[checked=true]:translate-x-7" data-checked={checked} />
      </button>
    </div>
  );
}

type AdvancedNumberFieldProps = {
  disabled?: boolean;
  help: string;
  label: string;
  min?: number;
  onChange: (value: string) => void;
  suffix?: string;
  value: string;
};

export function AdvancedNumberField({
  disabled = false,
  help,
  label,
  min = 0,
  onChange,
  suffix,
  value,
}: AdvancedNumberFieldProps) {
  return (
    <label className={`block rounded-2xl border border-border bg-surface-2 p-4 transition ${disabled ? "opacity-45" : ""}`}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="mt-2 flex items-center gap-2">
        <input
          className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-background px-3 font-mono text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-brand/60 disabled:cursor-not-allowed"
          disabled={disabled}
          min={min}
          onChange={(event) => onChange(event.target.value)}
          type="number"
          value={value}
        />
        {suffix ? <span className="shrink-0 text-sm font-semibold text-muted-foreground">{suffix}</span> : null}
      </div>
      <span className="mt-1 block text-xs text-muted-foreground">{help}</span>
    </label>
  );
}

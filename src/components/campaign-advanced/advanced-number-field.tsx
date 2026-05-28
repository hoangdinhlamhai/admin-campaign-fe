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
    <label className={`block rounded-2xl border border-white/10 bg-zinc-950/24 p-4 transition ${disabled ? "opacity-45" : ""}`}>
      <span className="text-sm font-medium text-zinc-200">{label}</span>
      <div className="mt-2 flex items-center gap-2">
        <input
          className="h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-zinc-950/65 px-3 font-mono text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/60 disabled:cursor-not-allowed"
          disabled={disabled}
          min={min}
          onChange={(event) => onChange(event.target.value)}
          type="number"
          value={value}
        />
        {suffix ? <span className="shrink-0 text-sm font-semibold text-zinc-400">{suffix}</span> : null}
      </div>
      <span className="mt-1 block text-xs text-zinc-500">{help}</span>
    </label>
  );
}

import { Loader2, Save } from "lucide-react";

type Props = {
  dirty: boolean;
  saving: boolean;
  error: string | null;
  onSave: () => void;
};

export function SettingsHeader({ dirty, saving, error, onSave }: Props) {
  return (
    <header className="glass-card mb-5 flex flex-col gap-4 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-brand">Cài đặt</span>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Cài đặt chung
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Mặc định áp dụng cho mọi chiến dịch mới. Có thể ghi đè ở từng chiến dịch.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {error ? (
          <span className="text-sm text-rose-300">{error}</span>
        ) : null}
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-brand-foreground shadow-lg transition hover:-translate-y-0.5 hover:bg-brand/80 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          disabled={!dirty || saving}
          onClick={onSave}
          type="button"
        >
          {saving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </header>
  );
}

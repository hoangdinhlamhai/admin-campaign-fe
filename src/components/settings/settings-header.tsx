import { Loader2, Save } from "lucide-react";

type Props = {
  dirty: boolean;
  saving: boolean;
  error: string | null;
  onSave: () => void;
};

export function SettingsHeader({ dirty, saving, error, onSave }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">Cài đặt chung</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Mặc định áp dụng cho mọi chiến dịch mới. Có thể ghi đè ở từng chiến dịch.
        </p>
      </div>
      <div className="flex items-center gap-3">
        {error && (
          <span className="text-sm text-rose-400">{error}</span>
        )}
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
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
    </div>
  );
}

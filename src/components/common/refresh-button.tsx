import { RefreshCw } from "lucide-react";

type Props = {
  onRefresh: () => void;
  loading?: boolean;
};

export function RefreshButton({ onRefresh, loading = false }: Props) {
  return (
    <button
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-3 text-sm font-semibold text-foreground transition hover:bg-surface-2/80 disabled:opacity-60"
      disabled={loading}
      onClick={onRefresh}
      type="button"
    >
      <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
      Làm mới
    </button>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { listUserCampaigns } from "@/lib/api/users-api";

type Item = {
  id: string;
  code: string;
  name: string;
  status: string;
  priority: string;
  createdAt: string;
};

const STATUS_LABEL: Record<string, string> = {
  draft: "Bản nháp",
  active: "Đang chạy",
  paused: "Tạm dừng",
  stopped: "Đã dừng",
  archived: "Lưu trữ",
};

const STATUS_CLASS: Record<string, string> = {
  active: "bg-emerald-400/15 text-emerald-300 border-emerald-300/20",
  paused: "bg-amber-400/15 text-amber-300 border-amber-300/20",
  draft: "bg-zinc-500/15 text-zinc-300 border-zinc-400/20",
  stopped: "bg-rose-400/15 text-rose-300 border-rose-300/20",
  archived: "bg-zinc-700/30 text-zinc-400 border-zinc-500/20",
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

type Props = { userId: string };

export function UserCampaignsSection({ userId }: Props) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    listUserCampaigns(userId)
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Không tải được danh sách",
          );
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (error) {
    return <p className="text-sm text-rose-400">{error}</p>;
  }
  if (!items) {
    return <p className="text-sm text-muted-foreground">Đang tải...</p>;
  }
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nhân viên này chưa được phân công chiến dịch nào.
      </p>
    );
  }

  return (
    <div className="grid gap-2">
      {items.map((c) => {
        const statusLabel = STATUS_LABEL[c.status] ?? c.status;
        const statusClass = STATUS_CLASS[c.status] ?? STATUS_CLASS.draft;
        return (
          <div
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background p-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground">
                {c.code} — {c.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Tạo: {formatDate(c.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusClass}`}
              >
                {statusLabel}
              </span>
              <button
                type="button"
                onClick={() => navigate(`/campaigns/${c.id}`)}
                className="h-9 rounded-lg border border-border bg-surface-2 px-3 text-xs font-semibold text-foreground transition hover:bg-surface-2/80"
              >
                Xem
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

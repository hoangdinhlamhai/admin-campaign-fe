import { ArrowLeft, Pause, Pencil, Play, Trash2 } from "lucide-react";
import { Link } from "react-router";
import type { fetchFullCampaign } from "@/lib/api/campaigns-api";

type FullCampaign = Awaited<ReturnType<typeof fetchFullCampaign>>;

const STATUS_LABELS: Record<string, string> = {
  draft: "Bản nháp",
  active: "Hoạt động",
  paused: "Tạm dừng",
  stopped: "Đã dừng",
  archived: "Lưu trữ",
};

const STATUS_CLASS: Record<string, string> = {
  draft: "bg-zinc-500/15 text-zinc-400",
  active: "bg-emerald-500/15 text-emerald-400",
  paused: "bg-amber-500/15 text-amber-400",
  stopped: "bg-rose-500/15 text-rose-400",
  archived: "bg-zinc-500/15 text-zinc-500",
};

const PRIORITY_LABELS: Record<string, string> = { high: "Cao", medium: "Trung bình", low: "Thấp" };
const PRIORITY_CLASS: Record<string, string> = {
  high: "bg-rose-500/15 text-rose-400",
  medium: "bg-amber-500/15 text-amber-400",
  low: "bg-zinc-500/15 text-zinc-400",
};

type Props = {
  campaign: FullCampaign;
  onEdit: () => void;
  onPublish: () => void;
  onPause: () => void;
  onDelete: () => void;
};

export function CampaignDetailHeader({ campaign, onEdit, onPublish, onPause, onDelete }: Props) {
  const canPublish = campaign.status === "draft" || campaign.status === "paused";
  const canPause = campaign.status === "active";

  return (
    <header className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <Link className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-white" to="/campaigns">
            <ArrowLeft className="size-4" />
            Quay lại danh sách chiến dịch
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-zinc-800 px-2 py-1 font-mono text-xs font-semibold text-zinc-300">
              {campaign.code}
            </span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_CLASS[campaign.status] ?? "bg-zinc-500/15 text-zinc-400"}`}>
              {STATUS_LABELS[campaign.status] ?? campaign.status}
            </span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${PRIORITY_CLASS[campaign.priority] ?? "bg-zinc-500/15 text-zinc-400"}`}>
              Ưu tiên: {PRIORITY_LABELS[campaign.priority] ?? campaign.priority}
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {campaign.name}
          </h2>
          {campaign.keyword && (
            <p className="mt-1 text-sm text-zinc-400">Keyword: <span className="font-medium text-zinc-200">{campaign.keyword}</span></p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[hsl(var(--brand))] px-5 text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:bg-emerald-200"
            onClick={onEdit}
            type="button"
          >
            <Pencil className="size-4" />
            Chỉnh sửa
          </button>
          {canPublish && (
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/20"
              onClick={onPublish}
              type="button"
            >
              <Play className="size-4" />
              Xuất bản
            </button>
          )}
          {canPause && (
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 text-sm font-semibold text-amber-300 transition hover:bg-amber-400/20"
              onClick={onPause}
              type="button"
            >
              <Pause className="size-4" />
              Tạm dừng
            </button>
          )}
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 text-sm font-semibold text-rose-300 transition hover:bg-rose-400/20"
            onClick={onDelete}
            type="button"
          >
            <Trash2 className="size-4" />
            Xóa
          </button>
        </div>
      </div>
    </header>
  );
}

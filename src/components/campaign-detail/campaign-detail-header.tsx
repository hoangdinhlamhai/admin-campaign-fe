import { ArrowLeft, Pause, Pencil, Play, Trash2, UserCog } from "lucide-react";
import { Link } from "react-router";
import type { fetchFullCampaign } from "@/lib/api/campaigns-api";
import { Tooltip } from "@/components/common/tooltip";

type FullCampaign = Awaited<ReturnType<typeof fetchFullCampaign>>;

const STATUS_LABELS: Record<string, string> = {
  draft: "Bản nháp",
  active: "Hoạt động",
  paused: "Tạm dừng",
  stopped: "Đã dừng",
  archived: "Lưu trữ",
};

const STATUS_CLASS: Record<string, string> = {
  draft: "bg-surface-2 text-muted-foreground",
  active: "bg-brand/15 text-brand",
  paused: "bg-amber-500/15 text-amber-400",
  stopped: "bg-rose-500/15 text-rose-400",
  archived: "bg-surface-2 text-muted-foreground",
};

const PRIORITY_LABELS: Record<string, string> = { high: "Cao", medium: "Trung bình", low: "Thấp" };
const PRIORITY_CLASS: Record<string, string> = {
  high: "bg-rose-500/15 text-rose-400",
  medium: "bg-amber-500/15 text-amber-400",
  low: "bg-surface-2 text-muted-foreground",
};

type Props = {
  campaign: FullCampaign;
  onEdit: () => void;
  onPublish: () => void;
  onPause: () => void;
  onDelete: () => void;
  onReassignClick: () => void;
  isAdmin: boolean;
};

export function CampaignDetailHeader({ campaign, onEdit, onPublish, onPause, onDelete, onReassignClick, isAdmin }: Props) {
  const canPublish = campaign.status === "draft" || campaign.status === "paused";
  const canPause = campaign.status === "active";
  const isOwner = campaign.isOwner;

  // Permission-level gating disabled per user request 260528 — only ownership matters now.
  // To re-enable: import useAuth + hasPermission; canEdit = isOwner && hasPermission('campaigns.edit') etc.
  const canEdit = isOwner;
  const canDelete = isOwner;
  const canToggle = isOwner;

  const editTooltip = "Chỉ người phụ trách hoặc admin mới sửa được";
  const deleteTooltip = "Chỉ người phụ trách hoặc admin mới xóa được";
  const toggleTooltip = "Chỉ người phụ trách hoặc admin mới thao tác được";

  return (
    <header className="glass-card p-4 sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <Link className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground" to="/campaigns">
            <ArrowLeft className="size-4" />
            Quay lại danh sách chiến dịch
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-surface-2 px-2 py-1 font-mono text-xs font-semibold text-muted-foreground">
              {campaign.code}
            </span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_CLASS[campaign.status] ?? "bg-surface-2 text-muted-foreground"}`}>
              {STATUS_LABELS[campaign.status] ?? campaign.status}
            </span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${PRIORITY_CLASS[campaign.priority] ?? "bg-surface-2 text-muted-foreground"}`}>
              Ưu tiên: {PRIORITY_LABELS[campaign.priority] ?? campaign.priority}
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {campaign.name}
          </h2>
          {campaign.keyword && (
            <p className="mt-1 text-sm text-muted-foreground">Keyword: <span className="font-medium text-foreground">{campaign.keyword}</span></p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {isAdmin && (
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-indigo-400/30 bg-indigo-400/10 px-4 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-400/20"
              onClick={onReassignClick}
              type="button"
              aria-label="Đổi người phụ trách"
            >
              <UserCog className="size-4" />
              Đổi người phụ trách
            </button>
          )}
          {canEdit ? (
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground shadow-lg transition hover:-translate-y-0.5 hover:brightness-110"
              onClick={onEdit}
              type="button"
            >
              <Pencil className="size-4" />
              Chỉnh sửa
            </button>
          ) : (
            <Tooltip content={editTooltip}>
              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground opacity-50 shadow-lg cursor-not-allowed"
                disabled
                type="button"
              >
                <Pencil className="size-4" />
                Chỉnh sửa
              </button>
            </Tooltip>
          )}
          {canPublish && (
            canToggle ? (
              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-brand/30 bg-brand/10 px-4 text-sm font-semibold text-brand transition hover:bg-brand/20"
                onClick={onPublish}
                type="button"
              >
                <Play className="size-4" />
                Xuất bản
              </button>
            ) : (
              <Tooltip content={toggleTooltip}>
                <button
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-brand/30 bg-brand/10 px-4 text-sm font-semibold text-brand opacity-50 cursor-not-allowed"
                  disabled
                  type="button"
                >
                  <Play className="size-4" />
                  Xuất bản
                </button>
              </Tooltip>
            )
          )}
          {canPause && (
            canToggle ? (
              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 text-sm font-semibold text-amber-300 transition hover:bg-amber-400/20"
                onClick={onPause}
                type="button"
              >
                <Pause className="size-4" />
                Tạm dừng
              </button>
            ) : (
              <Tooltip content={toggleTooltip}>
                <button
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 text-sm font-semibold text-amber-300 opacity-50 cursor-not-allowed"
                  disabled
                  type="button"
                >
                  <Pause className="size-4" />
                  Tạm dừng
                </button>
              </Tooltip>
            )
          )}
          {canDelete ? (
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 text-sm font-semibold text-rose-300 transition hover:bg-rose-400/20"
              onClick={onDelete}
              type="button"
            >
              <Trash2 className="size-4" />
              Xóa
            </button>
          ) : (
            <Tooltip content={deleteTooltip}>
              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 text-sm font-semibold text-rose-300 opacity-50 cursor-not-allowed"
                disabled
                type="button"
              >
                <Trash2 className="size-4" />
                Xóa
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    </header>
  );
}

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Pause,
  Pencil,
  Play,
  Search,
  Trash2,
} from "lucide-react";
import type { Campaign, CampaignStatus } from "@/lib/campaign-ops-data";
import { filterCampaigns } from "@/lib/campaign-ops-utils";
import { useParentCategoriesApi } from "@/components/campaign-categories/use-parent-categories-api";
import { useChildCategoriesApi } from "@/components/campaign-categories/use-child-categories-api";
import { Tooltip } from "@/components/common/tooltip";
import { AssigneeCell } from "@/components/common/assignee-cell";
import { RefreshButton } from "@/components/common/refresh-button";
import { exportCampaignsCsv } from "./export-campaigns-csv";

type CampaignTableProps = {
  campaigns: Campaign[];
  dateFilter: string;
  onPublish: (id: string) => void;
  onPause: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onViewDetail: (id: string) => void;
  dateFrom: string;
  dateTo: string;
  onRefresh: () => void;
  refreshing?: boolean;
};

const STATUS_LABELS: Record<CampaignStatus, string> = {
  draft: "Bản nháp",
  active: "Hoạt động",
  paused: "Tạm dừng",
  stopped: "Đã dừng",
  archived: "Lưu trữ",
};

const STATUS_CLASS: Record<CampaignStatus, string> = {
  draft: "bg-surface-2 text-muted-foreground",
  active: "bg-brand/15 text-brand",
  paused: "bg-amber-500/15 text-amber-400",
  stopped: "bg-rose-500/15 text-rose-400",
  archived: "bg-surface-2 text-muted-foreground line-through",
};

const STATUS_FILTER_OPTIONS: { value: "all" | CampaignStatus; label: string }[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "draft", label: "Bản nháp" },
  { value: "active", label: "Hoạt động" },
  { value: "paused", label: "Tạm dừng" },
  { value: "stopped", label: "Đã dừng" },
  { value: "archived", label: "Lưu trữ" },
];

export function CampaignTable({
  campaigns,
  dateFilter,
  onPublish,
  onPause,
  onDelete,
  onEdit,
  onViewDetail,
  dateFrom,
  dateTo,
  onRefresh,
  refreshing,
}: CampaignTableProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CampaignStatus>("all");
  const [parentFilter, setParentFilter] = useState<string>("all");
  const [childFilter, setChildFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"campaigns" | "history">("campaigns");

  const { categories: parentCategories } = useParentCategoriesApi();
  const { categories: childCategories } = useChildCategoriesApi();

  const filteredChildOptions = useMemo(
    () => parentFilter === "all"
      ? childCategories
      : childCategories.filter((c) => c.parentId === parentFilter),
    [childCategories, parentFilter],
  );

  const filtered = useMemo(
    () => filterCampaigns(campaigns, query, statusFilter, parentFilter, childFilter),
    [campaigns, query, statusFilter, parentFilter, childFilter],
  );

  const isAllTime = dateFilter === "all";

  const handleExport = () => {
    exportCampaignsCsv(filtered, dateFrom, dateTo);
  };

  return (
    <section className="glass-card mb-5">
      <div className="flex flex-col gap-4 border-b border-border p-4 lg:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-xl border border-border bg-surface-2 p-1">
            <button
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${activeTab === "campaigns" ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setActiveTab("campaigns")}
              type="button"
            >
              Chiến dịch ({campaigns.length})
            </button>
            {/* <button
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${activeTab === "history" ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setActiveTab("history")}
              type="button"
            >
              Lịch sử hoạt động
            </button> */}
          </div>
          <RefreshButton onRefresh={onRefresh} loading={refreshing} />
        </div>

        {activeTab === "campaigns" && (
          <div className="grid gap-2 xl:grid-cols-[minmax(15rem,1fr)_auto_auto_auto_auto_auto_auto]">
            <label className="relative min-w-0">
              <span className="sr-only">Tìm kiếm chiến dịch</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-base text-foreground outline-none transition placeholder:text-muted-foreground focus:border-border-strong"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm theo tên, mã chiến dịch..."
                type="search"
                value={query}
              />
            </label>
            <select
              className="h-11 rounded-xl border border-border bg-background px-3 text-base text-foreground outline-none transition focus:border-border-strong"
              onChange={(e) => setStatusFilter(e.target.value as "all" | CampaignStatus)}
              value={statusFilter}
            >
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              aria-label="Lọc theo danh mục cha"
              className="h-11 rounded-xl border border-border bg-background px-3 text-base text-foreground outline-none transition focus:border-border-strong"
              onChange={(e) => {
                setParentFilter(e.target.value);
                setChildFilter("all");
              }}
              value={parentFilter}
            >
              <option value="all">Tất cả danh mục cha</option>
              {parentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select
              aria-label="Lọc theo danh mục con"
              className="h-11 rounded-xl border border-border bg-background px-3 text-base text-foreground outline-none transition focus:border-border-strong disabled:opacity-50"
              disabled={filteredChildOptions.length === 0}
              onChange={(e) => setChildFilter(e.target.value)}
              value={childFilter}
            >
              <option value="all">Tất cả danh mục con</option>
              {filteredChildOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {/* <input
              className="h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-border-strong disabled:opacity-50"
              disabled={isAllTime}
              onChange={(e) => onDateFilterChange(e.target.value)}
              type="date"
              value={isAllTime ? "" : dateFilter}
            /> */}
            {/* <button
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition ${isAllTime ? "bg-brand text-brand-foreground" : "border border-border bg-surface-2 text-foreground hover:bg-surface-2/80"}`}
              onClick={() => onDateFilterChange(isAllTime ? new Date().toISOString().slice(0, 10) : "all")}
              type="button"
            >
              {isAllTime ? "Theo ngày" : "Tổng tất cả"}
            </button> */}
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-3 text-sm font-semibold text-foreground transition hover:bg-surface-2/80"
              onClick={handleExport}
              type="button"
            >
              <Download className="size-4" />
              Xuất Excel
            </button>
          </div>
        )}
      </div>

      {activeTab === "history" ? (
        <div className="p-8 text-center text-muted-foreground">Lịch sử hoạt động sẽ hiển thị tại đây khi có dữ liệu.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] border-separate border-spacing-0 text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <HeaderCell className="w-12">#</HeaderCell>
                  <HeaderCell className="w-24">Mã</HeaderCell>
                  <HeaderCell>Tên chiến dịch</HeaderCell>
                  <HeaderCell className="w-40">Người phụ trách</HeaderCell>
                  <HeaderCell className="w-28">Mật khẩu</HeaderCell>
                  <HeaderCell className="w-28 text-center">Mục tiêu</HeaderCell>
                  <HeaderCell className="w-28 text-center">Lượt click</HeaderCell>
                  <HeaderCell className="w-28 text-center">Đã xong</HeaderCell>
                  <HeaderCell className="w-28 text-center">Còn thiếu</HeaderCell>
                  <HeaderCell className="w-32 text-center">Tiến độ</HeaderCell>
                  <HeaderCell className="w-24 text-center">Tỷ lệ</HeaderCell>
                  <HeaderCell className="w-24 text-center">Nhập sai</HeaderCell>
                  <HeaderCell className="w-28">Trạng thái</HeaderCell>
                  <HeaderCell className="w-28 text-right">Thao tác</HeaderCell>
                </tr>
              </thead>
              <tbody>
                {filtered.map((campaign, index) => (
                  <CampaignRow
                    campaign={campaign}
                    index={index}
                    key={campaign.id}
                    onDelete={() => onDelete(campaign.id)}
                    onEdit={() => onEdit(campaign.id)}
                    onPause={() => onPause(campaign.id)}
                    onPublish={() => onPublish(campaign.id)}
                    onViewDetail={() => onViewDetail(campaign.id)}
                  />
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td className="px-4 py-10 text-center text-muted-foreground" colSpan={14}>
                      Không tìm thấy chiến dịch phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 border-t border-border p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>Hiển thị 1 - {filtered.length} của {campaigns.length} chiến dịch {isAllTime ? "(tổng tất cả)" : `(ngày ${dateFilter})`}</span>
            <div className="flex items-center gap-2">
              <button aria-label="Trang trước" className="grid size-9 place-items-center rounded-lg border border-border bg-surface-2 text-muted-foreground transition hover:bg-surface-2/80" type="button">
                <ChevronLeft className="size-4" />
              </button>
              <span className="rounded-lg bg-brand px-3 py-1.5 font-bold text-brand-foreground">1</span>
              <button aria-label="Trang sau" className="grid size-9 place-items-center rounded-lg border border-border bg-surface-2 text-muted-foreground transition hover:bg-surface-2/80" type="button">
                <ChevronRight className="size-4" />
              </button>
              <select className="h-9 rounded-lg border border-border bg-background px-2 text-foreground">
                <option>10/trang</option>
              </select>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

type RowProps = {
  campaign: Campaign;
  index: number;
  onEdit: () => void;
  onPublish: () => void;
  onPause: () => void;
  onDelete: () => void;
  onViewDetail: () => void;
};

function CampaignRow({ campaign, index, onEdit, onPublish, onPause, onDelete, onViewDetail }: RowProps) {
  const canPublish = campaign.status === "draft" || campaign.status === "paused";
  const canPause = campaign.status === "active";

  const canEdit = campaign.isOwner;
  const canDelete = campaign.isOwner;
  const canToggle = campaign.isOwner;

  const editTooltip = "Chỉ người phụ trách hoặc admin mới sửa được";
  const deleteTooltip = "Chỉ người phụ trách hoặc admin mới xóa được";
  const toggleTooltip = "Chỉ người phụ trách hoặc admin mới thao tác được";

  const target = campaign.dailyUserTarget || 0;
  const unlocked = campaign.unlocked || 0;
  const missing = Math.max(0, target - unlocked);
  const progress = target > 0 ? Math.min(100, Math.round((unlocked / target) * 100)) : 0;

  const progressColor = progress >= 80 ? "bg-brand" : progress >= 50 ? "bg-amber-400" : "bg-rose-400";
  const progressTextColor = progress >= 80 ? "text-brand" : progress >= 50 ? "text-amber-400" : "text-rose-400";

  return (
    <tr
      className="group cursor-pointer text-foreground transition hover:bg-surface-2"
      onClick={onViewDetail}
    >
      <BodyCell>
        <span className="font-mono text-muted-foreground">{index + 1}</span>
      </BodyCell>
      <BodyCell>
        <span className="rounded-md bg-surface-2 px-2 py-1 font-mono text-xs font-semibold text-muted-foreground">
          {campaign.code}
        </span>
      </BodyCell>
      <BodyCell>
        <p className="font-semibold text-foreground">{campaign.name}</p>
        {campaign.keyword && (
          <p className="mt-0.5 text-xs text-muted-foreground">{campaign.keyword}</p>
        )}
      </BodyCell>
      <BodyCell>
        <AssigneeCell assignedTo={campaign.assignedTo} assignedToName={campaign.assignedToName} />
      </BodyCell>
      <BodyCell onClick={(e) => e.stopPropagation()}>
        <PassCodeCell value={campaign.passCode} />
      </BodyCell>
      <BodyCell className="text-center">
        <span className="font-mono font-semibold">{target}</span>
      </BodyCell>
      <BodyCell className="text-center">
        <span className="font-mono font-semibold text-foreground">{campaign.unlockClicked.toLocaleString('vi-VN')}</span>
      </BodyCell>
      <BodyCell className="text-center">
        <span className="font-mono font-semibold text-brand">{campaign.unlocked.toLocaleString('vi-VN')}</span>
      </BodyCell>
      <BodyCell className="text-center">
        <span className={`font-mono font-semibold ${missing > 0 ? "text-rose-300" : "text-muted-foreground"}`}>
          {missing}
        </span>
      </BodyCell>
      <BodyCell className="text-center">
        <div className="flex flex-col items-center gap-1">
          <span className={`font-mono text-xs font-bold ${progressTextColor}`}>{progress}%</span>
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-surface-2">
            <div className={`h-full ${progressColor} transition-all`} style={{ width: `${progress}%` }} />
          </div>
        </div>
      </BodyCell>
      <BodyCell className="text-center">
        <span className="font-mono text-xs font-bold text-foreground">{`${(campaign.conversionRate * 100).toFixed(1)}%`}</span>
      </BodyCell>
      <BodyCell className="text-center">
        <span className="font-mono text-muted-foreground">{campaign.passInvalid.toLocaleString('vi-VN')}</span>
      </BodyCell>
      <BodyCell>
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_CLASS[campaign.status]}`}>
          {STATUS_LABELS[campaign.status]}
        </span>
      </BodyCell>
      <BodyCell onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end gap-1">
          {canEdit ? (
            <button
              aria-label={`Chỉnh sửa ${campaign.name}`}
              className="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"
              onClick={onEdit}
              type="button"
            >
              <Pencil className="size-4" />
            </button>
          ) : (
            <Tooltip content={editTooltip}>
              <button
                aria-label={`Chỉnh sửa ${campaign.name} (không có quyền)`}
                className="grid size-8 place-items-center rounded-lg text-muted-foreground cursor-not-allowed opacity-40"
                disabled
                type="button"
              >
                <Pencil className="size-4" />
              </button>
            </Tooltip>
          )}
          {canPublish && (
            canToggle ? (
              <button
                aria-label={`Xuất bản ${campaign.name}`}
                className="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-brand/15 hover:text-brand"
                onClick={onPublish}
                type="button"
              >
                <Play className="size-4" />
              </button>
            ) : (
              <Tooltip content={toggleTooltip}>
                <button
                  aria-label={`Xuất bản ${campaign.name} (không có quyền)`}
                  className="grid size-8 place-items-center rounded-lg text-muted-foreground cursor-not-allowed opacity-40"
                  disabled
                  type="button"
                >
                  <Play className="size-4" />
                </button>
              </Tooltip>
            )
          )}
          {canPause && (
            canToggle ? (
              <button
                aria-label={`Tạm dừng ${campaign.name}`}
                className="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-amber-400/15 hover:text-amber-400"
                onClick={onPause}
                type="button"
              >
                <Pause className="size-4" />
              </button>
            ) : (
              <Tooltip content={toggleTooltip}>
                <button
                  aria-label={`Tạm dừng ${campaign.name} (không có quyền)`}
                  className="grid size-8 place-items-center rounded-lg text-muted-foreground cursor-not-allowed opacity-40"
                  disabled
                  type="button"
                >
                  <Pause className="size-4" />
                </button>
              </Tooltip>
            )
          )}
          {canDelete ? (
            <button
              aria-label={`Xóa ${campaign.name}`}
              className="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-rose-400/15 hover:text-rose-400"
              onClick={onDelete}
              type="button"
            >
              <Trash2 className="size-4" />
            </button>
          ) : (
            <Tooltip content={deleteTooltip}>
              <button
                aria-label={`Xóa ${campaign.name} (không có quyền)`}
                className="grid size-8 place-items-center rounded-lg text-muted-foreground cursor-not-allowed opacity-40"
                disabled
                type="button"
              >
                <Trash2 className="size-4" />
              </button>
            </Tooltip>
          )}
        </div>
      </BodyCell>
    </tr>
  );
}

function PassCodeCell({ value }: { value: string | null }) {
  const [copied, setCopied] = useState(false);

  if (!value) {
    return <span className="text-muted-foreground">—</span>;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="rounded-md bg-surface-2 px-2 py-1 font-mono text-xs font-semibold text-foreground">
        {value}
      </span>
      <button
        aria-label="Sao chép pass"
        className="grid size-7 place-items-center rounded-lg text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"
        onClick={handleCopy}
        type="button"
      >
        {copied ? <Check className="size-3.5 text-brand" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}

function HeaderCell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <th className={`border-b border-border px-4 py-3 font-semibold ${className}`}>{children}</th>;
}

function BodyCell({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: (e: React.MouseEvent) => void }) {
  return <td className={`border-b border-border px-4 py-4 align-middle ${className}`} onClick={onClick}>{children}</td>;
}

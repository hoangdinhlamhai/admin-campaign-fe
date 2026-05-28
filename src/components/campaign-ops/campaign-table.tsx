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
import { filterCampaigns, formatPercent } from "@/lib/campaign-ops-utils";
import { useParentCategoriesApi } from "@/components/campaign-categories/use-parent-categories-api";
import { useChildCategoriesApi } from "@/components/campaign-categories/use-child-categories-api";
import { Tooltip } from "@/components/common/tooltip";
import { AssigneeCell } from "@/components/common/assignee-cell";
import { exportCampaignsCsv } from "./export-campaigns-csv";

type CampaignTableProps = {
  campaigns: Campaign[];
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  onPublish: (id: string) => void;
  onPause: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onViewDetail: (id: string) => void;
  dateFrom: string;
  dateTo: string;
};

const STATUS_LABELS: Record<CampaignStatus, string> = {
  draft: "Bản nháp",
  active: "Hoạt động",
  paused: "Tạm dừng",
  stopped: "Đã dừng",
  archived: "Lưu trữ",
};

const STATUS_CLASS: Record<CampaignStatus, string> = {
  draft: "bg-zinc-500/15 text-zinc-400",
  active: "bg-emerald-500/15 text-emerald-400",
  paused: "bg-amber-500/15 text-amber-400",
  stopped: "bg-rose-500/15 text-rose-400",
  archived: "bg-zinc-500/15 text-zinc-500 line-through",
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
  onDateFilterChange,
  onPublish,
  onPause,
  onDelete,
  onEdit,
  onViewDetail,
  dateFrom,
  dateTo,
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
    <section className="mb-5 rounded-[1.1rem] border border-white/10 bg-zinc-900/58 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl">
      <div className="flex flex-col gap-4 border-b border-white/10 p-4 lg:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-xl border border-white/10 bg-zinc-950/40 p-1">
            <button
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${activeTab === "campaigns" ? "bg-emerald-300 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
              onClick={() => setActiveTab("campaigns")}
              type="button"
            >
              Chiến dịch ({campaigns.length})
            </button>
            <button
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${activeTab === "history" ? "bg-emerald-300 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
              onClick={() => setActiveTab("history")}
              type="button"
            >
              Lịch sử hoạt động
            </button>
          </div>
        </div>

        {activeTab === "campaigns" && (
          <div className="grid gap-2 xl:grid-cols-[minmax(15rem,1fr)_auto_auto_auto_auto_auto_auto]">
            <label className="relative min-w-0">
              <span className="sr-only">Tìm kiếm chiến dịch</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <input
                className="h-11 w-full rounded-xl border border-white/10 bg-zinc-950/35 pl-10 pr-3 text-base text-white outline-none transition placeholder:text-zinc-500 focus:border-emerald-300/45"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm theo tên, mã chiến dịch..."
                type="search"
                value={query}
              />
            </label>
            <select
              className="h-11 rounded-xl border border-white/10 bg-zinc-950/85 px-3 text-base text-white outline-none transition focus:border-emerald-300/45"
              onChange={(e) => setStatusFilter(e.target.value as "all" | CampaignStatus)}
              value={statusFilter}
            >
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              aria-label="Lọc theo danh mục cha"
              className="h-11 rounded-xl border border-white/10 bg-zinc-950/85 px-3 text-base text-white outline-none transition focus:border-emerald-300/45"
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
              className="h-11 rounded-xl border border-white/10 bg-zinc-950/85 px-3 text-base text-white outline-none transition focus:border-emerald-300/45 disabled:opacity-50"
              disabled={filteredChildOptions.length === 0}
              onChange={(e) => setChildFilter(e.target.value)}
              value={childFilter}
            >
              <option value="all">Tất cả danh mục con</option>
              {filteredChildOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input
              className="h-11 rounded-xl border border-white/10 bg-zinc-950/85 px-3 text-sm text-white outline-none transition focus:border-emerald-300/45 disabled:opacity-50"
              disabled={isAllTime}
              onChange={(e) => onDateFilterChange(e.target.value)}
              type="date"
              value={isAllTime ? "" : dateFilter}
            />
            <button
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition ${isAllTime ? "bg-emerald-300 text-zinc-950" : "border border-white/10 bg-white/[0.07] text-zinc-100 hover:bg-white/[0.11]"}`}
              onClick={() => onDateFilterChange(isAllTime ? new Date().toISOString().slice(0, 10) : "all")}
              type="button"
            >
              {isAllTime ? "Theo ngày" : "Tổng tất cả"}
            </button>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.11]"
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
        <div className="p-8 text-center text-zinc-400">Lịch sử hoạt động sẽ hiển thị tại đây khi có dữ liệu.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] border-separate border-spacing-0 text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.08em] text-zinc-500">
                <tr>
                  <HeaderCell className="w-12">#</HeaderCell>
                  <HeaderCell className="w-24">Mã</HeaderCell>
                  <HeaderCell>Tên chiến dịch</HeaderCell>
                  <HeaderCell className="w-40">Người phụ trách</HeaderCell>
                  <HeaderCell className="w-28">Mật khẩu</HeaderCell>
                  <HeaderCell className="w-28 text-center">Mục tiêu</HeaderCell>
                  <HeaderCell className="w-28 text-center">Đã xong</HeaderCell>
                  <HeaderCell className="w-28 text-center">Còn thiếu</HeaderCell>
                  <HeaderCell className="w-32 text-center">Tiến độ</HeaderCell>
                  <HeaderCell className="w-24 text-center">Nhập sai</HeaderCell>
                  <HeaderCell className="w-24 text-center">Tỷ lệ sai</HeaderCell>
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
                    <td className="px-4 py-10 text-center text-zinc-400" colSpan={13}>
                      Không tìm thấy chiến dịch phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 border-t border-white/10 p-4 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
            <span>Hiển thị 1 - {filtered.length} của {campaigns.length} chiến dịch {isAllTime ? "(tổng tất cả)" : `(ngày ${dateFilter})`}</span>
            <div className="flex items-center gap-2">
              <button aria-label="Trang trước" className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-300 transition hover:bg-white/[0.1]" type="button">
                <ChevronLeft className="size-4" />
              </button>
              <span className="rounded-lg bg-emerald-300 px-3 py-1.5 font-bold text-zinc-950">1</span>
              <button aria-label="Trang sau" className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-300 transition hover:bg-white/[0.1]" type="button">
                <ChevronRight className="size-4" />
              </button>
              <select className="h-9 rounded-lg border border-white/10 bg-zinc-950/85 px-2 text-white">
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
  const completed = campaign.completedCount || 0;
  const progress = target > 0 ? Math.min(100, Math.round((completed / target) * 100)) : 0;
  const totalEntries = campaign.wrongEntryCount + campaign.validEntryCount;
  const wrongRate = totalEntries > 0 ? (campaign.wrongEntryCount / totalEntries) * 100 : 0;

  const progressColor = progress >= 80 ? "bg-emerald-400" : progress >= 50 ? "bg-amber-400" : "bg-rose-400";
  const progressTextColor = progress >= 80 ? "text-emerald-400" : progress >= 50 ? "text-amber-400" : "text-rose-400";
  const wrongRateColor = wrongRate >= 30 ? "text-rose-400" : wrongRate >= 15 ? "text-amber-400" : "text-zinc-300";

  return (
    <tr
      className="group cursor-pointer text-zinc-200 transition hover:bg-white/[0.055]"
      onClick={onViewDetail}
    >
      <BodyCell>
        <span className="font-mono text-zinc-400">{index + 1}</span>
      </BodyCell>
      <BodyCell>
        <span className="rounded-md bg-zinc-800 px-2 py-1 font-mono text-xs font-semibold text-zinc-300">
          {campaign.code}
        </span>
      </BodyCell>
      <BodyCell>
        <p className="font-semibold text-white">{campaign.name}</p>
        {campaign.keyword && (
          <p className="mt-0.5 text-xs text-zinc-500">{campaign.keyword}</p>
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
        <span className="font-mono font-semibold text-emerald-300">{completed}</span>
      </BodyCell>
      <BodyCell className="text-center">
        <span className={`font-mono font-semibold ${campaign.missingCount > 0 ? "text-rose-300" : "text-zinc-400"}`}>
          {campaign.missingCount}
        </span>
      </BodyCell>
      <BodyCell className="text-center">
        <div className="flex flex-col items-center gap-1">
          <span className={`font-mono text-xs font-bold ${progressTextColor}`}>{progress}%</span>
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-zinc-800">
            <div className={`h-full ${progressColor} transition-all`} style={{ width: `${progress}%` }} />
          </div>
        </div>
      </BodyCell>
      <BodyCell className="text-center">
        <span className="font-mono text-zinc-300">{campaign.wrongEntryCount}</span>
      </BodyCell>
      <BodyCell className="text-center">
        <span className={`font-mono text-xs font-bold ${wrongRateColor}`}>
          {totalEntries > 0 ? formatPercent(wrongRate / 100) : "-"}
        </span>
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
              className="grid size-8 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
              onClick={onEdit}
              type="button"
            >
              <Pencil className="size-4" />
            </button>
          ) : (
            <Tooltip content={editTooltip}>
              <button
                aria-label={`Chỉnh sửa ${campaign.name} (không có quyền)`}
                className="grid size-8 place-items-center rounded-lg text-zinc-400 cursor-not-allowed opacity-40"
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
                className="grid size-8 place-items-center rounded-lg text-zinc-400 transition hover:bg-emerald-400/15 hover:text-emerald-400"
                onClick={onPublish}
                type="button"
              >
                <Play className="size-4" />
              </button>
            ) : (
              <Tooltip content={toggleTooltip}>
                <button
                  aria-label={`Xuất bản ${campaign.name} (không có quyền)`}
                  className="grid size-8 place-items-center rounded-lg text-zinc-400 cursor-not-allowed opacity-40"
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
                className="grid size-8 place-items-center rounded-lg text-zinc-400 transition hover:bg-amber-400/15 hover:text-amber-400"
                onClick={onPause}
                type="button"
              >
                <Pause className="size-4" />
              </button>
            ) : (
              <Tooltip content={toggleTooltip}>
                <button
                  aria-label={`Tạm dừng ${campaign.name} (không có quyền)`}
                  className="grid size-8 place-items-center rounded-lg text-zinc-400 cursor-not-allowed opacity-40"
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
              className="grid size-8 place-items-center rounded-lg text-zinc-400 transition hover:bg-rose-400/15 hover:text-rose-400"
              onClick={onDelete}
              type="button"
            >
              <Trash2 className="size-4" />
            </button>
          ) : (
            <Tooltip content={deleteTooltip}>
              <button
                aria-label={`Xóa ${campaign.name} (không có quyền)`}
                className="grid size-8 place-items-center rounded-lg text-zinc-400 cursor-not-allowed opacity-40"
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
    return <span className="text-zinc-600">—</span>;
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
      <span className="rounded-md bg-zinc-800 px-2 py-1 font-mono text-xs font-semibold text-zinc-200">
        {value}
      </span>
      <button
        aria-label="Sao chép pass"
        className="grid size-7 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
        onClick={handleCopy}
        type="button"
      >
        {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}

function HeaderCell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <th className={`border-b border-white/10 px-4 py-3 font-semibold ${className}`}>{children}</th>;
}

function BodyCell({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: (e: React.MouseEvent) => void }) {
  return <td className={`border-b border-white/5 px-4 py-4 align-middle ${className}`} onClick={onClick}>{children}</td>;
}

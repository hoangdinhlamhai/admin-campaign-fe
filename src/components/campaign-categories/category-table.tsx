import { useState, type ReactNode } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  Search,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import type { CampaignCategory } from "@/lib/campaign-categories-data";
import { formatNumber } from "@/lib/format-currency";
import { useAuth } from "@/lib/auth/auth-context";

type CategoryTableProps = {
  categories: CampaignCategory[];
  getChildrenOf: (parentId: string) => CampaignCategory[];
  getParentName: (parentId: string) => string;
  mode: "parent" | "child";
  onDelete: (id: string) => void;
  onEdit: (category: CampaignCategory) => void;
  onQueryChange: (query: string) => void;
  onRowClick?: (category: CampaignCategory) => void;
  parentCategories: CampaignCategory[];
  query: string;
  total: number;
};

export function CategoryTable({
  categories,
  getChildrenOf,
  getParentName,
  mode,
  onDelete,
  onEdit,
  onQueryChange,
  onRowClick,
  parentCategories,
  query,
  total,
}: CategoryTableProps) {
  const [parentFilter, setParentFilter] = useState("");

  const visibleCategories =
    mode === "child" && parentFilter
      ? categories.filter((c) => c.parentId === parentFilter)
      : categories;

  return (
    <section className="glass-card">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {mode === "parent" ? "Danh sách danh mục cha" : "Danh sách danh mục con"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Theo dõi tiến độ chạy user theo từng danh mục website.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {mode === "child" && (
            <select
              className="h-11 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-border-strong"
              onChange={(e) => setParentFilter(e.target.value)}
              value={parentFilter}
            >
              <option value="">Tất cả danh mục cha</option>
              {parentCategories.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <span className="sr-only">Tìm danh mục</span>
            <input
              className="h-11 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-border-strong sm:w-72"
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Tìm danh mục hoặc website..."
              value={query}
            />
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
              <HeaderCell className="w-12">#</HeaderCell>
              <HeaderCell className="w-72">Danh mục</HeaderCell>
              {mode === "child" && <HeaderCell className="w-44">Danh mục cha</HeaderCell>}
              {mode === "parent" && <HeaderCell className="w-28 text-center">Số DM con</HeaderCell>}
              <HeaderCell className="w-32 text-center">Số chiến dịch</HeaderCell>
              <HeaderCell className="w-40 text-center">User cần chạy / ngày</HeaderCell>
              <HeaderCell className="w-44 text-center">Đã hoàn thành</HeaderCell>
              <HeaderCell className="w-32 text-center">Còn thiếu</HeaderCell>
              <HeaderCell className="w-44">Tiến độ</HeaderCell>
              <HeaderCell className="w-32">Trạng thái</HeaderCell>
              <HeaderCell className="w-32 text-right">Thao tác</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {visibleCategories.map((category, index) => (
              <CategoryRow
                category={category}
                childCount={mode === "parent" ? (category.childCount ?? getChildrenOf(category.id).length) : undefined}
                index={index}
                key={category.id}
                mode={mode}
                onDelete={() => onDelete(category.id)}
                onEdit={() => onEdit(category)}
                onRowClick={onRowClick ? () => onRowClick(category) : undefined}
                parentName={mode === "child" && category.parentId ? getParentName(category.parentId) : undefined}
              />
            ))}
            {visibleCategories.length === 0 && (
              <tr>
                <td className="px-4 py-10 text-center text-muted-foreground" colSpan={mode === "parent" ? 11 : 10}>
                  Không tìm thấy danh mục phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-border p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <span>
          Hiển thị 1 - {visibleCategories.length} của {total} danh mục
        </span>
        <div className="flex items-center gap-2">
          <button
            aria-label="Trang trước"
            className="grid size-9 place-items-center rounded-lg border border-border bg-surface-2 text-muted-foreground transition hover:bg-surface-2/80"
            type="button"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="rounded-lg bg-brand px-3 py-1.5 font-bold text-brand-foreground">1</span>
          <button
            aria-label="Trang sau"
            className="grid size-9 place-items-center rounded-lg border border-border bg-surface-2 text-muted-foreground transition hover:bg-surface-2/80"
            type="button"
          >
            <ChevronRight className="size-4" />
          </button>
          <select className="h-9 rounded-lg border border-border bg-background px-2 text-foreground">
            <option>10/trang</option>
          </select>
        </div>
      </div>
    </section>
  );
}

function CategoryRow({
  category,
  childCount,
  index,
  mode,
  onDelete,
  onEdit,
  onRowClick,
  parentName,
}: {
  category: CampaignCategory;
  childCount?: number;
  index: number;
  mode: "parent" | "child";
  onDelete: () => void;
  onEdit: () => void;
  onRowClick?: () => void;
  parentName?: string;
}) {
  const target = category.rangeTarget ?? 0;
  const completed = category.rangeCompleted ?? 0;
  const missing = category.rangeMissing ?? 0;
  const progress = getProgress(completed, target);
  const { isAdmin } = useAuth();

  return (
    <tr
      className={`border-b border-border/60 text-foreground transition hover:bg-surface-2 ${onRowClick ? "cursor-pointer" : ""}`}
      onClick={onRowClick}
    >
      <BodyCell>
        <span className="font-mono text-muted-foreground">{index + 1}</span>
      </BodyCell>
      <BodyCell>
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-400/16 text-xs font-bold text-indigo-100 ring-1 ring-indigo-300/20">
            {category.initials}
          </div>
          <div className="min-w-0">
            <span className="font-semibold text-foreground">
              {category.name}
            </span>
            <p className="mt-1 truncate text-xs text-muted-foreground">{category.website}</p>
          </div>
        </div>
      </BodyCell>
      {mode === "child" && (
        <BodyCell>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-400/12 px-2.5 py-1 text-xs font-bold text-indigo-200">
            {parentName || "—"}
          </span>
        </BodyCell>
      )}
      {mode === "parent" && (
        <BodyCell className="text-center">
          <span className="font-mono font-semibold text-muted-foreground">{formatNumber(childCount ?? 0)}</span>
        </BodyCell>
      )}
      <BodyCell className="text-center">
        <span className="font-mono font-semibold">{formatNumber(category.campaignCount ?? 0)}</span>
      </BodyCell>
      <BodyCell className="text-center">
        <span className="font-mono font-semibold">{formatNumber(target)}</span>
      </BodyCell>
      <BodyCell className="text-center">
        <span
          className={`font-mono font-semibold ${
            progress >= 100 ? "text-brand" : progress >= 70 ? "text-brand" : "text-amber-200"
          }`}
        >
          {formatNumber(completed)}
        </span>
      </BodyCell>
      <BodyCell className="text-center">
        <span
          className={`font-mono font-semibold ${
            missing > 0 ? "text-rose-200" : "text-foreground"
          }`}
        >
          {formatNumber(missing)}
        </span>
      </BodyCell>
      <BodyCell>
        <ProgressBar value={progress} />
      </BodyCell>
      <BodyCell>
        <StatusBadge status={category.status} />
      </BodyCell>
      <BodyCell>
        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          {onRowClick && (
            <button
              aria-label={`Chi tiết ${category.name}`}
              className="grid size-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"
              onClick={onRowClick}
              type="button"
              title="Chi tiết"
            >
              <Eye className="size-4" />
            </button>
          )}
          {isAdmin && (
            <>
              <button
                aria-label={`Sửa ${category.name}`}
                className="grid size-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"
                onClick={onEdit}
                type="button"
              >
                <Edit3 className="size-4" />
              </button>
              <button
                aria-label={`Xoá ${category.name}`}
                className="grid size-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-rose-400/12 hover:text-rose-100"
                onClick={onDelete}
                type="button"
              >
                <Trash2 className="size-4" />
              </button>
            </>
          )}
        </div>
      </BodyCell>
    </tr>
  );
}

function getProgress(completed: number, target: number) {
  if (target === 0) return 0;
  return Math.round((completed / target) * 100);
}

function ProgressBar({ value }: { value: number }) {
  const tone =
    value < 50 ? "bg-amber-300" : value < 70 ? "bg-orange-300" : "bg-brand";

  return (
    <div className="flex items-center gap-2">
      <div className="h-2.5 w-28 overflow-hidden rounded-full bg-surface-2">
        <div
          className={`h-full rounded-full ${tone} transition-all duration-500`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="w-11 font-mono text-xs font-semibold text-muted-foreground">{value}%</span>
    </div>
  );
}

function StatusBadge({ status }: { status: CampaignCategory["status"] }) {
  const active = status === "active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
        active ? "bg-brand/15 text-brand" : "bg-amber-400/12 text-amber-200"
      }`}
    >
      {active ? <Check className="size-3.5" /> : <TriangleAlert className="size-3.5" />}
      {active ? "Hoạt động" : "Tạm dừng"}
    </span>
  );
}

function HeaderCell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <th className={`px-4 py-3 font-semibold ${className}`}>{children}</th>;
}

function BodyCell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-4 align-middle ${className}`}>{children}</td>;
}

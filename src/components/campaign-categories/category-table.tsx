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
    <section className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl">
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {mode === "parent" ? "Danh sách danh mục cha" : "Danh sách danh mục con"}
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            Theo dõi tiến độ chạy user theo từng danh mục website.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {mode === "child" && (
            <select
              className="h-11 rounded-xl border border-white/10 bg-zinc-950/55 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/60"
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
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <span className="sr-only">Tìm danh mục</span>
            <input
              className="h-11 w-full rounded-xl border border-white/10 bg-zinc-950/55 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/60 sm:w-72"
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
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.12em] text-zinc-500">
              <HeaderCell className="w-12">#</HeaderCell>
              <HeaderCell className="w-72">Danh mục (Website)</HeaderCell>
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
                <td className="px-4 py-10 text-center text-zinc-400" colSpan={mode === "parent" ? 11 : 10}>
                  Không tìm thấy danh mục phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 p-4 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <span>
          Hiển thị 1 - {visibleCategories.length} của {total} danh mục
        </span>
        <div className="flex items-center gap-2">
          <button
            aria-label="Trang trước"
            className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-300 transition hover:bg-white/[0.1]"
            type="button"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="rounded-lg bg-emerald-300 px-3 py-1.5 font-bold text-zinc-950">1</span>
          <button
            aria-label="Trang sau"
            className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-300 transition hover:bg-white/[0.1]"
            type="button"
          >
            <ChevronRight className="size-4" />
          </button>
          <select className="h-9 rounded-lg border border-white/10 bg-zinc-950/85 px-2 text-white">
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

  return (
    <tr
      className={`border-b border-white/[0.06] text-zinc-200 transition hover:bg-white/[0.035] ${onRowClick ? "cursor-pointer" : ""}`}
      onClick={onRowClick}
    >
      <BodyCell>
        <span className="font-mono text-zinc-400">{index + 1}</span>
      </BodyCell>
      <BodyCell>
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-400/16 text-xs font-bold text-indigo-100 ring-1 ring-indigo-300/20">
            {category.initials}
          </div>
          <div className="min-w-0">
            <span className="font-semibold text-white">
              {category.name}
            </span>
            <p className="mt-1 truncate text-xs text-zinc-500">{category.website}</p>
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
          <span className="font-mono font-semibold text-zinc-300">{formatNumber(childCount ?? 0)}</span>
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
            progress >= 100 ? "text-emerald-200" : progress >= 70 ? "text-lime-200" : "text-amber-200"
          }`}
        >
          {formatNumber(completed)}
        </span>
      </BodyCell>
      <BodyCell className="text-center">
        <span
          className={`font-mono font-semibold ${
            missing > 0 ? "text-rose-200" : "text-zinc-200"
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
              className="grid size-9 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
              onClick={onRowClick}
              type="button"
              title="Chi tiết"
            >
              <Eye className="size-4" />
            </button>
          )}
          <button
            aria-label={`Sửa ${category.name}`}
            className="grid size-9 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
            onClick={onEdit}
            type="button"
          >
            <Edit3 className="size-4" />
          </button>
          <button
            aria-label={`Xoá ${category.name}`}
            className="grid size-9 place-items-center rounded-lg text-zinc-400 transition hover:bg-rose-400/12 hover:text-rose-100"
            onClick={onDelete}
            type="button"
          >
            <Trash2 className="size-4" />
          </button>
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
    value < 50 ? "bg-amber-300" : value < 70 ? "bg-orange-300" : "bg-emerald-300";

  return (
    <div className="flex items-center gap-2">
      <div className="h-2.5 w-28 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full ${tone} transition-all duration-500`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="w-11 font-mono text-xs font-semibold text-zinc-300">{value}%</span>
    </div>
  );
}

function StatusBadge({ status }: { status: CampaignCategory["status"] }) {
  const active = status === "active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
        active ? "bg-emerald-400/12 text-emerald-200" : "bg-amber-400/12 text-amber-200"
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

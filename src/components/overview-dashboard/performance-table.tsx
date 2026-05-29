import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, MoreHorizontal, Search } from "lucide-react";
import type { OverviewTableItem } from "@/lib/api/stats-api";
import { formatVND, formatNumber } from "@/lib/format-currency";
import { exportTableCsv } from "./export-table-csv";

const statusLabel: Record<string, string> = {
  draft: "Nháp",
  active: "Đang chạy",
  paused: "Tạm dừng",
  completed: "Hoàn thành",
  off: "Đã tắt",
  running: "Đang chạy",
};

const statusClass: Record<string, string> = {
  draft: "bg-surface-2 text-muted-foreground",
  active: "bg-brand/15 text-brand",
  paused: "bg-amber-400/12 text-amber-200",
  completed: "bg-sky-400/12 text-sky-200",
  off: "bg-rose-400/12 text-rose-200",
  running: "bg-brand/15 text-brand",
};

type Props = {
  items: OverviewTableItem[];
  total: number;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  rangeFrom: string;
  rangeTo: string;
};

export function PerformanceTable({
  items,
  total,
  loading,
  error,
  searchQuery,
  onSearchChange,
  rangeFrom,
  rangeTo,
}: Props) {
  const [quiz, setQuiz] = useState("all");

  const quizOptions = useMemo(
    () => Array.from(new Set(items.map((item) => item.parentName).filter(Boolean))),
    [items]
  );

  const filteredItems = useMemo(() => {
    if (quiz === "all") return items;
    return items.filter((item) => item.parentName === quiz);
  }, [items, quiz]);

  if (error) {
    return (
      <section className="rounded-[1.1rem] border border-rose-400/20 bg-surface p-4 text-sm text-rose-300">
        {"Lỗi tải bảng hiệu suất: "}{error}
      </section>
    );
  }

  return (
    <section className="glass-card">
      <div className="flex flex-col gap-4 border-b border-border p-4 lg:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Hiệu suất chiến dịch</h3>
            <p className="mt-1 text-sm text-muted-foreground">So sánh chi phí, lượt click và tỷ lệ chuyển đổi theo từng campaign.</p>
          </div>
          <div className="grid gap-2 md:grid-cols-[minmax(16rem,1fr)_auto_auto]">
            <label className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <span className="sr-only">Tìm kiếm chiến dịch</span>
              <input
                className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-border-strong"
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Tìm kiếm chiến dịch..."
                value={searchQuery}
              />
            </label>
            <select
              className="h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-border-strong"
              onChange={(event) => setQuiz(event.target.value)}
              value={quiz}
            >
              <option value="all">Tất cả danh mục</option>
              {quizOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-3 text-sm font-semibold text-foreground transition hover:bg-surface-2/80 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={filteredItems.length === 0}
              onClick={() => exportTableCsv(filteredItems, rangeFrom, rangeTo)}
              type="button"
            >
              <Download className="size-4" />
              Xuất Excel
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand" />
          </div>
        ) : (
          <table className="w-full min-w-[1160px] border-separate border-spacing-0 text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <HeaderCell className="w-72">Chiến dịch</HeaderCell>
                <HeaderCell className="w-36">Nguồn</HeaderCell>
                <HeaderCell className="w-32">Danh mục</HeaderCell>
                <HeaderCell className="w-28 text-right">Chi phí (đ)</HeaderCell>
                <HeaderCell className="w-28 text-right">Lượt click</HeaderCell>
                <HeaderCell className="w-32 text-right">Hoàn thành quiz</HeaderCell>
                <HeaderCell className="w-40 text-right">Hoàn thành nhiệm vụ</HeaderCell>
                <HeaderCell className="w-24 text-right">CPA (đ)</HeaderCell>
                <HeaderCell className="w-28 text-right">Tỷ lệ chuyển đổi</HeaderCell>
                <HeaderCell className="w-28">Trạng thái</HeaderCell>
                <HeaderCell className="w-20 text-right">Thao tác</HeaderCell>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr className="text-foreground transition hover:bg-surface-2" key={item.id}>
                    <BodyCell>
                      <div className="flex items-center gap-3">
                        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-400/14 text-xs font-bold text-indigo-100 ring-1 ring-indigo-300/20">
                          {item.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{item.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{"ID: "}{item.code}</p>
                        </div>
                      </div>
                    </BodyCell>
                    <BodyCell>
                      <span className="text-muted-foreground">{item.source ?? "—"}</span>
                    </BodyCell>
                    <BodyCell>{item.parentName}</BodyCell>
                    <BodyCell className="text-right font-mono">
                      {item.cost != null && item.cost > 0 ? formatVND(item.cost) : "—"}
                    </BodyCell>
                    <BodyCell className="text-right font-mono">
                      {item.clicks != null && item.clicks > 0 ? formatNumber(item.clicks) : "—"}
                    </BodyCell>
                    <BodyCell className="text-right font-mono">{formatNumber(item.valid)}</BodyCell>
                    <BodyCell className="text-right font-mono">{formatNumber(item.completed)}</BodyCell>
                    <BodyCell className="text-right font-mono">
                      {item.cpa != null && item.cpa > 0 ? formatVND(item.cpa) : "—"}
                    </BodyCell>
                    <BodyCell className="text-right font-mono font-semibold">{item.conversionRate.toFixed(2)}%</BodyCell>
                    <BodyCell>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusClass[item.status] ?? "bg-surface-2 text-muted-foreground"}`}>
                        {statusLabel[item.status] ?? item.status}
                      </span>
                    </BodyCell>
                    <BodyCell>
                      <button className="ml-auto grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-surface-2 hover:text-foreground" type="button">
                        <MoreHorizontal className="size-4" />
                      </button>
                    </BodyCell>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-border p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>{"Hiển thị "}{filteredItems.length}{" của "}{total}{" chiến dịch"}</span>
        <div className="flex items-center gap-2">
          <button aria-label="Trang trước" className="grid size-9 place-items-center rounded-lg border border-border bg-surface-2 text-muted-foreground transition hover:bg-surface-2/80" type="button">
            <ChevronLeft className="size-4" />
          </button>
          <span className="rounded-lg bg-brand px-3 py-1.5 font-bold text-brand-foreground">1</span>
          <button aria-label="Trang sau" className="grid size-9 place-items-center rounded-lg border border-border bg-surface-2 text-muted-foreground transition hover:bg-surface-2/80" type="button">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function HeaderCell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`border-b border-border px-4 py-3 font-semibold ${className}`}>{children}</th>;
}

function BodyCell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`border-b border-border px-4 py-4 align-middle ${className}`}>{children}</td>;
}

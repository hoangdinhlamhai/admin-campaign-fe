import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, MoreHorizontal, Search } from "lucide-react";
import type { OverviewTableItem } from "@/lib/api/stats-api";

const statusLabel: Record<string, string> = {
  draft: "Nháp",
  active: "Đang chạy",
  paused: "Tạm dừng",
  completed: "Hoàn thành",
  off: "Đã tắt",
  running: "Đang chạy",
};

const statusClass: Record<string, string> = {
  draft: "bg-zinc-400/12 text-zinc-300",
  active: "bg-emerald-400/12 text-emerald-200",
  paused: "bg-amber-400/12 text-amber-200",
  completed: "bg-sky-400/12 text-sky-200",
  off: "bg-rose-400/12 text-rose-200",
  running: "bg-emerald-400/12 text-emerald-200",
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

type Props = {
  items: OverviewTableItem[];
  total: number;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
};

export function PerformanceTable({
  items,
  total,
  loading,
  error,
  searchQuery,
  onSearchChange,
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
      <section className="rounded-[1.1rem] border border-rose-400/20 bg-zinc-900/58 p-4 text-sm text-rose-300">
        {"Lỗi tải bảng hiệu suất: "}{error}
      </section>
    );
  }

  return (
    <section className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl">
      <div className="flex flex-col gap-4 border-b border-white/10 p-4 lg:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Hiệu suất chiến dịch</h3>
            <p className="mt-1 text-sm text-zinc-400">So sánh chi phí, lượt click và tỷ lệ chuyển đổi theo từng campaign.</p>
          </div>
          <div className="grid gap-2 md:grid-cols-[minmax(16rem,1fr)_auto_auto]">
            <label className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <span className="sr-only">Tìm kiếm chiến dịch</span>
              <input
                className="h-11 w-full rounded-xl border border-white/10 bg-zinc-950/55 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/60"
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Tìm kiếm chiến dịch..."
                value={searchQuery}
              />
            </label>
            <select
              className="h-11 rounded-xl border border-white/10 bg-zinc-950/85 px-3 text-sm text-white outline-none transition focus:border-emerald-300/60"
              onChange={(event) => setQuiz(event.target.value)}
              value={quiz}
            >
              <option value="all">Tất cả danh mục</option>
              {quizOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.11]" type="button">
              <Download className="size-4" />
              Xuất Excel
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-emerald-300" />
          </div>
        ) : (
          <table className="w-full min-w-[1160px] border-separate border-spacing-0 text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.08em] text-zinc-500">
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
                  <td colSpan={11} className="px-4 py-12 text-center text-sm text-zinc-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr className="text-zinc-200 transition hover:bg-white/[0.055]" key={item.id}>
                    <BodyCell>
                      <div className="flex items-center gap-3">
                        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-400/14 text-xs font-bold text-indigo-100 ring-1 ring-indigo-300/20">
                          {item.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          <p className="mt-1 text-xs text-zinc-500">{"ID: "}{item.code}</p>
                        </div>
                      </div>
                    </BodyCell>
                    <BodyCell>
                      <span className="text-zinc-500">{"—"}</span>
                    </BodyCell>
                    <BodyCell>{item.parentName}</BodyCell>
                    <BodyCell className="text-right font-mono text-zinc-500">{"—"}</BodyCell>
                    <BodyCell className="text-right font-mono text-zinc-500">{"—"}</BodyCell>
                    <BodyCell className="text-right font-mono">{formatNumber(item.valid)}</BodyCell>
                    <BodyCell className="text-right font-mono">{formatNumber(item.completed)}</BodyCell>
                    <BodyCell className="text-right font-mono text-zinc-500">{"—"}</BodyCell>
                    <BodyCell className="text-right font-mono font-semibold">{item.conversionRate.toFixed(2)}%</BodyCell>
                    <BodyCell>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusClass[item.status] ?? "bg-zinc-400/12 text-zinc-300"}`}>
                        {statusLabel[item.status] ?? item.status}
                      </span>
                    </BodyCell>
                    <BodyCell>
                      <button className="ml-auto grid size-8 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/[0.08] hover:text-white" type="button">
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

      <div className="flex flex-col gap-3 border-t border-white/10 p-4 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
        <span>{"Hiển thị "}{filteredItems.length}{" của "}{total}{" chiến dịch"}</span>
        <div className="flex items-center gap-2">
          <button aria-label="Trang trước" className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-300 transition hover:bg-white/[0.1]" type="button">
            <ChevronLeft className="size-4" />
          </button>
          <span className="rounded-lg bg-emerald-300 px-3 py-1.5 font-bold text-zinc-950">1</span>
          <button aria-label="Trang sau" className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-300 transition hover:bg-white/[0.1]" type="button">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function HeaderCell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`border-b border-white/10 px-4 py-3 font-semibold ${className}`}>{children}</th>;
}

function BodyCell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`border-b border-white/5 px-4 py-4 align-middle ${className}`}>{children}</td>;
}

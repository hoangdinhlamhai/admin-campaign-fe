import { Bell } from "lucide-react";
import { Link } from "react-router";

type AlertHeaderProps = {
  openCount: number;
};

export function AlertHeader({ openCount }: AlertHeaderProps) {
  return (
    <header className="mb-5 flex flex-col gap-4 rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl sm:p-5">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
          <Link className="transition hover:text-zinc-200" to="/">Danh mục</Link>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-medium text-lime-100">Cảnh báo</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Quản lý Cảnh báo</h2>
          {openCount > 0 && (
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/15 px-3 py-1 text-sm font-semibold text-rose-200">
              <Bell className="size-4" />
              {openCount} đang mở
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-zinc-400 sm:text-base">Theo dõi và xử lý các cảnh báo hệ thống.</p>
      </div>
    </header>
  );
}

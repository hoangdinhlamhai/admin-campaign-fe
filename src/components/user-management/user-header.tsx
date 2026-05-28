import { Plus, Users } from "lucide-react";
import { Link } from "react-router";

type UserHeaderProps = {
  total: number;
};

export function UserHeader({ total }: UserHeaderProps) {
  return (
    <header className="mb-5 flex flex-col gap-4 rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl sm:p-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
          <span>Danh mục</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-medium text-lime-100">Người dùng</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Quản lý Người dùng</h2>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/12 px-3 py-1 text-sm font-semibold text-emerald-200">
            <Users className="size-4" />
            {total} người dùng
          </span>
        </div>
        <p className="mt-2 text-sm text-zinc-400 sm:text-base">Thêm, sửa, xoá tài khoản và phân quyền nhân viên.</p>
      </div>

      <Link
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[hsl(var(--brand))] px-4 text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:bg-emerald-200"
        to="/users/new"
      >
        <Plus className="size-4" />
        Thêm nhân viên
      </Link>
    </header>
  );
}

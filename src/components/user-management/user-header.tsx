import { Plus, Users } from "lucide-react";
import { Link } from "react-router";

type UserHeaderProps = {
  total: number;
};

export function UserHeader({ total }: UserHeaderProps) {
  return (
    <header className="mb-5 flex flex-col gap-4 rounded-[1.1rem] border border-border bg-surface p-4 shadow-2xl backdrop-blur-2xl sm:p-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Danh mục</span>
          <span className="text-muted-foreground/60">&gt;</span>
          <span className="font-medium text-brand">Người dùng</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Quản lý Người dùng</h2>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/12 px-3 py-1 text-sm font-semibold text-emerald-200">
            <Users className="size-4" />
            {total} người dùng
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">Thêm, sửa, xoá tài khoản và phân quyền nhân viên.</p>
      </div>

      <Link
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-brand-foreground shadow-lg transition hover:-translate-y-0.5 hover:bg-brand/80"
        to="/users/new"
      >
        <Plus className="size-4" />
        Thêm nhân viên
      </Link>
    </header>
  );
}

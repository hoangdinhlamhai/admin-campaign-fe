import { Plus, Users } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "@/lib/auth/auth-context";

type UserHeaderProps = {
  total: number;
};

export function UserHeader({ total }: UserHeaderProps) {
  const { isAdmin } = useAuth();

  return (
    <header className="glass-card mb-5 flex flex-col gap-4 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Danh mục</span>
          <span className="text-muted-foreground/60">&gt;</span>
          <span className="font-medium text-brand">Người dùng</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Quản lý Người dùng</h2>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/15 px-3 py-1 text-sm font-semibold text-brand">
            <Users className="size-4" />
            {total} người dùng
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          {isAdmin ? "Thêm, sửa, xoá tài khoản và phân quyền nhân viên." : "Xem danh sách nhân viên."}
        </p>
      </div>

      {isAdmin && (
        <Link
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-brand-foreground shadow-lg transition hover:-translate-y-0.5 hover:bg-brand/80"
          to="/users/new"
        >
          <Plus className="size-4" />
          Thêm nhân viên
        </Link>
      )}
    </header>
  );
}

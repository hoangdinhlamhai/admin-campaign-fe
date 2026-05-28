import { useState, useMemo, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Edit3, Search, Trash2 } from "lucide-react";
import type { UserRole, UserStatus } from "@/lib/user-management-data";
import { roleLabels, statusLabels } from "@/lib/user-management-data";
import type { UserWithInitials } from "./use-users";

type UserTableProps = {
  users: UserWithInitials[];
  query: string;
  onQueryChange: (q: string) => void;
  onEdit: (user: UserWithInitials) => void;
  onDelete: (id: string) => void;
};

const PAGE_SIZE = 10;

export function UserTable({ users, query, onQueryChange, onEdit, onDelete }: UserTableProps) {
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("vi-VN");
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (q && !`${u.name} ${u.email} ${u.phone}`.toLocaleLowerCase("vi-VN").includes(q)) return false;
      return true;
    });
  }, [users, query, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleRoleFilter = (v: string) => { setRoleFilter(v as UserRole | "all"); setPage(1); };
  const handleStatusFilter = (v: string) => { setStatusFilter(v as UserStatus | "all"); setPage(1); };

  return (
    <section className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl">
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Danh sách nhân viên</h3>
            <p className="mt-1 text-sm text-zinc-400">Quản lý tài khoản và phân quyền từng nhân viên.</p>
          </div>
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <span className="sr-only">Tìm người dùng</span>
            <input
              className="h-11 w-full rounded-xl border border-white/10 bg-zinc-950/55 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/60 sm:w-72"
              onChange={(e) => { onQueryChange(e.target.value); setPage(1); }}
              placeholder="Tìm tên, email, số điện thoại..."
              value={query}
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="h-9 rounded-lg border border-white/10 bg-zinc-950/85 px-3 text-sm text-white outline-none focus:border-emerald-300/60"
            onChange={(e) => handleRoleFilter(e.target.value)}
            value={roleFilter}
          >
            <option value="all">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="employee">Nhân viên</option>
          </select>
          <select
            className="h-9 rounded-lg border border-white/10 bg-zinc-950/85 px-3 text-sm text-white outline-none focus:border-emerald-300/60"
            onChange={(e) => handleStatusFilter(e.target.value)}
            value={statusFilter}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
            <option value="suspended">Bị khóa</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.12em] text-zinc-500">
              <HeaderCell className="w-10">#</HeaderCell>
              <HeaderCell className="w-56">Tên</HeaderCell>
              <HeaderCell className="w-52">Email</HeaderCell>
              <HeaderCell className="w-28">Vai trò</HeaderCell>
              <HeaderCell className="w-36">Trạng thái</HeaderCell>
              <HeaderCell className="w-24 text-center">Quyền</HeaderCell>
              <HeaderCell className="w-40">Đăng nhập cuối</HeaderCell>
              <HeaderCell className="w-20 text-right">Thao tác</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((user, idx) => (
              <UserRow
                key={user.id}
                user={user}
                index={(safePage - 1) * PAGE_SIZE + idx}
                onEdit={() => onEdit(user)}
                onDelete={() => onDelete(user.id)}
              />
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td className="px-4 py-10 text-center text-zinc-400" colSpan={8}>
                  Không tìm thấy người dùng phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 p-4 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <span>
          Hiển thị {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} của {filtered.length} người dùng
        </span>
        <div className="flex items-center gap-2">
          <button
            aria-label="Trang trước"
            className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-300 transition hover:bg-white/[0.1] disabled:opacity-40"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            type="button"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="rounded-lg bg-emerald-300 px-3 py-1.5 font-bold text-zinc-950">{safePage}</span>
          <button
            aria-label="Trang sau"
            className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-300 transition hover:bg-white/[0.1] disabled:opacity-40"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            type="button"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function UserRow({ user, index, onEdit, onDelete }: { user: UserWithInitials; index: number; onEdit: () => void; onDelete: () => void }) {
  return (
    <tr className="border-b border-white/[0.06] text-zinc-200 transition hover:bg-white/[0.035]">
      <BodyCell>
        <span className="font-mono text-zinc-400">{index + 1}</span>
      </BodyCell>
      <BodyCell>
        <div className="flex items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-400/16 text-xs font-bold text-indigo-100 ring-1 ring-indigo-300/20">
            {user.initials}
          </div>
          <button className="min-w-0 text-left font-semibold text-white transition hover:text-emerald-100" onClick={onEdit} type="button">
            {user.name}
          </button>
        </div>
      </BodyCell>
      <BodyCell>
        <span className="truncate text-zinc-300">{user.email}</span>
      </BodyCell>
      <BodyCell>
        <RoleBadge role={user.role} />
      </BodyCell>
      <BodyCell>
        <StatusBadge status={user.status} />
      </BodyCell>
      <BodyCell className="text-center">
        <span className="font-mono font-semibold text-zinc-300">{user.permissions?.length ?? 0}</span>
      </BodyCell>
      <BodyCell>
        <span className="text-zinc-400">
          {user.lastLoginAt ? formatDate(user.lastLoginAt) : <span className="text-zinc-600">Chưa đăng nhập</span>}
        </span>
      </BodyCell>
      <BodyCell>
        <div className="flex justify-end gap-1">
          <button
            aria-label={`Sửa ${user.name}`}
            className="grid size-9 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
            onClick={onEdit}
            type="button"
          >
            <Edit3 className="size-4" />
          </button>
          <button
            aria-label={`Xoá ${user.name}`}
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

function RoleBadge({ role }: { role: UserRole }) {
  const isAdmin = role === "admin";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${isAdmin ? "bg-emerald-400/12 text-emerald-200" : "bg-blue-400/12 text-blue-200"}`}>
      {roleLabels[role]}
    </span>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  const styles: Record<UserStatus, string> = {
    active: "bg-emerald-400/12 text-emerald-200",
    inactive: "bg-zinc-400/12 text-zinc-300",
    suspended: "bg-rose-400/12 text-rose-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${styles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function HeaderCell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <th className={`px-4 py-3 font-semibold ${className}`}>{children}</th>;
}

function BodyCell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-4 align-middle ${className}`}>{children}</td>;
}

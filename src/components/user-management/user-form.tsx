import type { FormEvent } from "react";
import { Save, RotateCcw } from "lucide-react";
import type { UserRole, UserStatus, Permission } from "@/lib/user-management-data";
import { roleLabels, statusLabels } from "@/lib/user-management-data";

export type UserFormState = {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  permissions: Permission[];
};

type UserFormProps = {
  form: UserFormState;
  isEditing: boolean;
  onChange: (form: UserFormState) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function UserForm({ form, isEditing, onChange, onSubmit, onCancel }: UserFormProps) {
  const handleRoleChange = (role: UserRole) => {
    onChange({ ...form, role });
  };

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={submitForm} className="flex flex-col gap-4">
      {/* Section 1: Basic info */}
      <section className="rounded-[1.1rem] border border-border bg-surface p-4 shadow-2xl backdrop-blur-2xl sm:p-5">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Thông tin cơ bản</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-foreground">Họ và tên</span>
            <input
              className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-border-strong"
              onChange={(e) => onChange({ ...form, name: e.target.value })}
              placeholder="Ví dụ: Nguyễn Văn A"
              required
              value={form.name}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-foreground">Email</span>
            <input
              className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-border-strong"
              onChange={(e) => onChange({ ...form, email: e.target.value })}
              placeholder="email@senlyzer.io"
              required
              type="email"
              value={form.email}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-foreground">Số điện thoại</span>
            <input
              className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-border-strong"
              onChange={(e) => onChange({ ...form, phone: e.target.value })}
              placeholder="09xxxxxxxx"
              type="tel"
              value={form.phone}
            />
          </label>
        </div>
      </section>

      {/* Section 2: Role + Status */}
      <section className="rounded-[1.1rem] border border-border bg-surface p-4 shadow-2xl backdrop-blur-2xl sm:p-5">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Vai trò &amp; Trạng thái</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-foreground">Vai trò</span>
            <select
              className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-border-strong"
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
              value={form.role}
            >
              {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                <option key={r} value={r}>{roleLabels[r]}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-foreground">Trạng thái</span>
            <select
              className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-border-strong"
              onChange={(e) => onChange({ ...form, status: e.target.value as UserStatus })}
              value={form.status}
            >
              {(Object.keys(statusLabels) as UserStatus[]).map((s) => (
                <option key={s} value={s}>{statusLabels[s]}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {/* Permissions section removed per user request 260528. Field-level
          permission UI not surfaced to admins; admin role still has all perms,
          employee gets default-empty permissions on create. Git history holds
          the previous block if it ever needs restoring. */}

      {/* Actions */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-brand-foreground transition hover:bg-brand/80"
          type="submit"
        >
          <Save className="size-4" />
          {isEditing ? "Lưu thay đổi" : "Thêm nhân viên"}
        </button>
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-4 text-sm font-semibold text-foreground transition hover:bg-surface-2/80"
          onClick={onCancel}
          type="button"
        >
          <RotateCcw className="size-4" />
          Huỷ
        </button>
      </div>
    </form>
  );
}

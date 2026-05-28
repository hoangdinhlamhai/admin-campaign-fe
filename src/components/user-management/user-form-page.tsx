import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { AdminShell } from "@/components/campaign-ops/admin-shell";
import { Toast } from "@/components/campaign-ops/toast";
import { type Permission, allPermissions } from "@/lib/user-management-data";
import { useUsers } from "./use-users";
import { UserForm, type UserFormState } from "./user-form";

const emptyForm: UserFormState = {
  name: "",
  email: "",
  phone: "",
  role: "employee",
  status: "active",
  permissions: [],
};

type UserFormPageProps = {
  userId?: string;
};

export function UserFormPage({ userId }: UserFormPageProps) {
  const navigate = useNavigate();
  const { users, addUser, updateUser } = useUsers();

  const editingUser = useMemo(
    () => (userId ? (users.find((u) => u.id === userId) ?? null) : null),
    [users, userId],
  );

  const [form, setForm] = useState<UserFormState>(() => {
    if (!editingUser) return emptyForm;
    return {
      name: editingUser.name,
      email: editingUser.email,
      phone: editingUser.phone,
      role: editingUser.role,
      status: editingUser.status,
      permissions: editingUser.role === "admin" ? allPermissions : (editingUser.permissions as Permission[]),
    };
  });

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const handleSubmit = () => {
    if (userId) {
      const ok = updateUser(userId, form);
      if (!ok) {
        showToast("Không tìm thấy người dùng cần cập nhật.");
        return;
      }
      showToast("Đã cập nhật người dùng.");
    } else {
      const ok = addUser(form);
      if (!ok) {
        showToast("Vui lòng nhập đầy đủ tên và email.");
        return;
      }
      showToast("Đã thêm nhân viên mới.");
    }
    window.setTimeout(() => navigate("/users"), 450);
  };

  const isEditingMissing = Boolean(userId) && !editingUser;

  return (
    <div>
      <AdminShell activeLabel="Người dùng">
        <header className="mb-5 rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl sm:p-5">
          <Link
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-white"
            to="/users"
          >
            <ArrowLeft className="size-4" />
            Quay lại danh sách
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
            <span>Danh mục</span>
            <span className="text-zinc-600">&gt;</span>
            <span>Người dùng</span>
            <span className="text-zinc-600">&gt;</span>
            <span className="font-medium text-lime-100">
              {userId ? "Sửa nhân viên" : "Thêm nhân viên"}
            </span>
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {userId ? "Sửa thông tin nhân viên" : "Thêm nhân viên mới"}
          </h2>
          <p className="mt-2 text-sm text-zinc-400 sm:text-base">
            Nhập thông tin và phân quyền, sau đó lưu để quay về bảng quản lý.
          </p>
        </header>

        {isEditingMissing ? (
          <section className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-5 text-zinc-300 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl">
            Không tìm thấy người dùng cần sửa.
          </section>
        ) : (
          <div className="w-full pb-8">
            <UserForm
              form={form}
              isEditing={Boolean(userId)}
              onChange={setForm}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/users")}
            />
          </div>
        )}
      </AdminShell>
      <Toast message={toast} />
    </div>
  );
}

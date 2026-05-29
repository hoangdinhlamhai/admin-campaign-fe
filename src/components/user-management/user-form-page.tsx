import { useState, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { AdminShell } from "@/components/campaign-ops/admin-shell";
import { Toast } from "@/components/campaign-ops/toast";
import { type Permission, allPermissions } from "@/lib/user-management-data";
import { getUser, type UserApi } from "@/lib/api/users-api";
import { useUsers } from "./use-users";
import { UserForm, type UserFormState } from "./user-form";
import { UserCampaignsSection } from "./user-campaigns-section";

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
  const { addUser, updateUser } = useUsers();

  const [editingUser, setEditingUser] = useState<UserApi | null>(null);
  const [loadingUser, setLoadingUser] = useState(Boolean(userId));
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [toast, setToast] = useState<string | null>(null);

  // Fetch user detail (with permissions) when editing
  useEffect(() => {
    if (!userId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingUser(true);
    getUser(userId)
      .then((u) => {
        setEditingUser(u);
      })
      .catch(() => {
        setEditingUser(null);
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, [userId]);

  // Populate form when user data arrives
  useEffect(() => {
    if (!editingUser) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      name: editingUser.name,
      email: editingUser.email,
      phone: editingUser.phone ?? "",
      role: editingUser.role,
      status: editingUser.status,
      permissions:
        editingUser.role === "admin"
          ? allPermissions
          : ((editingUser.permissions ?? []) as Permission[]),
    });
  }, [editingUser]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const handleSubmit = async () => {
    if (userId) {
      const ok = await updateUser(userId, form);
      if (!ok) {
        showToast("Không tìm thấy người dùng cần cập nhật.");
        return;
      }
      showToast("Đã cập nhật người dùng.");
    } else {
      const ok = await addUser(form);
      if (!ok) {
        showToast("Vui lòng nhập đầy đủ tên và email.");
        return;
      }
      showToast("Đã thêm nhân viên mới.");
    }
    window.setTimeout(() => navigate("/users"), 450);
  };

  const isEditingMissing = Boolean(userId) && !loadingUser && !editingUser;

  return (
    <div>
      <AdminShell activeLabel="Người dùng">
        <header className="glass-card mb-5 p-4 sm:p-5">
          <Link
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
            to="/users"
          >
            <ArrowLeft className="size-4" />
            Quay lại danh sách
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Danh mục</span>
            <span className="text-muted-foreground/60">&gt;</span>
            <span>Người dùng</span>
            <span className="text-muted-foreground/60">&gt;</span>
            <span className="font-medium text-brand">
              {userId ? "Sửa nhân viên" : "Thêm nhân viên"}
            </span>
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {userId ? "Sửa thông tin nhân viên" : "Thêm nhân viên mới"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Nhập thông tin và phân quyền, sau đó lưu để quay về bảng quản lý.
          </p>
        </header>

        {loadingUser ? (
          <section className="glass-card p-5 text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="size-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              <span>Đang tải thông tin...</span>
            </div>
          </section>
        ) : isEditingMissing ? (
          <section className="glass-card p-5 text-muted-foreground">
            Không tìm thấy người dùng cần sửa.
          </section>
        ) : (
          <>
            <div className="w-full pb-8">
              <UserForm
                form={form}
                isEditing={Boolean(userId)}
                onChange={setForm}
                onSubmit={handleSubmit}
                onCancel={() => navigate("/users")}
              />
            </div>

            {userId && (
              <section className="glass-card mb-8 p-4 sm:p-5">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  Chiến dịch đang phụ trách
                </h3>
                <UserCampaignsSection userId={userId} />
              </section>
            )}
          </>
        )}
      </AdminShell>
      <Toast message={toast} />
    </div>
  );
}

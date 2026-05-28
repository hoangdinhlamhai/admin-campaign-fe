import { useState } from "react";
import { useNavigate } from "react-router";
import { AdminShell } from "@/components/campaign-ops/admin-shell";
import { Toast } from "@/components/campaign-ops/toast";
import { useUsers } from "./use-users";
import { UserHeader } from "./user-header";
import { UserTable } from "./user-table";

export function UserManager() {
  const navigate = useNavigate();
  const { users, deleteUser } = useUsers();
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
    showToast("Đã xoá người dùng.");
  };

  return (
    <div>
      <AdminShell activeLabel="Người dùng">
        <UserHeader total={users.length} />
        <UserTable
          users={users}
          query={query}
          onQueryChange={setQuery}
          onEdit={(user) => navigate(`/users/${user.id}/edit`)}
          onDelete={handleDelete}
        />
      </AdminShell>
      <Toast message={toast} />
    </div>
  );
}

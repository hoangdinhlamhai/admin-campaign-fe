import { useEffect, useState, useCallback } from "react";
import {
  listUsers,
  createUser,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
  type UserApi,
} from "@/lib/api/users-api";
import type { Permission } from "@/lib/user-management-data";

type UserFormData = {
  name: string;
  email: string;
  phone: string;
  role: "admin" | "employee";
  status: "active" | "inactive" | "suspended";
  permissions: Permission[];
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Adapt UserApi to include computed initials for table display */
export type UserWithInitials = UserApi & { initials: string };

export function useUsers() {
  const [users, setUsers] = useState<UserWithInitials[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listUsers();
      setUsers(data.map((u) => ({ ...u, initials: getInitials(u.name) })));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải danh sách");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetch();
  }, [refetch]);

  const addUser = useCallback(
    async (data: UserFormData) => {
      if (!data.name.trim() || !data.email.trim()) return false;
      try {
        await createUser({
          name: data.name.trim(),
          email: data.email.trim(),
          phone: data.phone.trim() || undefined,
          role: data.role,
          status: data.status,
          permissions: data.permissions,
        });
        await refetch();
        return true;
      } catch {
        return false;
      }
    },
    [refetch],
  );

  const updateUser = useCallback(
    async (id: string, data: Partial<UserFormData>) => {
      try {
        await apiUpdateUser(id, {
          name: data.name?.trim(),
          email: data.email?.trim(),
          phone: data.phone?.trim() || undefined,
          role: data.role,
          status: data.status,
          permissions: data.permissions,
        });
        await refetch();
        return true;
      } catch {
        return false;
      }
    },
    [refetch],
  );

  const deleteUser = useCallback(
    async (id: string) => {
      try {
        await apiDeleteUser(id);
        await refetch();
      } catch (err) {
        console.error("Delete failed", err);
      }
    },
    [refetch],
  );

  const deleteUsers = useCallback(
    async (ids: string[]) => {
      try {
        await Promise.all(ids.map((id) => apiDeleteUser(id)));
        await refetch();
      } catch (err) {
        console.error("Delete batch failed", err);
      }
    },
    [refetch],
  );

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    deleteUsers,
    refetch,
  };
}

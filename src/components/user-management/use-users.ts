import { useState, useCallback } from "react";
import { type User, type Permission, defaultUsers, allPermissions } from "@/lib/user-management-data";

const STORAGE_KEY = "senlyzer-users-v1";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function loadUsers(): User[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore parse errors, use defaults */ }
  return defaultUsers;
}

function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>(loadUsers);

  const persist = useCallback((next: User[]) => {
    setUsers(next);
    saveUsers(next);
  }, []);

  const addUser = useCallback(
    (data: { name: string; email: string; phone: string; role: User["role"]; status: User["status"]; permissions: Permission[] }) => {
      if (!data.name.trim() || !data.email.trim()) return false;
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        initials: getInitials(data.name),
        role: data.role,
        status: data.status,
        permissions: data.role === "admin" ? allPermissions : data.permissions,
        createdAt: new Date().toISOString(),
        lastLoginAt: null,
        createdBy: "user-1",
      };
      persist([...loadUsers(), newUser]);
      return true;
    },
    [persist]
  );

  const updateUser = useCallback(
    (id: string, data: Partial<Omit<User, "id" | "createdAt" | "createdBy">>) => {
      const current = loadUsers();
      const idx = current.findIndex((u) => u.id === id);
      if (idx === -1) return false;
      const updated = { ...current[idx], ...data };
      if (data.name) updated.initials = getInitials(data.name);
      if (updated.role === "admin") updated.permissions = allPermissions;
      current[idx] = updated;
      persist(current);
      return true;
    },
    [persist]
  );

  const deleteUser = useCallback(
    (id: string) => {
      persist(loadUsers().filter((u) => u.id !== id));
    },
    [persist]
  );

  const deleteUsers = useCallback(
    (ids: string[]) => {
      persist(loadUsers().filter((u) => !ids.includes(u.id)));
    },
    [persist]
  );

  return { users, addUser, updateUser, deleteUser, deleteUsers };
}

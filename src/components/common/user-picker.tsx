import { useEffect, useState } from "react";
import { listUsers, type UserApi } from "@/lib/api/users-api";

type UserPickerProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  includeUnassigned?: boolean;
  disabled?: boolean;
};

export function UserPicker({ value, onChange, includeUnassigned, disabled }: UserPickerProps) {
  const [users, setUsers] = useState<UserApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <select
      className="h-11 w-full rounded-xl border border-white/10 bg-zinc-950/85 px-3 text-sm text-white outline-none transition focus:border-emerald-300/45 disabled:opacity-50"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      disabled={disabled || loading}
    >
      {includeUnassigned && <option value="">— Chưa phân công —</option>}
      {users
        .filter((u) => u.status === "active")
        .map((u) => (
          <option key={u.id} value={u.id}>
            {u.name} ({u.role === "admin" ? "Admin" : "NV"})
          </option>
        ))}
    </select>
  );
}

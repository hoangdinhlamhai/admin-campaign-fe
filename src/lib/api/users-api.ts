import { apiFetch } from "@/lib/api/config";

export type UserApi = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  status: "active" | "inactive" | "suspended";
  phone?: string | null;
  lastLoginAt?: string | null;
  createdAt?: string;
  permissions?: string[];
};

export type CreateUserDto = {
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "employee";
  status: "active" | "inactive" | "suspended";
  permissions: string[];
};

export type UpdateUserDto = Partial<CreateUserDto>;

export async function listUsers(): Promise<UserApi[]> {
  return apiFetch<UserApi[]>("/api/users");
}

export async function getUser(id: string): Promise<UserApi> {
  return apiFetch<UserApi>(`/api/users/${id}`);
}

export async function createUser(data: CreateUserDto): Promise<{ id: string }> {
  return apiFetch<{ id: string }>("/api/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateUser(id: string, data: UpdateUserDto): Promise<void> {
  await apiFetch(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id: string): Promise<void> {
  await apiFetch(`/api/users/${id}`, {
    method: "DELETE",
  });
}

export async function listUserCampaigns(userId: string): Promise<Array<{
  id: string;
  code: string;
  name: string;
  status: string;
  priority: string;
  createdAt: string;
}>> {
  return apiFetch(`/api/users/${userId}/campaigns`);
}

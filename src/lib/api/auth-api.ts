import { apiFetch } from "@/lib/api/config";
import type { AuthUser } from "@/lib/auth/auth-storage";

type LoginResponse = {
  token: string;
  user: AuthUser;
};

export async function loginApi(
  email: string,
  password: string
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getCurrentUser(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/api/auth/me");
}

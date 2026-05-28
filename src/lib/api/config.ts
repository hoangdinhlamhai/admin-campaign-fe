import { getToken, clearAuth } from "@/lib/auth/auth-storage";

export const API_BASE_URL = "http://localhost:8787";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = { ...options?.headers };

  if (options?.body) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Auth flow: 401 from a request that already had a token = stale session.
  // 401 from /login (no token) = invalid credentials — let the regular error
  // path surface the BE message.
  if (res.status === 401 && token && !path.startsWith("/api/auth/login")) {
    clearAuth();
    window.dispatchEvent(new CustomEvent("auth:logout"));
    throw new Error("Phiên đăng nhập đã hết hạn");
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = text || `API error: ${res.status}`;
    try {
      const parsed = JSON.parse(text) as { error?: string };
      if (parsed?.error) message = parsed.error;
    } catch {
      // text wasn't JSON — keep raw text
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const API_BASE_URL = "http://localhost:8787";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const headers: HeadersInit = { ...options?.headers };
  if (options?.body) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `API error: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

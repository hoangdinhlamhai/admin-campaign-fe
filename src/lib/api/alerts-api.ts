import { apiFetch } from "./config";

export type AlertSeverityApi = "danger" | "warning" | "info";
export type AlertStatusApi = "open" | "acknowledged" | "resolved";
export type AlertTypeApi = "low_users" | "no_valid_entry" | "wrong_pass_exceeded" | "campaign_paused";

export type AlertApi = {
  id: string;
  severity: AlertSeverityApi;
  status: AlertStatusApi;
  type: AlertTypeApi;
  title: string;
  description: string | null;
  campaignId: string | null;
  parentCategoryId: string | null;
  childCategoryId: string | null;
  triggeredAt: string;
  resolvedBy: string | null;
  resolvedAt: string | null;
};

export type AlertsListResponse = {
  items: AlertApi[];
  total: number;
  page: number;
  pageSize: number;
};

export type AlertsFilters = {
  status?: AlertStatusApi | "";
  severity?: AlertSeverityApi | "";
  type?: AlertTypeApi | "";
  campaignId?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
};

function buildQuery(f: AlertsFilters): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(f)) {
    if (v == null || v === "") continue;
    qs.set(k, String(v));
  }
  return qs.toString();
}

export async function fetchAlerts(filters: AlertsFilters = {}): Promise<AlertsListResponse> {
  const qs = buildQuery(filters);
  const path = qs ? `/api/alerts?${qs}` : "/api/alerts";
  return apiFetch<AlertsListResponse>(path);
}

export async function fetchAlertsVersion(): Promise<number> {
  const res = await apiFetch<{ version: number }>("/api/alerts/version");
  return res.version ?? 0;
}

export async function acknowledgeAlert(id: string): Promise<void> {
  await apiFetch<{ ok: boolean }>(`/api/alerts/${encodeURIComponent(id)}/acknowledge`, {
    method: "POST",
  });
}

export async function resolveAlert(id: string): Promise<void> {
  await apiFetch<{ ok: boolean }>(`/api/alerts/${encodeURIComponent(id)}/resolve`, {
    method: "POST",
  });
}

import { apiFetch } from "./config";
import type { CampaignStatus, CampaignPriority } from "@/lib/campaign-ops-data";

export type CampaignApi = {
  id: string;
  code: string;
  parentCategoryId: string;
  childCategoryId: string | null;
  name: string;
  keyword: string | null;
  targetUrl: string | null;
  passCode: string | null;
  passCodeEncrypted?: string | null;
  dailyUserTarget: number;
  priority: CampaignPriority;
  maxWrongAttempts: number | null;
  status: CampaignStatus;
  startsAt: string | null;
  endsAt: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  completedCount?: number;
  missingCount?: number;
  displayCount?: number;
  wrongEntryCount?: number;
  validEntryCount?: number;
  assignedTo: string | null;
  assignedToName: string | null;
  isOwner: boolean;
  lockDisplayed?: number;
  unlockClicked?: number;
  targetClicked?: number;
  passAttempted?: number;
  passValid?: number;
  passInvalid?: number;
  unlocked?: number;
  abandoned?: number;
  conversionRate?: number;
};

type ListResponse = CampaignApi[] | { value: CampaignApi[]; Count: number };

export type CreateCampaignDto = {
  parentCategoryId: string;
  childCategoryId?: string;
  name: string;
  keyword?: string;
  targetUrl?: string;
  passCode?: string;
  dailyUserTarget?: number;
  priority?: CampaignPriority;
  maxWrongAttempts?: number;
};

export type UpdateCampaignDto = Partial<CreateCampaignDto>;

export type CreateFullCampaignDto = {
  parentCategoryId: string;
  childCategoryId?: string | null;
  name: string;
  keyword?: string | null;
  targetUrl?: string | null;
  passCode?: string | null;
  dailyUserTarget?: number;
  priority?: CampaignPriority;
  maxWrongAttempts?: number | null;
  status?: "draft" | "active";
  startsAt?: string | null;
  endsAt?: string | null;
  assignedTo?: string | null;
  instructions: {
    contentHtml: string;
    contentJson?: object;
  };
  settings: {
    notifyTargetReached: boolean;
    notifyCampaignPaused: boolean;
    autoReactivateNextDay: boolean;
    limitWrongPass: boolean;
    maxWrongPassAttempts?: number | null;
    pauseOnNoValidEntry: boolean;
    noValidEntryDisplays?: number | null;
  };
};

export type UpdateFullCampaignDto = Partial<CreateFullCampaignDto>;

export type CreateCampaignResponse = { id: string; code: string };
export type OkResponse = { ok: true };

const BASE = "/api/campaigns";

export function fetchCampaigns(date?: string): Promise<ListResponse> {
  const qs = date ? `?date=${encodeURIComponent(date)}` : "";
  return apiFetch<ListResponse>(`${BASE}${qs}`);
}

export function createCampaign(data: CreateCampaignDto): Promise<CreateCampaignResponse> {
  return apiFetch<CreateCampaignResponse>(BASE, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCampaign(id: string, data: UpdateCampaignDto): Promise<OkResponse> {
  return apiFetch<OkResponse>(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteCampaign(id: string): Promise<OkResponse> {
  return apiFetch<OkResponse>(`${BASE}/${id}`, { method: "DELETE" });
}

export function publishCampaign(id: string): Promise<OkResponse> {
  return apiFetch<OkResponse>(`${BASE}/${id}/publish`, { method: "POST" });
}

export function pauseCampaign(id: string): Promise<OkResponse> {
  return apiFetch<OkResponse>(`${BASE}/${id}/pause`, { method: "POST" });
}

export function createFullCampaign(data: CreateFullCampaignDto): Promise<CreateCampaignResponse> {
  return apiFetch<CreateCampaignResponse>(`${BASE}/full`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateFullCampaign(id: string, data: UpdateFullCampaignDto): Promise<OkResponse> {
  return apiFetch<OkResponse>(`${BASE}/${id}/full`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function fetchFullCampaign(id: string): Promise<CampaignApi & { instructions: { contentHtml: string; contentJson: object | null } | null; settings: object | null; passCode: string | null }> {
  return apiFetch(`${BASE}/${id}/full`);
}

export async function assignCampaign(id: string, assignedTo: string | null): Promise<void> {
  await apiFetch(`${BASE}/${id}/assignee`, {
    method: "PATCH",
    body: JSON.stringify({ assignedTo }),
  });
}

export function fetchCampaignsWithMetrics(from: string, to: string): Promise<CampaignApi[]> {
  const params = new URLSearchParams({ from, to });
  return apiFetch<CampaignApi[]>(`/api/v1/stats/campaigns?${params.toString()}`);
}

import { apiFetch } from "./config";

export type ChildCategoryRangeStats = {
  target: number;
  completed: number;
  missing: number;
};

export type ChildCategoryApi = {
  id: string;
  parentId: string;
  parentName: string;
  name: string;
  website: string;
  initials: string;
  slug: string;
  description: string | null;
  dailyUserTarget: number;
  status: "active" | "paused";
  createdAt: string;
  campaignCount: number;
  pausedCount: number;
  rangeStats: ChildCategoryRangeStats;
};

type ListResponse = ChildCategoryApi[] | { value: ChildCategoryApi[]; Count: number };

export type CreateChildCategoryDto = {
  parentId: string;
  name: string;
  website: string;
  initials: string;
  slug: string;
  description: string;
  dailyUserTarget: number;
  status: "active" | "paused";
};

export type UpdateChildCategoryDto = Partial<CreateChildCategoryDto>;

const BASE = "/api/child-categories";

export function fetchChildCategories(from: string, to: string, parentId?: string): Promise<ListResponse> {
  const params = new URLSearchParams({ from, to });
  if (parentId) params.set("parentId", parentId);
  return apiFetch<ListResponse>(`${BASE}?${params.toString()}`);
}

export function fetchChildCategory(id: string): Promise<ChildCategoryApi> {
  return apiFetch<ChildCategoryApi>(`${BASE}/${id}`);
}

export function createChildCategory(data: CreateChildCategoryDto): Promise<ChildCategoryApi> {
  return apiFetch<ChildCategoryApi>(BASE, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateChildCategory(id: string, data: UpdateChildCategoryDto): Promise<ChildCategoryApi> {
  return apiFetch<ChildCategoryApi>(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteChildCategory(id: string): Promise<void> {
  return apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" });
}

// --- Child Detail ---

export type ChildDetailCampaignDto = {
  id: string;
  code: string;
  name: string;
  status: "active" | "paused" | "completed";
  dailyUserTarget: number;
  completedCount: number;
  missingCount: number;
  displayCount: number;
};

export type ChildDetailDto = ChildCategoryApi & {
  campaigns: ChildDetailCampaignDto[];
};

export function fetchChildDetail(id: string, from: string, to: string): Promise<ChildDetailDto> {
  const params = new URLSearchParams({ from, to });
  return apiFetch<ChildDetailDto>(`${BASE}/${id}?${params.toString()}`);
}

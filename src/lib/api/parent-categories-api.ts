import { apiFetch } from "./config";

export type ParentCategoryRangeStats = {
  target: number;
  completed: number;
  missing: number;
};

export type ParentCategoryApi = {
  id: string;
  name: string;
  website: string;
  initials: string;
  slug: string;
  description: string | null;
  dailyUserTarget: number;
  status: "active" | "paused" | "archived";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  childCount: number;
  campaignCount: number;
  pausedCount: number;
  rangeStats: ParentCategoryRangeStats;
};

type ListResponse = ParentCategoryApi[] | { value: ParentCategoryApi[]; Count: number };

export type CreateParentCategoryDto = {
  name: string;
  website: string;
  initials: string;
  slug: string;
  description: string;
  dailyUserTarget: number;
  status: "active" | "paused" | "archived";
};

export type UpdateParentCategoryDto = Partial<CreateParentCategoryDto>;

const BASE = "/api/parent-categories";

export function fetchParentCategories(from: string, to: string): Promise<ListResponse> {
  const params = new URLSearchParams({ from, to });
  return apiFetch<ListResponse>(`${BASE}?${params.toString()}`);
}

export function fetchParentCategory(id: string): Promise<ParentCategoryApi> {
  return apiFetch<ParentCategoryApi>(`${BASE}/${id}`);
}

export function createParentCategory(data: CreateParentCategoryDto): Promise<ParentCategoryApi> {
  return apiFetch<ParentCategoryApi>(BASE, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateParentCategory(id: string, data: UpdateParentCategoryDto): Promise<ParentCategoryApi> {
  return apiFetch<ParentCategoryApi>(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteParentCategory(id: string): Promise<void> {
  return apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" });
}

// --- Parent Detail ---

export type ParentDetailChildDto = {
  id: string;
  parentId: string;
  parentName: string;
  name: string;
  website: string;
  slug: string;
  initials: string;
  description: string | null;
  dailyUserTarget: number;
  status: "active" | "paused" | "archived";
  campaignCount: number;
  pausedCount: number;
  rangeStats: ParentCategoryRangeStats;
};

export type ParentDetailDto = ParentCategoryApi & {
  children: ParentDetailChildDto[];
};

export function fetchParentDetail(id: string, from: string, to: string): Promise<ParentDetailDto> {
  const params = new URLSearchParams({ from, to });
  return apiFetch<ParentDetailDto>(`${BASE}/${id}?${params.toString()}`);
}

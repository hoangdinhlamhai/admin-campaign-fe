import { apiFetch } from "./config";

export type ParentCategoryApi = {
  id: string;
  name: string;
  website: string;
  initials: string;
  slug: string;
  description: string | null;
  dailyUserTarget: number;
  status: "active" | "paused";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

type ListResponse = ParentCategoryApi[] | { value: ParentCategoryApi[]; Count: number };

export type CreateParentCategoryDto = {
  name: string;
  website: string;
  initials: string;
  slug: string;
  description: string;
  dailyUserTarget: number;
  status: "active" | "paused";
};

export type UpdateParentCategoryDto = Partial<CreateParentCategoryDto>;

const BASE = "/api/parent-categories";

export function fetchParentCategories(): Promise<ListResponse> {
  return apiFetch<ListResponse>(BASE);
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

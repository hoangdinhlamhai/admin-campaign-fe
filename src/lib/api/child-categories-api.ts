import { apiFetch } from "./config";

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

export function fetchChildCategories(): Promise<ListResponse> {
  return apiFetch<ListResponse>(BASE);
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

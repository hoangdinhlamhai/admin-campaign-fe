import type { ParentCategoryApi } from "@/lib/api/parent-categories-api";
import type { ChildCategoryApi } from "@/lib/api/child-categories-api";
import type { CampaignCategory } from "@/lib/campaign-categories-data";

export function parentApiToCategory(api: ParentCategoryApi): CampaignCategory {
  return {
    id: api.id,
    name: api.name,
    website: api.website,
    initials: api.initials,
    slug: api.slug,
    description: api.description ?? "",
    parentId: null,
    count: 0,
    dailyUsers: api.dailyUserTarget,
    completedToday: 0,
    missingToday: 0,
    status: api.status,
    createdAt: api.createdAt,
  };
}

export function childApiToCategory(api: ChildCategoryApi): CampaignCategory {
  return {
    id: api.id,
    name: api.name,
    website: api.website,
    initials: api.initials,
    slug: api.slug,
    description: api.description ?? "",
    parentId: api.parentId,
    count: 0,
    dailyUsers: api.dailyUserTarget,
    completedToday: 0,
    missingToday: 0,
    status: api.status,
    createdAt: api.createdAt,
  };
}

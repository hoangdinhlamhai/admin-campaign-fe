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
    count: api.campaignCount,
    dailyUsers: api.dailyUserTarget,
    completedToday: api.rangeStats?.completed ?? 0,
    missingToday: api.rangeStats?.missing ?? 0,
    status: api.status,
    createdAt: api.createdAt,
    childCount: api.childCount ?? 0,
    campaignCount: api.campaignCount ?? 0,
    pausedCount: api.pausedCount ?? 0,
    rangeTarget: api.rangeStats?.target ?? 0,
    rangeCompleted: api.rangeStats?.completed ?? 0,
    rangeMissing: api.rangeStats?.missing ?? 0,
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
    count: api.campaignCount,
    dailyUsers: api.dailyUserTarget,
    completedToday: api.rangeStats?.completed ?? 0,
    missingToday: api.rangeStats?.missing ?? 0,
    status: api.status,
    createdAt: api.createdAt,
    childCount: 0,
    campaignCount: api.campaignCount ?? 0,
    pausedCount: api.pausedCount ?? 0,
    rangeTarget: api.rangeStats?.target ?? 0,
    rangeCompleted: api.rangeStats?.completed ?? 0,
    rangeMissing: api.rangeStats?.missing ?? 0,
  };
}

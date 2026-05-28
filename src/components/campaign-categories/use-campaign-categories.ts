import { useState, useMemo, useCallback } from "react";
import {
  campaignCategories,
  createCategorySlug,
  type CampaignCategory,
} from "@/lib/campaign-categories-data";
import type { CategoryFormState } from "./category-form";

const storageKey = "senlyzer-campaign-categories-v2";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function normalizeCategory(category: CampaignCategory): CampaignCategory {
  return {
    ...category,
    website: category.website || `${category.slug}.com`,
    initials: category.initials || getInitials(category.name),
    dailyUsers: category.dailyUsers ?? 0,
    completedToday: category.completedToday ?? 0,
    missingToday: category.missingToday ?? 0,
    status: category.status || "active",
  };
}

function getStoredCategories() {
  if (typeof window === "undefined") {
    return campaignCategories;
  }

  const stored = window.localStorage.getItem(storageKey);
  if (!stored) {
    return campaignCategories;
  }

  try {
    return (JSON.parse(stored) as CampaignCategory[]).map(normalizeCategory);
  } catch {
    return campaignCategories;
  }
}

export function useCampaignCategories() {
  const [categories, setCategories] = useState<CampaignCategory[]>(getStoredCategories);

  const persist = (nextCategories: CampaignCategory[]) => {
    setCategories(nextCategories);
    window.localStorage.setItem(storageKey, JSON.stringify(nextCategories));
  };

  const addCategory = (form: CategoryFormState) => {
    const name = form.name.trim();
    const slug = createCategorySlug(form.slug || form.name);
    const dailyUsers = Math.max(0, Number(form.dailyUsers) || 0);

    if (!name || !slug) {
      return false;
    }

    persist([
      {
        id: `category-${Date.now()}`,
        name,
        website: `${slug}.com`,
        initials: getInitials(name),
        slug,
        description: form.description.trim(),
        parentId: form.parentId || null,
        count: 0,
        dailyUsers,
        completedToday: 0,
        missingToday: dailyUsers,
        status: "active",
        createdAt: new Intl.DateTimeFormat("en-CA").format(new Date()),
      },
      ...categories,
    ]);
    return true;
  };

  const updateCategory = (id: string, form: CategoryFormState) => {
    const name = form.name.trim();
    const slug = createCategorySlug(form.slug || form.name);
    const dailyUsers = Math.max(0, Number(form.dailyUsers) || 0);

    if (!name || !slug) {
      return false;
    }

    persist(
      categories.map((category) =>
        category.id === id
          ? {
              ...category,
              name,
              website: category.website || `${slug}.com`,
              initials: category.initials || getInitials(name),
              slug,
              description: form.description.trim(),
              parentId: form.parentId || null,
              dailyUsers,
              missingToday: Math.max(0, dailyUsers - category.completedToday),
            }
          : category,
      ),
    );
    return true;
  };

  const deleteCategory = (id: string) => {
    persist(categories.filter((category) => category.id !== id));
  };

  const deleteCategories = (ids: string[]) => {
    persist(categories.filter((category) => !ids.includes(category.id)));
  };

  const parentCategories = useMemo(
    () => categories.filter((c) => c.parentId === null),
    [categories]
  );

  const childCategories = useMemo(
    () => categories.filter((c) => c.parentId !== null),
    [categories]
  );

  const getChildrenOf = useCallback(
    (parentId: string) => categories.filter((c) => c.parentId === parentId),
    [categories]
  );

  const getParentName = useCallback(
    (parentId: string) => categories.find((c) => c.id === parentId)?.name ?? "",
    [categories]
  );

  return {
    addCategory,
    categories,
    childCategories,
    deleteCategories,
    deleteCategory,
    getChildrenOf,
    getParentName,
    parentCategories,
    updateCategory,
  };
}

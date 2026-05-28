import { useState, useEffect, useCallback } from "react";
import {
  fetchChildCategories,
  createChildCategory,
  updateChildCategory,
  deleteChildCategory,
  type UpdateChildCategoryDto,
} from "@/lib/api/child-categories-api";
import type { CampaignCategory } from "@/lib/campaign-categories-data";
import type { CategoryFormState } from "./category-form";
import { createCategorySlug } from "@/lib/campaign-categories-data";
import { childApiToCategory } from "./category-mappers";
import { dateToISO } from "@/lib/format-date";

async function loadChildCategories(from: string, to: string, parentId?: string): Promise<CampaignCategory[]> {
  const res = await fetchChildCategories(from, to, parentId);
  const items = Array.isArray(res) ? res : (res.value ?? []);
  return items.map(childApiToCategory);
}

export function useChildCategoriesApi(from?: string, to?: string, parentId?: string) {
  const todayIso = dateToISO(new Date());
  const effectiveFrom = from || todayIso;
  const effectiveTo = to || todayIso;

  const [categories, setCategories] = useState<CampaignCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve()
      .then(() => { if (!cancelled) { setLoading(true); setError(null); } })
      .then(() => loadChildCategories(effectiveFrom, effectiveTo, parentId))
      .then((data) => { if (!cancelled) setCategories(data); })
      .catch((e: unknown) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Lỗi tải dữ liệu");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [effectiveFrom, effectiveTo, parentId, tick]);

  const refetch = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  const addCategory = useCallback(async (form: CategoryFormState) => {
    const name = form.name.trim();
    const slug = createCategorySlug(form.slug || form.name);
    if (!name || !slug || !form.parentId) return false;

    try {
      await createChildCategory({
        parentId: form.parentId,
        name,
        website: slug,
        initials: form.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
        slug,
        description: form.description.trim(),
        dailyUserTarget: Math.max(0, Number(form.dailyUsers) || 0),
        status: "active",
      });
      refetch();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi tạo danh mục");
      return false;
    }
  }, [refetch]);

  const updateCategory = useCallback(async (id: string, form: CategoryFormState) => {
    const name = form.name.trim();
    const slug = createCategorySlug(form.slug || form.name);
    if (!name || !slug) return false;

    const dto: UpdateChildCategoryDto = {
      name,
      slug,
      parentId: form.parentId || undefined,
      description: form.description.trim(),
      dailyUserTarget: Math.max(0, Number(form.dailyUsers) || 0),
    };

    try {
      await updateChildCategory(id, dto);
      refetch();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi cập nhật danh mục");
      return false;
    }
  }, [refetch]);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      await deleteChildCategory(id);
      refetch();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi xóa danh mục");
    }
  }, [refetch]);

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch,
  };
}

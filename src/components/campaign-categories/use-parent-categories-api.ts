import { useState, useEffect, useCallback } from "react";
import {
  fetchParentCategories,
  createParentCategory,
  updateParentCategory,
  deleteParentCategory,
  type CreateParentCategoryDto,
  type UpdateParentCategoryDto,
} from "@/lib/api/parent-categories-api";
import type { CampaignCategory } from "@/lib/campaign-categories-data";
import type { CategoryFormState } from "./category-form";
import { createCategorySlug } from "@/lib/campaign-categories-data";
import { parentApiToCategory } from "./category-mappers";

function formToDto(form: CategoryFormState): CreateParentCategoryDto {
  return {
    name: form.name.trim(),
    website: `${createCategorySlug(form.slug || form.name)}.com`,
    initials: form.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    slug: createCategorySlug(form.slug || form.name),
    description: form.description.trim(),
    dailyUserTarget: Math.max(0, Number(form.dailyUsers) || 0),
    status: "active",
  };
}

async function loadParentCategories(): Promise<CampaignCategory[]> {
  const res = await fetchParentCategories();
  const items = Array.isArray(res) ? res : (res.value ?? []);
  return items.map(parentApiToCategory);
}

export function useParentCategoriesApi() {
  const [categories, setCategories] = useState<CampaignCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve()
      .then(() => { if (!cancelled) { setLoading(true); setError(null); } })
      .then(() => loadParentCategories())
      .then((data) => { if (!cancelled) setCategories(data); })
      .catch((e: unknown) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Lỗi tải dữ liệu");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [tick]);

  const refetch = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  const addCategory = useCallback(async (form: CategoryFormState) => {
    const name = form.name.trim();
    const slug = createCategorySlug(form.slug || form.name);
    if (!name || !slug) return false;

    try {
      await createParentCategory(formToDto(form));
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

    const dto: UpdateParentCategoryDto = {
      name,
      slug,
      description: form.description.trim(),
      dailyUserTarget: Math.max(0, Number(form.dailyUsers) || 0),
    };

    try {
      await updateParentCategory(id, dto);
      refetch();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi cập nhật danh mục");
      return false;
    }
  }, [refetch]);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      await deleteParentCategory(id);
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

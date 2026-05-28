import { useEffect, useState } from "react";
import { fetchParentCategory } from "@/lib/api/parent-categories-api";
import { fetchChildCategory } from "@/lib/api/child-categories-api";
import { parentApiToCategory, childApiToCategory } from "./category-mappers";
import type { CampaignCategory } from "@/lib/campaign-categories-data";

export type CategoryByIdMode = "parent" | "child";

// Fetch a single category by id from BE GET /:id endpoint.
// Pattern mirrors existing list hooks (cancelled flag for race-safety).
export function useCategoryById(
  id: string | undefined,
  mode: CategoryByIdMode,
) {
  const [category, setCategory] = useState<CampaignCategory | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setCategory(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const promise =
      mode === "parent"
        ? fetchParentCategory(id).then(parentApiToCategory)
        : fetchChildCategory(id).then(childApiToCategory);

    promise
      .then((data) => {
        if (!cancelled) setCategory(data);
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Lỗi tải danh mục");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, mode]);

  return { category, loading, error };
}

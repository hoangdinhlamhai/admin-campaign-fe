import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AdminShell } from "@/components/campaign-ops/admin-shell";
import { Toast } from "@/components/campaign-ops/toast";
import { DateRangePicker, type DateRangeValue } from "@/components/common/date-range-picker";
import { dateToISO } from "@/lib/format-date";
import { CategoryHeader } from "./category-header";
import { CategoryStatsCards } from "./category-stats-cards";
import { CategoryTable } from "./category-table";
import { useParentCategoriesApi } from "./use-parent-categories-api";
import { useChildCategoriesApi } from "./use-child-categories-api";

type CategoryManagerProps = {
  mode: "parent" | "child";
};

export function CategoryManager({ mode }: CategoryManagerProps) {
  const navigate = useNavigate();
  const isParent = mode === "parent";

  const today = new Date();
  const [range, setRange] = useState<DateRangeValue>({ from: today, to: today });
  const fromIso = dateToISO(range.from);
  const toIso = dateToISO(range.to);

  const parentApiHook = useParentCategoriesApi(fromIso, toIso);
  const childApiHook = useChildCategoriesApi(fromIso, toIso);

  const categories = isParent ? parentApiHook.categories : childApiHook.categories;
  const parentCategories = parentApiHook.categories;
  const deleteCategory = isParent ? parentApiHook.deleteCategory : childApiHook.deleteCategory;
  const loading = isParent ? parentApiHook.loading : childApiHook.loading;
  const error = isParent ? parentApiHook.error : childApiHook.error;

  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi-VN");
    if (!normalizedQuery) return categories;
    return categories.filter((category) =>
      [category.name, category.website, category.slug, category.description]
        .join(" ")
        .toLocaleLowerCase("vi-VN")
        .includes(normalizedQuery),
    );
  }, [categories, query]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const removeCategory = async (id: string) => {
    await deleteCategory(id);
    showToast("Đã xoá danh mục.");
  };

  const editPath = (id: string) =>
    mode === "parent" ? `/categories/parents/${id}/edit` : `/categories/children/${id}/edit`;

  const getChildrenOf = () => [];
  const getParentName = (parentId: string | null) => {
    if (!parentId) return "";
    return parentCategories.find((c) => c.id === parentId)?.name ?? parentId;
  };

  return (
    <div>
      <AdminShell activeLabel="Danh mục">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-sm text-zinc-400">Đang tải...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-sm text-rose-400">{error}</span>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <CategoryHeader mode={mode} total={categories.length} />
              <DateRangePicker value={range} onChange={setRange} />
            </div>
            <CategoryStatsCards mode={mode} from={fromIso} to={toIso} />
            <CategoryTable
              categories={filteredCategories}
              getChildrenOf={getChildrenOf}
              getParentName={getParentName}
              mode={mode}
              onDelete={removeCategory}
              onEdit={(category) => navigate(editPath(category.id))}
              onQueryChange={setQuery}
              onRowClick={(category) => navigate(
                isParent
                  ? `/categories/parents/${category.id}`
                  : `/categories/children/${category.id}`
              )}
              parentCategories={parentCategories}
              query={query}
              total={categories.length}
            />
          </>
        )}
      </AdminShell>
      <Toast message={toast} />
    </div>
  );
}

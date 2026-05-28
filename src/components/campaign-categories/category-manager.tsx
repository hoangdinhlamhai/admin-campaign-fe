import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AdminShell } from "@/components/campaign-ops/admin-shell";
import { Toast } from "@/components/campaign-ops/toast";
import { CategoryHeader } from "./category-header";
import { CategoryTable } from "./category-table";
import { useParentCategoriesApi } from "./use-parent-categories-api";
import { useChildCategoriesApi } from "./use-child-categories-api";

type CategoryManagerProps = {
  mode: "parent" | "child";
};

export function CategoryManager({ mode }: CategoryManagerProps) {
  const navigate = useNavigate();
  const parentApiHook = useParentCategoriesApi();
  const childApiHook = useChildCategoriesApi();

  const isParent = mode === "parent";

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

  // stub for child mode — no local hook needed
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
            <CategoryHeader mode={mode} total={categories.length} />
            <CategoryTable
              categories={filteredCategories}
              getChildrenOf={getChildrenOf}
              getParentName={getParentName}
              mode={mode}
              onDelete={removeCategory}
              onEdit={(category) => navigate(editPath(category.id))}
              onQueryChange={setQuery}
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

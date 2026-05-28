import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { AdminShell } from "@/components/campaign-ops/admin-shell";
import { Toast } from "@/components/campaign-ops/toast";
import { createCategorySlug } from "@/lib/campaign-categories-data";
import { CategoryForm, type CategoryFormState } from "./category-form";
import { useParentCategoriesApi } from "./use-parent-categories-api";
import { useChildCategoriesApi } from "./use-child-categories-api";
import { useCategoryById } from "./use-category-by-id";

const emptyForm: CategoryFormState = {
  name: "",
  slug: "",
  parentId: "",
  dailyUsers: "25",
  description: "",
};

type CategoryFormPageProps = {
  categoryId?: string;
  mode: "parent" | "child";
};

export function CategoryFormPage({ categoryId, mode }: CategoryFormPageProps) {
  const navigate = useNavigate();
  const parentApiHook = useParentCategoriesApi();
  const childApiHook = useChildCategoriesApi();

  const isParent = mode === "parent";

  // Mutations: pick by mode. List hooks are mounted in both modes to satisfy
  // Hook rules; the parent list is reused as dropdown source for child mode.
  const addCategory = isParent ? parentApiHook.addCategory : childApiHook.addCategory;
  const updateCategory = isParent ? parentApiHook.updateCategory : childApiHook.updateCategory;

  // Parent categories list for the child form's parent select dropdown.
  const formCategories = parentApiHook.categories;

  // Fetch the editing item directly by id (no more find-from-list).
  const { category: editingCategory, loading: loadingItem, error: errorItem } =
    useCategoryById(categoryId, mode);

  const [form, setForm] = useState<CategoryFormState>(emptyForm);

  useEffect(() => {
    if (editingCategory) {
      setForm({
        name: editingCategory.name,
        slug: editingCategory.slug,
        parentId: editingCategory.parentId ?? "",
        dailyUsers: String(editingCategory.dailyUsers),
        description: editingCategory.description,
      });
    }
  }, [editingCategory]);

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (errorItem) {
      setToast(errorItem);
      const t = window.setTimeout(() => setToast(null), 2200);
      return () => window.clearTimeout(t);
    }
  }, [errorItem]);

  const backLink = mode === "parent" ? "/categories/parents" : "/categories/children";
  const modeLabel = mode === "parent" ? "Danh mục cha" : "Danh mục con";
  const actionLabel = categoryId ? "Sửa" : "Thêm mới";

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const updateForm = (nextForm: CategoryFormState) => {
    const shouldCreateSlug =
      !categoryId &&
      nextForm.name !== form.name &&
      (!form.slug || form.slug === createCategorySlug(form.name));
    setForm({
      ...nextForm,
      slug: shouldCreateSlug ? createCategorySlug(nextForm.name) : nextForm.slug,
    });
  };

  const saveCategory = async () => {
    const formToSave =
      mode === "parent" ? { ...form, parentId: "" } : form;

    // Validate locally first
    const name = formToSave.name.trim();
    if (!name) {
      showToast("Nhập tên danh mục trước khi lưu.");
      return;
    }

    const didSave = await (categoryId
      ? updateCategory(categoryId, formToSave)
      : addCategory(formToSave));

    if (!didSave) {
      showToast("Lỗi khi lưu danh mục. Vui lòng thử lại.");
      return;
    }

    showToast(categoryId ? "Đã cập nhật danh mục." : "Đã thêm danh mục mới.");
    window.setTimeout(() => navigate(backLink), 450);
  };

  const isEditingMissingCategory =
    Boolean(categoryId) && !loadingItem && !editingCategory;

  return (
    <div>
      <AdminShell activeLabel="Danh mục">
        <header className="mb-5 rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl sm:p-5">
          <Link
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-white"
            to={backLink}
          >
            <ArrowLeft className="size-4" />
            Quay lại danh sách
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
            <span>Danh mục</span>
            <span className="text-zinc-600">&gt;</span>
            <span>{modeLabel}</span>
            <span className="text-zinc-600">&gt;</span>
            <span className="font-medium text-lime-100">{actionLabel}</span>
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {actionLabel} {modeLabel}
          </h2>
          <p className="mt-2 text-sm text-zinc-400 sm:text-base">
            Nhập thông tin danh mục, sau đó lưu để quay về bảng quản lý.
          </p>
        </header>

        {isEditingMissingCategory ? (
          <section className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-5 text-zinc-300 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl">
            Không tìm thấy danh mục cần sửa.
          </section>
        ) : (
          <div className="w-full pb-8">
            <CategoryForm
              categories={formCategories}
              editingCategory={editingCategory}
              form={form}
              mode={mode}
              onCancelEdit={() => navigate(backLink)}
              onChange={updateForm}
              onSubmit={saveCategory}
            />
          </div>
        )}
      </AdminShell>
      <Toast message={toast} />
    </div>
  );
}

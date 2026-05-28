import type { FormEvent } from "react";
import { RotateCcw, Save } from "lucide-react";
import type { CampaignCategory } from "@/lib/campaign-categories-data";

export type CategoryFormState = {
  name: string;
  slug: string;
  parentId: string;
  dailyUsers: string;
  description: string;
};

type CategoryFormProps = {
  categories: CampaignCategory[];
  editingCategory: CampaignCategory | null;
  form: CategoryFormState;
  mode: "parent" | "child";
  onCancelEdit: () => void;
  onChange: (form: CategoryFormState) => void;
  onSubmit: () => void;
};

export function CategoryForm({
  categories,
  editingCategory,
  form,
  mode,
  onCancelEdit,
  onChange,
  onSubmit,
}: CategoryFormProps) {
  // For child mode: all parent categories (parentId === null), excluding self
  const parentOptions = categories.filter(
    (c) => c.parentId === null && c.id !== editingCategory?.id,
  );

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <section
      className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl sm:p-5"
      id="category-form"
    >
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-white">
          {editingCategory
            ? `Sửa danh mục ${mode === "parent" ? "cha" : "con"}`
            : `Thêm danh mục ${mode === "parent" ? "cha" : "con"} mới`}
        </h3>
        <p className="mt-1 text-sm text-zinc-400">
          Tên và đường dẫn sẽ dùng để nhóm các chiến dịch cùng loại.
        </p>
      </div>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={submitForm}>
        {mode === "child" && (
          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-zinc-200">
              Danh mục cha <span className="text-rose-400">*</span>
            </span>
            <select
              className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-zinc-950/55 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/60"
              onChange={(e) => onChange({ ...form, parentId: e.target.value })}
              required
              value={form.parentId}
            >
              <option value="">-- Chọn danh mục cha --</option>
              {parentOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <span className="mt-1 block text-xs text-zinc-500">
              Danh mục cha mà danh mục con này thuộc về.
            </span>
          </label>
        )}

        <label className="block">
          <span className="text-sm font-medium text-zinc-200">Tên</span>
          <input
            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-zinc-950/55 px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/60"
            onChange={(e) => onChange({ ...form, name: e.target.value })}
            placeholder="Ví dụ: Caraluna"
            value={form.name}
          />
          <span className="mt-1 block text-xs text-zinc-500">
            Tên là cách danh mục hiển thị trong hệ thống.
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-200">Đường dẫn</span>
          <input
            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-zinc-950/55 px-3 font-mono text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/60"
            onChange={(e) => onChange({ ...form, slug: e.target.value })}
            placeholder="caraluna"
            value={form.slug}
          />
          <span className="mt-1 block text-xs text-zinc-500">
            Chỉ nên dùng chữ thường, số và dấu gạch ngang.
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-200">User cần chạy / ngày</span>
          <input
            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-zinc-950/55 px-3 font-mono text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/60"
            min={0}
            onChange={(e) => onChange({ ...form, dailyUsers: e.target.value })}
            placeholder="25"
            type="number"
            value={form.dailyUsers}
          />
          <span className="mt-1 block text-xs text-zinc-500">
            Số user mục tiêu cần chạy mỗi ngày cho danh mục này.
          </span>
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-zinc-200">Mô tả</span>
          <textarea
            className="mt-2 min-h-32 w-full resize-y rounded-xl border border-white/10 bg-zinc-950/55 px-3 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/60"
            onChange={(e) => onChange({ ...form, description: e.target.value })}
            placeholder="Ghi chú nội bộ cho danh mục này..."
            value={form.description}
          />
        </label>

        <div className="flex flex-col gap-2 sm:flex-row md:col-span-2">
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[hsl(var(--brand))] px-4 text-sm font-bold text-zinc-950 transition hover:bg-emerald-200"
            type="submit"
          >
            <Save className="size-4" />
            {editingCategory ? "Lưu thay đổi" : "Thêm mới"}
          </button>
          {editingCategory && (
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-4 text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.11]"
              onClick={onCancelEdit}
              type="button"
            >
              <RotateCcw className="size-4" />
              Huỷ sửa
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

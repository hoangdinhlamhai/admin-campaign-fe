import { FolderTree, Plus } from "lucide-react";
import { Link } from "react-router";

type CategoryHeaderProps = {
  mode: "parent" | "child";
  total: number;
};

export function CategoryHeader({ mode, total }: CategoryHeaderProps) {
  const label = mode === "parent" ? "Danh mục cha" : "Danh mục con";
  const newLink = mode === "parent" ? "/categories/parents/new" : "/categories/children/new";

  return (
    <header className="mb-5 flex flex-col gap-4 rounded-[1.1rem] border border-border bg-surface p-4 shadow-2xl backdrop-blur-2xl sm:p-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Danh mục</span>
          <span className="text-muted-foreground/60">&gt;</span>
          <span className="font-medium text-brand">{label}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{label}</h2>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/12 px-3 py-1 text-sm font-semibold text-emerald-200">
            <FolderTree className="size-4" />
            {total} mục
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">Tạo, sửa, xoá và phân cấp nhóm chiến dịch.</p>
      </div>

      <Link
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-brand-foreground shadow-lg transition hover:-translate-y-0.5 hover:bg-brand/80"
        to={newLink}
      >
        <Plus className="size-4" />
        Thêm mới
      </Link>
    </header>
  );
}

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
    <header className="mb-5 flex flex-col gap-4 rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl sm:p-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
          <span>Danh mục</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-medium text-lime-100">{label}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{label}</h2>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/12 px-3 py-1 text-sm font-semibold text-emerald-200">
            <FolderTree className="size-4" />
            {total} mục
          </span>
        </div>
        <p className="mt-2 text-sm text-zinc-400 sm:text-base">Tạo, sửa, xoá và phân cấp nhóm chiến dịch.</p>
      </div>

      <Link
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[hsl(var(--brand))] px-4 text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:bg-emerald-200"
        to={newLink}
      >
        <Plus className="size-4" />
        Thêm mới
      </Link>
    </header>
  );
}

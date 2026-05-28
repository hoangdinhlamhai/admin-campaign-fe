import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { DateRangePicker, type DateRangeValue } from "@/components/common/date-range-picker";
import type { ParentDetailDto } from "@/lib/api/parent-categories-api";

type Props = {
  parent: ParentDetailDto;
  range: DateRangeValue;
  onRangeChange: (range: DateRangeValue) => void;
};

export function ParentDetailInfo({ parent, range, onRangeChange }: Props) {
  return (
    <div className="mb-5">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-zinc-400">
        <Link to="/categories" className="transition hover:text-white">
          Danh mục
        </Link>
        <ChevronRight className="size-3.5" />
        <Link to="/categories/parents" className="transition hover:text-white">
          Danh mục cha
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-white font-medium">{parent.name}</span>
      </nav>

      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-lg font-bold text-emerald-300">
            {parent.initials}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">{parent.name}</h1>
            <p className="mt-0.5 text-sm text-zinc-400">
              {parent.website} &middot; /{parent.slug}
            </p>
          </div>
          <span
            className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              parent.status === "active"
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-zinc-500/15 text-zinc-400"
            }`}
          >
            {parent.status === "active" ? "Hoạt động" : "Tạm dừng"}
          </span>
        </div>
        <DateRangePicker value={range} onChange={onRangeChange} />
      </div>
    </div>
  );
}

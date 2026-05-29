import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { DateRangePicker, type DateRangeValue } from "@/components/common/date-range-picker";
import type { ChildDetailDto } from "@/lib/api/child-categories-api";

type Props = {
  child: ChildDetailDto;
  range: DateRangeValue;
  onRangeChange: (range: DateRangeValue) => void;
};

export function ChildDetailInfo({ child, range, onRangeChange }: Props) {
  return (
    <div className="mb-5">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/categories" className="transition hover:text-foreground">
          Danh mục
        </Link>
        <ChevronRight className="size-3.5" />
        <Link to="/categories/parents" className="transition hover:text-foreground">
          Danh mục cha
        </Link>
        <ChevronRight className="size-3.5" />
        <Link to={`/categories/parents/${child.parentId}`} className="transition hover:text-foreground">
          {child.parentName}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground font-medium">{child.name}</span>
      </nav>

      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-sky-500/15 text-lg font-bold text-sky-300">
            {child.initials}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{child.name}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {child.website} &middot; /{child.slug}
            </p>
          </div>
          <span
            className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              child.status === "active"
                ? "bg-brand/15 text-brand"
                : "bg-surface-2 text-muted-foreground"
            }`}
          >
            {child.status === "active" ? "Hoạt động" : "Tạm dừng"}
          </span>
        </div>
        <DateRangePicker value={range} onChange={onRangeChange} />
      </div>
    </div>
  );
}

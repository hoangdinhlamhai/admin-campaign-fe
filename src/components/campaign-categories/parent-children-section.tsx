import { useNavigate } from "react-router";
import { formatNumber } from "@/lib/format-currency";
import type { ParentDetailChildDto } from "@/lib/api/parent-categories-api";

type Props = {
  children: ParentDetailChildDto[];
};

function childStatusBadge(status: ParentDetailChildDto["status"]) {
  switch (status) {
    case "active":
      return { label: "Hoạt động", cls: "bg-brand/15 text-brand" };
    case "paused":
      return { label: "Tạm dừng", cls: "bg-amber-500/15 text-amber-300" };
    case "archived":
      return { label: "Lưu trữ", cls: "bg-surface-2 text-muted-foreground" };
    default:
      return { label: status ?? "—", cls: "bg-surface-2 text-muted-foreground" };
  }
}

export function ParentChildrenSection({ children }: Props) {
  const navigate = useNavigate();

  return (
    <section className="mt-6">
      <h2 className="mb-4 text-base font-semibold text-foreground">
        Danh sách danh mục con
      </h2>

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">DM con</th>
              <th className="px-4 py-3 text-right">Số chiến dịch</th>
              <th className="px-4 py-3 text-right">User cần chạy / ngày</th>
              <th className="px-4 py-3 text-right">Đã hoàn thành</th>
              <th className="px-4 py-3 text-right">Còn thiếu</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {children.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Chưa có danh mục con nào.
                </td>
              </tr>
            )}
            {children.map((child) => (
              <tr
                key={child.id}
                className="border-b border-border/60 transition hover:bg-surface-2"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-sky-500/15 text-xs font-bold text-sky-300">
                      {child.initials}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{child.name}</p>
                      <p className="text-xs text-muted-foreground">{child.website}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono text-foreground">
                  {formatNumber(child.campaignCount)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-foreground">
                  {formatNumber(child.dailyUserTarget)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-brand">
                  {formatNumber(child.rangeStats.completed)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-amber-300">
                  {formatNumber(child.rangeStats.missing)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${childStatusBadge(child.status).cls}`}>
                      {childStatusBadge(child.status).label}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate(`/categories/children/${child.id}`)}
                      className="rounded-lg bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:bg-surface-2/80 hover:text-foreground"
                    >
                      Chi tiết
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

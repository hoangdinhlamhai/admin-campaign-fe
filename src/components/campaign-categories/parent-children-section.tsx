import { useNavigate } from "react-router";
import { formatNumber } from "@/lib/format-currency";
import type { ParentDetailChildDto } from "@/lib/api/parent-categories-api";

type Props = {
  children: ParentDetailChildDto[];
};

export function ParentChildrenSection({ children }: Props) {
  const navigate = useNavigate();

  return (
    <section className="mt-6">
      <h2 className="mb-4 text-base font-semibold text-white">
        Danh sách danh mục con
      </h2>

      <div className="overflow-x-auto rounded-[1.1rem] border border-white/10 bg-zinc-900/58 shadow-xl shadow-zinc-950/20 backdrop-blur-2xl">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs font-medium uppercase tracking-wider text-zinc-400">
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
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  Chưa có danh mục con nào.
                </td>
              </tr>
            )}
            {children.map((child) => (
              <tr
                key={child.id}
                className="border-b border-white/5 transition hover:bg-white/[0.03]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-sky-500/15 text-xs font-bold text-sky-300">
                      {child.initials}
                    </div>
                    <div>
                      <p className="font-medium text-white">{child.name}</p>
                      <p className="text-xs text-zinc-500">{child.website}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono text-zinc-200">
                  {formatNumber(child.campaignCount)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-zinc-200">
                  {formatNumber(child.dailyUserTarget)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-emerald-300">
                  {formatNumber(child.rangeStats.completed)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-amber-300">
                  {formatNumber(child.rangeStats.missing)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        child.status === "active"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-zinc-500/15 text-zinc-400"
                      }`}
                    >
                      {child.status === "active" ? "Hoạt động" : "Tạm dừng"}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate(`/categories/children/${child.id}`)}
                      className="rounded-lg bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.12] hover:text-white"
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

import { useNavigate } from "react-router";
import { formatNumber } from "@/lib/format-currency";
import type { ChildDetailCampaignDto } from "@/lib/api/child-categories-api";

type Props = {
  campaigns: ChildDetailCampaignDto[];
};

function statusBadge(status: ChildDetailCampaignDto["status"]) {
  switch (status) {
    case "active":
      return { label: "Hoạt động", cls: "bg-emerald-500/15 text-emerald-300" };
    case "paused":
      return { label: "Tạm dừng", cls: "bg-zinc-500/15 text-zinc-400" };
    case "completed":
      return { label: "Hoàn thành", cls: "bg-sky-500/15 text-sky-300" };
  }
}

export function ChildCampaignsSection({ campaigns }: Props) {
  const navigate = useNavigate();

  return (
    <section className="mt-6">
      <h2 className="mb-4 text-base font-semibold text-white">
        Danh sách chiến dịch
      </h2>

      <div className="overflow-x-auto rounded-[1.1rem] border border-white/10 bg-zinc-900/58 shadow-xl shadow-zinc-950/20 backdrop-blur-2xl">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs font-medium uppercase tracking-wider text-zinc-400">
              <th className="px-4 py-3">Chiến dịch</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              <th className="px-4 py-3 text-right">User cần chạy / ngày</th>
              <th className="px-4 py-3 text-right">Đã hoàn thành</th>
              <th className="px-4 py-3 text-right">Còn thiếu</th>
              <th className="px-4 py-3 text-right">Hiển thị</th>
              <th className="px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                  Chưa có chiến dịch nào.
                </td>
              </tr>
            )}
            {campaigns.map((campaign) => {
              const badge = statusBadge(campaign.status);
              const initials = campaign.name.slice(0, 2).toUpperCase();
              return (
                <tr
                  key={campaign.id}
                  className="border-b border-white/5 transition hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-violet-500/15 text-xs font-bold text-violet-300">
                        {initials}
                      </div>
                      <div>
                        <p className="font-medium text-white">{campaign.name}</p>
                        <p className="text-xs text-zinc-500">{campaign.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-zinc-200">
                    {formatNumber(campaign.dailyUserTarget)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-emerald-300">
                    {formatNumber(campaign.completedCount)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-amber-300">
                    {formatNumber(campaign.missingCount)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-zinc-200">
                    {formatNumber(campaign.displayCount)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => navigate(`/campaigns/${campaign.id}`)}
                      className="rounded-lg bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.12] hover:text-white"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

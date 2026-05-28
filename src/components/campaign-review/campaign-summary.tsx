import { Link } from "react-router";
import type { CampaignCategory } from "@/lib/campaign-categories-data";
import type { CampaignCreateForm } from "@/lib/campaign-create-data";
import { ReviewCard } from "./review-card";

type CampaignSummaryProps = {
  category: CampaignCategory | undefined;
  form: CampaignCreateForm;
};

const priorityLabel = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
};

export function CampaignSummary({ category, form }: CampaignSummaryProps) {
  const rows = [
    ["Danh mục", category?.name || "-"],
    ["Tên chiến dịch", form.name || "-"],
    ["Keyword", form.keyword || "-"],
    ["URL đích", form.url || "-"],
    ["Mật khẩu/pass", form.pass || "-"],
    ["User cần chạy/ngày", form.dailyUsers ? `${form.dailyUsers} user` : "-"],
    ["Trạng thái", form.active ? "Hoạt động" : "Tạm dừng"],
    ["Ưu tiên hiển thị", priorityLabel[form.priority]],
  ];

  return (
    <ReviewCard
      action={<Link className="text-sm font-semibold text-emerald-200 hover:text-emerald-100" to="/campaigns/new">Sửa</Link>}
      description="Kiểm tra thông tin chính của chiến dịch trước khi tạo."
      title="Thông tin chiến dịch"
    >
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <div className="rounded-2xl border border-white/10 bg-zinc-950/36 p-4" key={label}>
            <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">{label}</p>
            <p className="mt-2 break-words text-sm font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>
    </ReviewCard>
  );
}

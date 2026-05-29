import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

type CampaignCreateHeaderProps = {
  isEditing?: boolean;
};

export function CampaignCreateHeader({ isEditing = false }: CampaignCreateHeaderProps) {
  const title = isEditing ? "Chỉnh sửa chiến dịch" : "Tạo chiến dịch mới";

  return (
    <header className="mb-5 rounded-[1.1rem] border border-border bg-surface p-4 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl sm:p-5">
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link className="inline-flex items-center gap-1 hover:text-foreground" to="/campaigns">
            <ArrowLeft className="size-4" />
            Danh mục chiến dịch
          </Link>
          <span className="text-muted-foreground">&gt;</span>
          <span className="font-medium text-lime-100">{title}</span>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">Thiết lập thông tin và hướng dẫn cho chiến dịch</p>
      </div>
    </header>
  );
}

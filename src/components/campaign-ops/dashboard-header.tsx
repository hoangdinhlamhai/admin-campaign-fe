import { Plus } from "lucide-react";
import { Link } from "react-router";
import {
  campaignAdvancedSettingsStorageKey,
  campaignBasicDraftStorageKey,
  campaignEditingIdStorageKey,
  campaignInstructionDraftStorageKey,
} from "@/lib/campaign-create-data";
import { DateRangePicker, type DateRangeValue } from "@/components/common/date-range-picker";
import { useAuth } from "@/lib/auth/auth-context";

function clearCampaignDrafts() {
  window.localStorage.removeItem(campaignBasicDraftStorageKey);
  window.localStorage.removeItem(campaignInstructionDraftStorageKey);
  window.localStorage.removeItem(campaignAdvancedSettingsStorageKey);
  window.localStorage.removeItem(campaignEditingIdStorageKey);
}

type DashboardHeaderProps = {
  dateRange: DateRangeValue;
  onDateRangeChange: (range: DateRangeValue) => void;
};

export function DashboardHeader({ dateRange, onDateRangeChange }: DashboardHeaderProps) {
  const { isAdmin } = useAuth();

  return (
    <header className="glass-card relative z-30 mb-5 flex flex-col gap-4 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-brand">Chiến dịch</span>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Quản lý chiến dịch
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          {isAdmin
            ? "Theo dõi tiến độ, xuất bản và tạm dừng các chiến dịch trong toàn hệ thống."
            : "Theo dõi và thao tác trên chiến dịch được uỷ quyền."}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
        {isAdmin && (
          <Link
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-brand-foreground shadow-lg transition hover:-translate-y-0.5 hover:opacity-90"
            onClick={clearCampaignDrafts}
            to="/campaigns/new"
          >
            <Plus className="size-4" />
            Thêm chiến dịch
          </Link>
        )}
      </div>
    </header>
  );
}

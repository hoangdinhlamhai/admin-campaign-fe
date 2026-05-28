import { Plus } from "lucide-react";
import { Link } from "react-router";
import {
  campaignAdvancedSettingsStorageKey,
  campaignBasicDraftStorageKey,
  campaignEditingIdStorageKey,
  campaignInstructionDraftStorageKey,
} from "@/lib/campaign-create-data";
import { DateRangePicker, type DateRangeValue } from "@/components/common/date-range-picker";

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
  return (
    <header className="mb-5 flex flex-col gap-4 rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl sm:p-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
          <span className="font-medium text-lime-100">Chiến dịch</span>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Quản lý chiến dịch
        </h2>
        <p className="mt-2 text-sm text-zinc-400 sm:text-base">
          Theo dõi tiến độ, xuất bản và tạm dừng các chiến dịch trong toàn hệ thống.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
        <Link
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[hsl(var(--brand))] px-4 text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:bg-emerald-200"
          onClick={clearCampaignDrafts}
          to="/campaigns/new"
        >
          <Plus className="size-4" />
          Thêm chiến dịch
        </Link>
      </div>
    </header>
  );
}

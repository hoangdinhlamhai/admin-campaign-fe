import { CalendarDays, Filter, Plus } from "lucide-react";
import { Link } from "react-router";
import {
  campaignAdvancedSettingsStorageKey,
  campaignBasicDraftStorageKey,
  campaignEditingIdStorageKey,
  campaignInstructionDraftStorageKey,
} from "@/lib/campaign-create-data";

function clearCampaignDrafts() {
  window.localStorage.removeItem(campaignBasicDraftStorageKey);
  window.localStorage.removeItem(campaignInstructionDraftStorageKey);
  window.localStorage.removeItem(campaignAdvancedSettingsStorageKey);
  window.localStorage.removeItem(campaignEditingIdStorageKey);
}

export function DashboardHeader() {
  return (
    <header className="mb-5 flex flex-col gap-4 rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl sm:p-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
          <span>Danh mục</span>
          <span className="text-zinc-600">&gt;</span>
          <span>Chiến dịch</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-medium text-lime-100">Caraluna</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Caraluna</h2>
          <span className="rounded-full border border-emerald-300/20 bg-emerald-400/12 px-3 py-1 text-sm font-semibold text-emerald-200">
            Hoạt động
          </span>
        </div>
        <p className="mt-2 text-sm text-zinc-400 sm:text-base">5 chiến dịch&nbsp;&nbsp; 25 user cần chạy / ngày</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.11]" type="button">
          <CalendarDays className="size-4" />
          Hôm nay: 20/05/2024
        </button>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.11]" type="button">
          <Filter className="size-4" />
          Bộ lọc
        </button>
        <Link className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[hsl(var(--brand))] px-4 text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:bg-emerald-200" onClick={clearCampaignDrafts} to="/campaigns/new">
          <Plus className="size-4" />
          Thêm chiến dịch
        </Link>
      </div>
    </header>
  );
}

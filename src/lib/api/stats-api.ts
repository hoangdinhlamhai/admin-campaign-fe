import { apiFetch } from "./config";

export type CategoryScope = "parent" | "child";

export type DashboardStats = {
  totalTarget: number;
  totalCompleted: number;
  totalMissing: number;
  totalDisplays: number;
  totalWrong: number;
  totalValid: number;
  totalCost: number;
  totalClicks: number;
  cpa: number;
  conversionRate: number;
};

export type CategoryStats = {
  totalCategoryCount: number;
  totalCampaignCount: number;
  pausedCampaignCount: number;
  rangeTarget: number;
  rangeCompleted: number;
  rangeMissing: number;
};

export type DashboardResponse = {
  from: string;
  to: string;
  stats: DashboardStats;
  campaignsByStatus: { status: string; count: number }[];
  activeCategoryCount: number;
  totalPausedCampaigns: number;
  categoryStats?: CategoryStats;
};

export type OverviewTableItem = {
  id: string;
  code: string;
  name: string;
  parentCategoryId: string;
  parentName: string;
  childCategoryId: string | null;
  childName: string | null;
  status: string;
  target: number;
  displays: number;
  valid: number;
  wrong: number;
  completed: number;
  missing: number;
  conversionRate: number;
  cost: number | null;
  clicks: number | null;
  cpa: number | null;
  source: string | null;
};

export type OverviewTableResponse = {
  from: string;
  to: string;
  items: OverviewTableItem[];
  total: number;
};

export function fetchDashboard(
  from: string,
  to: string
): Promise<DashboardResponse> {
  const params = new URLSearchParams({ from, to });
  return apiFetch<DashboardResponse>(
    `/api/stats/dashboard?${params.toString()}`
  );
}

export function fetchDashboardScoped(
  from: string,
  to: string,
  scope: CategoryScope
): Promise<DashboardResponse> {
  const params = new URLSearchParams({ from, to, categoryScope: scope });
  return apiFetch<DashboardResponse>(
    `/api/stats/dashboard?${params.toString()}`
  );
}

export function fetchOverviewTable(
  from: string,
  to: string,
  q?: string
): Promise<OverviewTableResponse> {
  const params = new URLSearchParams({ from, to });
  if (q) params.set("q", q);
  return apiFetch<OverviewTableResponse>(
    `/api/stats/overview-table?${params.toString()}`
  );
}

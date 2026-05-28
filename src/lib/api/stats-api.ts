import { apiFetch } from "./config";

export type RangeKey = "today" | "7d" | "30d";

export type DashboardStats = {
  totalTarget: number;
  totalCompleted: number;
  totalMissing: number;
  totalDisplays: number;
  totalWrong: number;
  totalValid: number;
  conversionRate: number;
};

export type DashboardResponse = {
  range: RangeKey;
  from: string;
  to: string;
  stats: DashboardStats;
  previous: { from: string; to: string; stats: DashboardStats };
  campaignsByStatus: { status: string; count: number }[];
  activeCategoryCount: number;
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
  range: RangeKey;
  from: string;
  to: string;
  items: OverviewTableItem[];
  total: number;
};

export function fetchDashboard(range: RangeKey): Promise<DashboardResponse> {
  return apiFetch<DashboardResponse>(`/api/stats/dashboard?range=${range}`);
}

export function fetchOverviewTable(
  range: RangeKey,
  q?: string
): Promise<OverviewTableResponse> {
  const params = new URLSearchParams({ range });
  if (q) params.set("q", q);
  return apiFetch<OverviewTableResponse>(
    `/api/stats/overview-table?${params.toString()}`
  );
}

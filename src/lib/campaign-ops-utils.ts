import type { Campaign, CampaignStatus } from "./campaign-ops-data";

export function formatPercent(value: number, decimals = 0) {
  return `${value.toFixed(decimals).replace(/\.0$/, "")}%`;
}

export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function filterCampaigns(
  rows: Campaign[],
  query: string,
  status: "all" | CampaignStatus,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase("vi-VN");

  return rows.filter((campaign) => {
    const matchesQuery =
      !normalizedQuery ||
      campaign.name.toLocaleLowerCase("vi-VN").includes(normalizedQuery) ||
      campaign.code.toLocaleLowerCase("vi-VN").includes(normalizedQuery);
    const matchesStatus = status === "all" || campaign.status === status;

    return matchesQuery && matchesStatus;
  });
}

import type { Campaign } from "@/lib/campaign-ops-data";
import { formatPercent } from "@/lib/campaign-ops-utils";

const STATUS_LABELS: Record<string, string> = {
  draft: "Ban nhap",
  active: "Hoat dong",
  paused: "Tam dung",
  stopped: "Da dung",
  archived: "Luu tru",
};

const CSV_HEADERS = [
  "Ma",
  "Ten",
  "Nguoi phu trach",
  "Muc tieu",
  "Da xong",
  "Con thieu",
  "Tien do %",
  "Nhap sai",
  "Ty le sai %",
  "Trang thai",
] as const;

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function campaignToRow(c: Campaign): string {
  const target = c.dailyUserTarget || 0;
  const completed = c.completedCount || 0;
  const progress = target > 0 ? Math.min(100, Math.round((completed / target) * 100)) : 0;
  const totalEntries = c.wrongEntryCount + c.validEntryCount;
  const wrongRate = totalEntries > 0 ? c.wrongEntryCount / totalEntries : 0;

  const fields = [
    c.code,
    c.name,
    c.assignedToName ?? "",
    String(target),
    String(completed),
    String(c.missingCount),
    `${progress}%`,
    String(c.wrongEntryCount),
    totalEntries > 0 ? formatPercent(wrongRate) : "0%",
    STATUS_LABELS[c.status] ?? c.status,
  ];

  return fields.map(escapeCsvField).join(",");
}

/**
 * Exports campaigns to a CSV file with BOM for Vietnamese-safe Excel opening.
 * Triggers a browser download.
 */
export function exportCampaignsCsv(
  campaigns: Campaign[],
  from: string,
  to: string
): void {
  const BOM = "﻿";
  const header = CSV_HEADERS.join(",");
  const rows = campaigns.map(campaignToRow);
  const content = BOM + [header, ...rows].join("\r\n");

  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const filename = `senlyzer-campaigns-${from}-${to}.csv`;
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();

  // Cleanup
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }, 100);
}

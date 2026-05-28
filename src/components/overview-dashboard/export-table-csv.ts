import type { OverviewTableItem } from "@/lib/api/stats-api";

const CSV_HEADERS = [
  "Mã",
  "Tên chiến dịch",
  "Danh mục",
  "Chi phí (đ)",
  "Lượt click",
  "Hoàn thành quiz",
  "Hoàn thành nhiệm vụ",
  "CPA (đ)",
  "Tỷ lệ chuyển đổi (%)",
  "Trạng thái",
] as const;

const STATUS_LABEL: Record<string, string> = {
  draft: "Nháp",
  active: "Đang chạy",
  paused: "Tạm dừng",
  completed: "Hoàn thành",
  off: "Đã tắt",
  running: "Đang chạy",
};

function escapeCsvValue(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function itemToRow(item: OverviewTableItem): string {
  const cells = [
    item.code,
    item.name,
    item.parentName,
    item.cost != null ? String(item.cost) : "0",
    item.clicks != null ? String(item.clicks) : "0",
    String(item.valid),
    String(item.completed),
    item.cpa != null ? String(item.cpa) : "0",
    item.conversionRate.toFixed(2),
    STATUS_LABEL[item.status] ?? item.status,
  ];
  return cells.map(escapeCsvValue).join(",");
}

/**
 * Export filtered table items as a UTF-8 BOM CSV file.
 * Triggers a browser download with Vietnamese-safe encoding.
 */
export function exportTableCsv(
  items: OverviewTableItem[],
  rangeFrom: string,
  rangeTo: string
): void {
  const headerLine = CSV_HEADERS.map(escapeCsvValue).join(",");
  const rows = items.map(itemToRow);
  const csvContent = [headerLine, ...rows].join("\r\n");

  // BOM for Excel to detect UTF-8
  const BOM = "﻿";
  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `senlyzer-campaign-performance-${rangeFrom}-${rangeTo}.csv`;
  document.body.appendChild(anchor);
  anchor.click();

  // Cleanup
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

import type { LucideIcon } from "lucide-react";
import { OctagonAlert, TriangleAlert, Info } from "lucide-react";

export type AlertSeverity = "danger" | "warning" | "info";
export type AlertStatus = "open" | "acknowledged" | "resolved";
export type AlertType = "low_users" | "no_valid_entry" | "wrong_pass_exceeded" | "campaign_paused";

export type Alert = {
  id: string;
  severity: AlertSeverity;
  status: AlertStatus;
  type: AlertType;
  title: string;
  message: string;
  campaignId: string | null;
  triggeredAt: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
};

export type SeverityConfig = {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  label: string;
};

export const severityConfig: Record<AlertSeverity, SeverityConfig> = {
  danger: {
    icon: OctagonAlert,
    color: "text-rose-400",
    bgColor: "bg-rose-500/15",
    label: "Nguy hiểm",
  },
  warning: {
    icon: TriangleAlert,
    color: "text-amber-400",
    bgColor: "bg-amber-500/15",
    label: "Cảnh báo",
  },
  info: {
    icon: Info,
    color: "text-blue-400",
    bgColor: "bg-blue-500/15",
    label: "Thông tin",
  },
};

export const alertStatusLabels: Record<AlertStatus, string> = {
  open: "Đang mở",
  acknowledged: "Đã xác nhận",
  resolved: "Đã xử lý",
};

export const alertTypeLabels: Record<AlertType, string> = {
  low_users: "Chưa đủ user",
  no_valid_entry: "Không có entry hợp lệ",
  wrong_pass_exceeded: "Vượt ngưỡng sai mã",
  campaign_paused: "Campaign tạm dừng",
};

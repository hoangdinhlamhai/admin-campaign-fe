import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  ClipboardList,
  LayoutDashboard,
  Megaphone,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

export type CampaignStatus = "draft" | "active" | "paused" | "stopped" | "archived";
export type CampaignPriority = "low" | "medium" | "high";

export type Campaign = {
  id: string;
  code: string;
  parentCategoryId: string;
  childCategoryId: string | null;
  name: string;
  keyword: string | null;
  targetUrl: string | null;
  passCode: string | null;
  dailyUserTarget: number;
  priority: CampaignPriority;
  maxWrongAttempts: number | null;
  status: CampaignStatus;
  createdAt: string;
  completedCount: number;
  missingCount: number;
  displayCount: number;
  wrongEntryCount: number;
  validEntryCount: number;
  assignedTo: string | null;
  assignedToName: string | null;
  isOwner: boolean;
};


export type NavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  active?: boolean;
  badge?: number;
  children?: { label: string; href: string }[];
};

export type AutomationRule = {
  id: string;
  trigger: string;
  action: string;
  enabled: boolean;
};

export const navItems: NavItem[] = [
  { label: "Tổng quan", icon: LayoutDashboard, href: "/overview" },
  {
    label: "Danh mục",
    icon: ClipboardList,
    href: "/categories",
    children: [
      { label: "Danh mục cha", href: "/categories/parents" },
      { label: "Danh mục con", href: "/categories/children" },
    ],
  },
  { label: "Chiến dịch", icon: Megaphone, href: "/campaigns", active: true },
  // { label: "Nhiệm vụ", icon: ShieldCheck, href: "#" },
  { label: "Người dùng", icon: Users, href: "/users" },
  { label: "Cảnh báo", icon: Bell, href: "/alerts" },
  // { label: "Báo cáo", icon: BarChart3, href: "#" },
  { label: "Cài đặt", icon: Settings, href: "/settings" },
  // { label: "Nhật ký hoạt động", icon: FileClock, href: "#" },
];


export const systemAlerts = [
  {
    id: "alert-earrings-paused",
    severity: "danger" as const,
    title: 'Chiến dịch "Bông tai bạc nữ" bị tự động tạm dừng',
    description: "Hiển thị 5 lần nhưng không có lượt nhập pass đúng",
    time: "10:32 20/05/2024",
  },
  {
    id: "alert-anklet-wrong-rate",
    severity: "warning" as const,
    title: 'Chiến dịch "Lắc bạc nữ" có tỷ lệ nhập sai cao',
    description: "Tỷ lệ nhập sai hiện tại là 50%",
    time: "09:48 20/05/2024",
  },
];

export const automationRules: AutomationRule[] = [
  {
    id: "rule-wrong-pass-3",
    trigger: "User nhập sai pass 3 lần",
    action: "Tự động chuyển user sang chiến dịch khác",
    enabled: true,
  },
  {
    id: "rule-no-valid-entry",
    trigger: "Chiến dịch hiển thị 5 lần nhưng không có lượt nhập",
    action: "Tự động tạm dừng chiến dịch",
    enabled: true,
  },
];

export const healthLegend = [
  { label: "Tốt (80-100)", value: "3 chiến dịch", color: "bg-emerald-400" },
  { label: "Trung bình (50-79)", value: "1 chiến dịch", color: "bg-amber-400" },
  { label: "Yếu (<50)", value: "1 chiến dịch", color: "bg-rose-400" },
];

export const statIcons = {
  target: Activity,
  completed: ShieldCheck,
  missing: AlertTriangle,
  paused: Bell,
  errors: BarChart3,
};

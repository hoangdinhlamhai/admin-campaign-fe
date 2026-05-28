import {
  CheckSquare,
  DollarSign,
  Gift,
  MousePointer2,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export type OverviewMetric = {
  id: string;
  label: string;
  meta: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  tone: "blue" | "emerald" | "indigo" | "amber" | "rose" | "teal";
};

export type PerformanceCampaign = {
  id: string;
  name: string;
  code: string;
  source: "Google Ads" | "TikTok Ads";
  quiz: string;
  cost: number;
  clicks: number;
  quizCompleted: number;
  tasksCompleted: number;
  cpa: number;
  conversionRate: number;
  status: "running" | "paused" | "off";
};

export const overviewMetrics: OverviewMetric[] = [
  {
    id: "ad-cost",
    label: "Chi phí quảng cáo",
    meta: "Tổng chi tiêu",
    value: "200,000 đ",
    delta: "+12.5% so với kỳ trước",
    icon: DollarSign,
    tone: "blue",
  },
  {
    id: "clicks",
    label: "Lượt click",
    meta: "Tổng click",
    value: "4,850",
    delta: "+8.7% so với kỳ trước",
    icon: MousePointer2,
    tone: "emerald",
  },
  {
    id: "quiz-completed",
    label: "Hoàn thành quiz",
    meta: "Số người hoàn thành",
    value: "1,256",
    delta: "+10.3% so với kỳ trước",
    icon: CheckSquare,
    tone: "indigo",
  },
  {
    id: "tasks-completed",
    label: "Hoàn thành nhiệm vụ",
    meta: "Số lần hoàn thành",
    value: "248",
    delta: "+15.3% so với kỳ trước",
    icon: Gift,
    tone: "amber",
  },
  {
    id: "cpa",
    label: "CPA (Chi phí / 1 nhiệm vụ)",
    meta: "Trung bình",
    value: "806 đ",
    delta: "+6.1% so với kỳ trước",
    icon: Target,
    tone: "rose",
  },
  {
    id: "conversion",
    label: "Tỷ lệ chuyển đổi",
    meta: "Tỷ lệ nhiệm vụ / click",
    value: "4.99%",
    delta: "+2.4% so với kỳ trước",
    icon: TrendingUp,
    tone: "teal",
  },
];

export const performanceCampaigns: PerformanceCampaign[] = [
  {
    id: "perf-google-search-1",
    name: "MBTI - Google Search #1",
    code: "CMP-001",
    source: "Google Ads",
    quiz: "MBTI Test",
    cost: 50000,
    clicks: 1250,
    quizCompleted: 410,
    tasksCompleted: 98,
    cpa: 510,
    conversionRate: 7.84,
    status: "running",
  },
  {
    id: "perf-google-search-2",
    name: "MBTI - Google Search #2",
    code: "CMP-002",
    source: "Google Ads",
    quiz: "MBTI Test",
    cost: 40000,
    clicks: 980,
    quizCompleted: 310,
    tasksCompleted: 55,
    cpa: 727,
    conversionRate: 5.61,
    status: "running",
  },
  {
    id: "perf-display",
    name: "IQ Test - Google Display",
    code: "CMP-003",
    source: "Google Ads",
    quiz: "IQ Test",
    cost: 30000,
    clicks: 750,
    quizCompleted: 180,
    tasksCompleted: 25,
    cpa: 1200,
    conversionRate: 3.33,
    status: "running",
  },
  {
    id: "perf-tiktok-eq",
    name: "EQ Test - TikTok Ads",
    code: "CMP-004",
    source: "TikTok Ads",
    quiz: "EQ Test",
    cost: 30000,
    clicks: 1020,
    quizCompleted: 250,
    tasksCompleted: 32,
    cpa: 938,
    conversionRate: 3.14,
    status: "paused",
  },
  {
    id: "perf-love-search",
    name: "Love Test - Google Search",
    code: "CMP-005",
    source: "Google Ads",
    quiz: "Love Test",
    cost: 50000,
    clicks: 850,
    quizCompleted: 106,
    tasksCompleted: 38,
    cpa: 1316,
    conversionRate: 4.47,
    status: "off",
  },
];

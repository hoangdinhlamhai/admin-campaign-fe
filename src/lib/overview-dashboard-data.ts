import type { LucideIcon } from "lucide-react";

export type MetricTone = "blue" | "emerald" | "indigo" | "amber" | "rose" | "teal";

export type OverviewMetric = {
  id: string;
  label: string;
  meta: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  tone: MetricTone;
};

export const toneClass: Record<MetricTone, string> = {
  amber: "bg-amber-400/14 text-amber-200 ring-amber-300/20",
  blue: "bg-sky-400/14 text-sky-200 ring-sky-300/20",
  emerald: "bg-emerald-400/14 text-emerald-200 ring-emerald-300/20",
  indigo: "bg-indigo-400/14 text-indigo-200 ring-indigo-300/20",
  rose: "bg-rose-400/14 text-rose-200 ring-rose-300/20",
  teal: "bg-teal-400/14 text-teal-200 ring-teal-300/20",
};

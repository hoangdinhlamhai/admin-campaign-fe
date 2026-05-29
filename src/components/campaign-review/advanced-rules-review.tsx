import { BellRing, RotateCcw, ShieldAlert, TimerReset } from "lucide-react";
import { Link } from "react-router";
import { type CampaignAdvancedSettings, getCampaignWizardBase } from "@/lib/campaign-create-data";
import { ReviewCard } from "./review-card";

type AdvancedRulesReviewProps = {
  settings: CampaignAdvancedSettings;
};

export function AdvancedRulesReview({ settings }: AdvancedRulesReviewProps) {
  const rules = [
    {
      active: settings.notifyLowUsers,
      icon: BellRing,
      label: `Cảnh báo admin khi còn thiếu từ ${settings.lowUsersThreshold || 0} user`,
    },
    {
      active: settings.notifyCampaignPaused,
      icon: ShieldAlert,
      label: "Cảnh báo admin khi campaign dừng",
    },
    {
      active: settings.autoReactivateNextDay,
      icon: RotateCcw,
      label: "Tự bật lại campaign vào hôm sau",
    },
    {
      active: settings.limitWrongPass,
      icon: ShieldAlert,
      label: `User nhập sai pass ${settings.maxWrongPassAttempts || 0} lần sẽ bị chuyển`,
    },
    {
      active: settings.pauseOnNoValidEntry,
      icon: TimerReset,
      label: `Hiển thị ${settings.noValidEntryDisplays || 0} lần không nhập đúng thì tự dừng`,
    },
  ];

  return (
    <ReviewCard
      action={<Link className="text-sm font-semibold text-brand hover:text-brand/80" to={`${getCampaignWizardBase()}/advanced`}>Sửa</Link>}
      title="Rule nâng cao"
    >
      <div className="space-y-3">
        {rules.map((rule) => {
          const Icon = rule.icon;

          return (
            <div
              className={`flex items-start gap-3 rounded-xl border px-3 py-2 text-sm ${
                rule.active ? "border-brand/20 bg-brand/10 text-brand" : "border-border bg-surface-2 text-muted-foreground"
              }`}
              key={rule.label}
            >
              <Icon className="mt-0.5 size-4" />
              <span>{rule.label}</span>
            </div>
          );
        })}
      </div>
    </ReviewCard>
  );
}

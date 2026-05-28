import { AdvancedSettingsCard } from "@/components/campaign-advanced/advanced-settings-card";
import { AdvancedSettingToggle } from "@/components/campaign-advanced/advanced-setting-toggle";
import type { GlobalSettings } from "@/lib/api/settings-api";

type Props = {
  draft: GlobalSettings;
  onChange: (patch: Partial<GlobalSettings>) => void;
};

export function SettingsSectionNotifications({ draft, onChange }: Props) {
  return (
    <AdvancedSettingsCard
      title="Thông báo"
      description="Cấu hình thông báo hệ thống cho quản trị viên"
    >
      <AdvancedSettingToggle
        label="Thông báo khi chiến dịch bị tạm dừng"
        description="Gửi thông báo cho admin khi có chiến dịch bị tạm dừng tự động"
        checked={draft.notify_campaign_paused}
        onChange={(v) => onChange({ notify_campaign_paused: v })}
      />
    </AdvancedSettingsCard>
  );
}

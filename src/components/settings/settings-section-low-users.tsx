import { AdvancedSettingsCard } from "@/components/campaign-advanced/advanced-settings-card";
import { AdvancedSettingToggle } from "@/components/campaign-advanced/advanced-setting-toggle";
import { AdvancedNumberField } from "@/components/campaign-advanced/advanced-number-field";
import type { GlobalSettings } from "@/lib/api/settings-api";

type Props = {
  draft: GlobalSettings;
  onChange: (patch: Partial<GlobalSettings>) => void;
};

export function SettingsSectionLowUsers({ draft, onChange }: Props) {
  return (
    <AdvancedSettingsCard
      title="Cảnh báo ít người dùng"
      description="Thông báo khi số lượng user hoàn thành chiến dịch thấp hơn ngưỡng"
    >
      <AdvancedSettingToggle
        label="Bật cảnh báo ít người dùng"
        description="Gửi thông báo khi số user hoàn thành thấp hơn ngưỡng đã đặt"
        checked={draft.notify_low_users}
        onChange={(v) => onChange({ notify_low_users: v })}
      />
      {draft.notify_low_users && (
        <AdvancedNumberField
          label="Ngưỡng cảnh báo"
          help="Số user tối thiểu cần hoàn thành mỗi ngày"
          value={String(draft.low_users_threshold)}
          onChange={(v) => onChange({ low_users_threshold: Number(v) || 0 })}
          min={1}
          suffix="users"
        />
      )}
    </AdvancedSettingsCard>
  );
}

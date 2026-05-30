import { AdvancedSettingsCard } from "@/components/campaign-advanced/advanced-settings-card";
import { AdvancedSettingToggle } from "@/components/campaign-advanced/advanced-setting-toggle";
import type { GlobalSettings } from "@/lib/api/settings-api";

type Props = {
  draft: GlobalSettings;
  onChange: (patch: Partial<GlobalSettings>) => void;
};

export function SettingsSectionTargetReached({ draft, onChange }: Props) {
  return (
    <AdvancedSettingsCard
      title="Tự pause khi đạt target"
      description="Tự pause campaign & gửi mail cho người phụ trách khi số user hoàn thành ≥ User cần chạy/ngày"
    >
      <AdvancedSettingToggle
        label="Bật tự pause & gửi mail khi đạt target"
        description="Khi số user hoàn thành đạt User cần chạy/ngày, tự pause campaign và gửi email cho người phụ trách"
        checked={draft.notify_target_reached}
        onChange={(v) => onChange({ notify_target_reached: v })}
      />
    </AdvancedSettingsCard>
  );
}

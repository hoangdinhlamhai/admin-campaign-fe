import { AdvancedSettingsCard } from "@/components/campaign-advanced/advanced-settings-card";
import { AdvancedSettingToggle } from "@/components/campaign-advanced/advanced-setting-toggle";
import { AdvancedNumberField } from "@/components/campaign-advanced/advanced-number-field";
import type { GlobalSettings } from "@/lib/api/settings-api";

type Props = {
  draft: GlobalSettings;
  onChange: (patch: Partial<GlobalSettings>) => void;
};

export function SettingsSectionWrongPass({ draft, onChange }: Props) {
  return (
    <AdvancedSettingsCard
      title="Giới hạn nhập sai pass"
      description="Tự động xử lý khi user nhập sai pass quá số lần cho phép"
    >
      <AdvancedSettingToggle
        label="Bật giới hạn nhập sai"
        description="Kích hoạt tính năng giới hạn số lần nhập sai pass"
        checked={draft.limit_wrong_pass}
        onChange={(v) => onChange({ limit_wrong_pass: v })}
      />
      {draft.limit_wrong_pass && (
        <AdvancedNumberField
          label="Số lần tối đa"
          help="Số lần nhập sai tối đa trước khi chuyển user sang chiến dịch khác"
          value={String(draft.max_wrong_pass_attempts)}
          onChange={(v) => onChange({ max_wrong_pass_attempts: Number(v) || 0 })}
          min={1}
        />
      )}
    </AdvancedSettingsCard>
  );
}

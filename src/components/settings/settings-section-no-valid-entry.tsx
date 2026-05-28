import { AdvancedSettingsCard } from "@/components/campaign-advanced/advanced-settings-card";
import { AdvancedSettingToggle } from "@/components/campaign-advanced/advanced-setting-toggle";
import { AdvancedNumberField } from "@/components/campaign-advanced/advanced-number-field";
import type { GlobalSettings } from "@/lib/api/settings-api";

type Props = {
  draft: GlobalSettings;
  onChange: (patch: Partial<GlobalSettings>) => void;
};

export function SettingsSectionNoValidEntry({ draft, onChange }: Props) {
  return (
    <AdvancedSettingsCard
      title="Tạm dừng khi không có lượt nhập hợp lệ"
      description="Tự động tạm dừng chiến dịch khi hiển thị nhiều lần nhưng không có lượt nhập pass đúng"
    >
      <AdvancedSettingToggle
        label="Bật tạm dừng tự động"
        description="Tạm dừng chiến dịch khi không có lượt nhập hợp lệ sau số lần hiển thị"
        checked={draft.pause_on_no_valid_entry}
        onChange={(v) => onChange({ pause_on_no_valid_entry: v })}
      />
      {draft.pause_on_no_valid_entry && (
        <>
          <AdvancedNumberField
            label="Số lần hiển thị"
            help="Số lần hiển thị tối đa trước khi tạm dừng chiến dịch"
            value={String(draft.no_valid_entry_displays)}
            onChange={(v) => onChange({ no_valid_entry_displays: Number(v) || 0 })}
            min={1}
          />
          <AdvancedSettingToggle
            label="Tự động kích hoạt lại vào ngày hôm sau"
            description="Chiến dịch bị tạm dừng sẽ tự động hoạt động lại vào 00:00 ngày tiếp theo"
            checked={draft.auto_reactivate_next_day}
            onChange={(v) => onChange({ auto_reactivate_next_day: v })}
          />
        </>
      )}
    </AdvancedSettingsCard>
  );
}

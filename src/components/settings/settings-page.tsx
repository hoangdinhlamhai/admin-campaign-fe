import { Loader2 } from "lucide-react";
import { SettingsHeader } from "./settings-header";
import { SettingsSectionWrongPass } from "./settings-section-wrong-pass";
import { SettingsSectionNoValidEntry } from "./settings-section-no-valid-entry";
import { SettingsSectionLowUsers } from "./settings-section-low-users";
import { SettingsSectionNotifications } from "./settings-section-notifications";
import { useGlobalSettings } from "./use-global-settings";

export function SettingsPage() {
  const { draft, loading, saving, error, dirty, update, save } =
    useGlobalSettings();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-rose-400">
          {error || "Không thể tải cài đặt"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SettingsHeader
        dirty={dirty}
        saving={saving}
        error={error}
        onSave={save}
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <SettingsSectionWrongPass draft={draft} onChange={update} />
        <SettingsSectionNoValidEntry draft={draft} onChange={update} />
        <SettingsSectionLowUsers draft={draft} onChange={update} />
        <SettingsSectionNotifications draft={draft} onChange={update} />
      </div>
    </div>
  );
}

import { Loader2 } from "lucide-react";
import { AdminShell } from "@/components/campaign-ops/admin-shell";
import { SettingsHeader } from "./settings-header";
import { SettingsSectionWrongPass } from "./settings-section-wrong-pass";
import { SettingsSectionNoValidEntry } from "./settings-section-no-valid-entry";
import { SettingsSectionTargetReached } from "./settings-section-target-reached";
import { SettingsSectionNotifications } from "./settings-section-notifications";
import { useGlobalSettings } from "./use-global-settings";

export function SettingsPage() {
  const { draft, loading, saving, error, dirty, update, save } =
    useGlobalSettings();

  return (
    <AdminShell activeLabel="Cài đặt">
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-[1.1rem] border border-border bg-surface">
          <Loader2 className="size-8 animate-spin text-brand" />
        </div>
      ) : !draft ? (
        <div className="flex h-64 items-center justify-center rounded-[1.1rem] border border-rose-400/20 bg-rose-400/10 px-4">
          <p className="text-sm text-rose-300">
            {error || "Không thể tải cài đặt"}
          </p>
        </div>
      ) : (
        <>
          <SettingsHeader
            dirty={dirty}
            saving={saving}
            error={error}
            onSave={save}
          />
          <div className="grid gap-4 pb-8 lg:grid-cols-2">
            <SettingsSectionWrongPass draft={draft} onChange={update} />
            <SettingsSectionNoValidEntry draft={draft} onChange={update} />
            <SettingsSectionTargetReached draft={draft} onChange={update} />
            <SettingsSectionNotifications draft={draft} onChange={update} />
          </div>
        </>
      )}
    </AdminShell>
  );
}

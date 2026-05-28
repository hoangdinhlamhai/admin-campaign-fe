import { apiFetch } from "./config";

export type GlobalSettings = {
  notify_low_users: boolean;
  low_users_threshold: number;
  notify_campaign_paused: boolean;
  auto_reactivate_next_day: boolean;
  limit_wrong_pass: boolean;
  max_wrong_pass_attempts: number;
  pause_on_no_valid_entry: boolean;
  no_valid_entry_displays: number;
};

export type GlobalSettingsResponse = GlobalSettings & {
  updatedAt: string;
  updatedBy?: { id: string; name: string };
};

export function fetchSettings(): Promise<GlobalSettingsResponse> {
  return apiFetch<GlobalSettingsResponse>("/api/settings");
}

export function updateSettings(
  patch: Partial<GlobalSettings>
): Promise<{ ok: boolean; updated: string[] }> {
  return apiFetch<{ ok: boolean; updated: string[] }>("/api/settings", {
    method: "PUT",
    body: JSON.stringify(patch),
  });
}

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchSettings,
  updateSettings,
  type GlobalSettings,
  type GlobalSettingsResponse,
} from "@/lib/api/settings-api";

type UseGlobalSettingsReturn = {
  data: GlobalSettingsResponse | null;
  draft: GlobalSettings | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  dirty: boolean;
  update: (patch: Partial<GlobalSettings>) => void;
  save: () => Promise<void>;
};

function extractSettings(response: GlobalSettingsResponse): GlobalSettings {
  return {
    notify_target_reached: response.notify_target_reached,
    notify_campaign_paused: response.notify_campaign_paused,
    auto_reactivate_next_day: response.auto_reactivate_next_day,
    limit_wrong_pass: response.limit_wrong_pass,
    max_wrong_pass_attempts: response.max_wrong_pass_attempts,
    pause_on_no_valid_entry: response.pause_on_no_valid_entry,
    no_valid_entry_displays: response.no_valid_entry_displays,
  };
}

function computeDiff(
  draft: GlobalSettings,
  original: GlobalSettings
): Partial<GlobalSettings> {
  const diff: Partial<GlobalSettings> = {};
  for (const key of Object.keys(draft) as (keyof GlobalSettings)[]) {
    if (draft[key] !== original[key]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (diff as any)[key] = draft[key];
    }
  }
  return diff;
}

export function useGlobalSettings(): UseGlobalSettingsReturn {
  const [data, setData] = useState<GlobalSettingsResponse | null>(null);
  const [draft, setDraft] = useState<GlobalSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const response = await fetchSettings();
        if (cancelled) return;
        setData(response);
        setDraft(extractSettings(response));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Không thể tải cài đặt");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    init();
    return () => { cancelled = true; };
  }, []);

  const dirty = useMemo(() => {
    if (!data || !draft) return false;
    return JSON.stringify(draft) !== JSON.stringify(extractSettings(data));
  }, [data, draft]);

  const update = useCallback((patch: Partial<GlobalSettings>) => {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const save = useCallback(async () => {
    if (!data || !draft) return;
    const diff = computeDiff(draft, extractSettings(data));
    if (Object.keys(diff).length === 0) return;

    setSaving(true);
    setError(null);
    try {
      await updateSettings(diff);
      const response = await fetchSettings();
      setData(response);
      setDraft(extractSettings(response));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lưu cài đặt thất bại");
    } finally {
      setSaving(false);
    }
  }, [data, draft]);

  return { data, draft, loading, saving, error, dirty, update, save };
}

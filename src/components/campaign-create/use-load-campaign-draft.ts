import { useEffect, useState } from "react";
import { fetchFullCampaign } from "@/lib/api/campaigns-api";
import {
  campaignAdvancedSettingsStorageKey,
  campaignBasicDraftStorageKey,
  campaignEditingIdStorageKey,
  campaignInstructionDraftStorageKey,
  defaultAdvancedSettings,
  type CampaignAdvancedSettings,
  type CampaignCreateForm,
} from "@/lib/campaign-create-data";

type LoadFullCampaignState = {
  loading: boolean;
  error: string | null;
  ready: boolean;
};

// Fetches the full campaign from API and writes it into the 3 localStorage drafts
// so the existing wizard pages can pick them up without changes.
export function useLoadCampaignDraft(campaignId: string | undefined): LoadFullCampaignState {
  const [state, setState] = useState<LoadFullCampaignState>({
    loading: Boolean(campaignId),
    error: null,
    ready: !campaignId,
  });

  useEffect(() => {
    if (!campaignId) {
      // Clear editing id when not in edit mode
      window.localStorage.removeItem(campaignEditingIdStorageKey);
      setState({ loading: false, error: null, ready: true });
      return;
    }

    // Skip fetch if already loaded for this campaign — prevents overwriting user edits
    const currentEditingId = window.localStorage.getItem(campaignEditingIdStorageKey);
    if (currentEditingId === campaignId) {
      setState({ loading: false, error: null, ready: true });
      return;
    }

    let cancelled = false;
    setState({ loading: true, error: null, ready: false });
    window.localStorage.setItem(campaignEditingIdStorageKey, campaignId);

    fetchFullCampaign(campaignId)
      .then((res) => {
        if (cancelled) return;

        const basic: CampaignCreateForm = {
          categoryId: res.childCategoryId ?? "",
          active: res.status === "active",
          name: res.name ?? "",
          url: res.targetUrl ?? "",
          keyword: res.keyword ?? "",
          dailyUsers: String(res.dailyUserTarget ?? ""),
          pass: res.passCode ?? "",
          priority: (res.priority ?? "medium") as CampaignCreateForm["priority"],
          maxWrongAttempts: res.maxWrongAttempts != null ? String(res.maxWrongAttempts) : "3",
          assigneeId: res.assignedTo ?? null,
        };
        window.localStorage.setItem(campaignBasicDraftStorageKey, JSON.stringify(basic));

        const html = res.instructions?.contentHtml ?? "";
        if (html) {
          window.localStorage.setItem(campaignInstructionDraftStorageKey, html);
        }

        const s = (res.settings as Partial<CampaignAdvancedSettings & { lowUsersThreshold: number; maxWrongPassAttempts: number; noValidEntryDisplays: number }>) ?? {};
        const advanced: CampaignAdvancedSettings = {
          notifyLowUsers: Boolean(s.notifyLowUsers ?? defaultAdvancedSettings.notifyLowUsers),
          lowUsersThreshold: s.lowUsersThreshold != null ? String(s.lowUsersThreshold) : defaultAdvancedSettings.lowUsersThreshold,
          notifyCampaignPaused: Boolean(s.notifyCampaignPaused ?? defaultAdvancedSettings.notifyCampaignPaused),
          autoReactivateNextDay: Boolean(s.autoReactivateNextDay ?? defaultAdvancedSettings.autoReactivateNextDay),
          limitWrongPass: Boolean(s.limitWrongPass ?? defaultAdvancedSettings.limitWrongPass),
          maxWrongPassAttempts: s.maxWrongPassAttempts != null ? String(s.maxWrongPassAttempts) : defaultAdvancedSettings.maxWrongPassAttempts,
          pauseOnNoValidEntry: Boolean(s.pauseOnNoValidEntry ?? defaultAdvancedSettings.pauseOnNoValidEntry),
          noValidEntryDisplays: s.noValidEntryDisplays != null ? String(s.noValidEntryDisplays) : defaultAdvancedSettings.noValidEntryDisplays,
        };
        window.localStorage.setItem(campaignAdvancedSettingsStorageKey, JSON.stringify(advanced));

        setState({ loading: false, error: null, ready: true });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({
          loading: false,
          error: err instanceof Error ? err.message : "Lỗi tải chiến dịch",
          ready: false,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [campaignId]);

  return state;
}

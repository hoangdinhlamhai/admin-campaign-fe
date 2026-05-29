import { useEffect, useState } from "react";
import {
  campaignBasicDraftStorageKey,
  campaignAdvancedSettingsStorageKey,
  campaignEditingIdStorageKey,
  campaignInstructionDraftStorageKey,
  defaultAdvancedSettings,
  defaultCampaignCreateForm,
  getCampaignWizardBase,
  replaceKeywordInHtml,
  type CampaignAdvancedSettings,
  type CampaignCreateForm,
} from "@/lib/campaign-create-data";
import { fetchFullCampaign } from "@/lib/api/campaigns-api";
import { fetchSettings } from "@/lib/api/settings-api";
import { listUsers, type UserApi } from "@/lib/api/users-api";
import { useAuth } from "@/lib/auth/auth-context";
import { AdminShell } from "@/components/campaign-ops/admin-shell";
import { Toast } from "@/components/campaign-ops/toast";
import { useChildCategoriesApi } from "@/components/campaign-categories/use-child-categories-api";
import { CampaignBasicForm } from "./campaign-basic-form";
import { CampaignCreateHeader } from "./campaign-create-header";
import { CampaignCreateStepper } from "./campaign-create-stepper";
import { CampaignGuidePreview } from "./campaign-guide-preview";
import { WizardFooter } from "./wizard-footer";

type CreateCampaignPageProps = {
  campaignId?: string;
};

function loadFormFromStorage(): CampaignCreateForm {
  if (typeof window === "undefined") return defaultCampaignCreateForm;
  const stored = window.localStorage.getItem(campaignBasicDraftStorageKey);
  if (!stored) return defaultCampaignCreateForm;
  try {
    return { ...defaultCampaignCreateForm, ...(JSON.parse(stored) as Partial<CampaignCreateForm>) };
  } catch {
    return defaultCampaignCreateForm;
  }
}

function loadInstructionFromStorage(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(campaignInstructionDraftStorageKey) ?? "";
}

export function CreateCampaignPage({ campaignId }: CreateCampaignPageProps = {}) {
  const { user: currentUser, isAdmin } = useAuth();
  const { categories: childCategories } = useChildCategoriesApi();
  const [users, setUsers] = useState<UserApi[]>([]);
  const [form, setForm] = useState<CampaignCreateForm>(() =>
    campaignId ? defaultCampaignCreateForm : loadFormFromStorage(),
  );
  const [instructionHtml, setInstructionHtml] = useState<string>(() =>
    campaignId ? "" : loadInstructionFromStorage(),
  );
  const [loading, setLoading] = useState(Boolean(campaignId));
  const [toast, setToast] = useState<string | null>(null);

  // Load users list for admin assignee dropdown
  useEffect(() => {
    if (!isAdmin) return;
    listUsers().then(setUsers).catch(() => { /* swallow — dropdown will be empty */ });
  }, [isAdmin]);

  // Auto-assign employee to self when creating new campaign
  useEffect(() => {
    if (campaignId) return; // editing — don't override
    if (!currentUser) return;
    if (!isAdmin && !form.assigneeId) {
      const updated = { ...form, assigneeId: currentUser.id };
      setForm(updated);
      window.localStorage.setItem(campaignBasicDraftStorageKey, JSON.stringify(updated));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, isAdmin, campaignId]);

  // Prefill step-3 advanced settings from global /api/settings on first
  // mount of create-new flow. If user already has a draft (started or
  // finished step 3), respect it. Editing flow loads from campaign itself.
  useEffect(() => {
    if (campaignId) return; // editing path uses campaign settings
    if (window.localStorage.getItem(campaignAdvancedSettingsStorageKey)) return;

    let cancelled = false;
    fetchSettings()
      .then((g) => {
        if (cancelled) return;
        const merged: CampaignAdvancedSettings = {
          notifyLowUsers: g.notify_low_users,
          lowUsersThreshold: String(g.low_users_threshold),
          notifyCampaignPaused: g.notify_campaign_paused,
          autoReactivateNextDay: g.auto_reactivate_next_day,
          limitWrongPass: g.limit_wrong_pass,
          maxWrongPassAttempts: String(g.max_wrong_pass_attempts),
          pauseOnNoValidEntry: g.pause_on_no_valid_entry,
          noValidEntryDisplays: String(g.no_valid_entry_displays),
        };
        window.localStorage.setItem(campaignAdvancedSettingsStorageKey, JSON.stringify(merged));
      })
      .catch(() => {
        // Fallback: defaults already in defaultAdvancedSettings; step-3 page reads them.
      });

    return () => { cancelled = true; };
  }, [campaignId]);

  // Fetch campaign data when editing — always re-fetch when id changes
  useEffect(() => {
    if (!campaignId) {
      window.localStorage.removeItem(campaignEditingIdStorageKey);
      return;
    }

    let cancelled = false;
    setLoading(true);
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
        setForm(basic);
        window.localStorage.setItem(campaignBasicDraftStorageKey, JSON.stringify(basic));

        const html = res.instructions?.contentHtml ?? "";
        if (html) {
          window.localStorage.setItem(campaignInstructionDraftStorageKey, html);
          setInstructionHtml(html);
        } else {
          window.localStorage.removeItem(campaignInstructionDraftStorageKey);
          setInstructionHtml("");
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

        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        showToast(err instanceof Error ? err.message : "Lỗi tải chiến dịch");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const updateForm = (nextForm: CampaignCreateForm) => {
    if (nextForm.keyword !== form.keyword) {
      setInstructionHtml((current) => {
        if (!current) return current;
        const updated = replaceKeywordInHtml(current, nextForm.keyword, form.keyword);
        if (updated !== current) {
          window.localStorage.setItem(campaignInstructionDraftStorageKey, updated);
        }
        return updated;
      });
    }
    setForm(nextForm);
    window.localStorage.setItem(campaignBasicDraftStorageKey, JSON.stringify(nextForm));
  };

  const generatePass = () => {
    setForm((current) => {
      const nextForm = {
        ...current,
        pass: String(Math.floor(1000 + Math.random() * 9000)),
      };
      window.localStorage.setItem(campaignBasicDraftStorageKey, JSON.stringify(nextForm));
      return nextForm;
    });
  };

  return (
    <div>
      <AdminShell activeLabel="Chiến dịch">
        <CampaignCreateHeader isEditing={Boolean(campaignId)} />
        <CampaignCreateStepper />
        {loading ? (
          <div className="rounded-xl border border-border bg-surface px-4 py-12 text-center text-sm text-muted-foreground">
            Đang tải dữ liệu chiến dịch...
          </div>
        ) : (
          <div className="grid gap-5 pb-8 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.95fr)]">
            <CampaignBasicForm categories={childCategories} form={form} onChange={updateForm} onGeneratePass={generatePass} users={users} currentUser={currentUser} isAdmin={isAdmin} />
            <CampaignGuidePreview form={form} instructionHtml={instructionHtml} />
          </div>
        )}
        <WizardFooter
          nextHref={`${getCampaignWizardBase()}/instructions`}
          onNext={() => window.localStorage.setItem(campaignBasicDraftStorageKey, JSON.stringify(form))}
        />
      </AdminShell>
      <Toast message={toast} />
    </div>
  );
}

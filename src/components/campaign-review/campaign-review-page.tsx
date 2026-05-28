import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import {
  campaignAdvancedSettingsStorageKey,
  campaignBasicDraftStorageKey,
  campaignEditingIdStorageKey,
  campaignInstructionDraftStorageKey,
  defaultAdvancedSettings,
  defaultCampaignCreateForm,
  defaultInstructionHtml,
  getCampaignWizardBase,
  type CampaignAdvancedSettings,
  type CampaignCreateForm,
} from "@/lib/campaign-create-data";
import { createFullCampaign, updateFullCampaign, type CreateFullCampaignDto } from "@/lib/api/campaigns-api";
import { AdminShell } from "@/components/campaign-ops/admin-shell";
import { Toast } from "@/components/campaign-ops/toast";
import { CampaignCreateStepper } from "@/components/campaign-create/campaign-create-stepper";
import { useChildCategoriesApi } from "@/components/campaign-categories/use-child-categories-api";
import { AdvancedRulesReview } from "./advanced-rules-review";
import { CampaignSummary } from "./campaign-summary";
import { InstructionReviewPreview } from "./instruction-review-preview";
import { ValidationChecklist, type ValidationItem } from "./validation-checklist";

function readJsonDraft<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const stored = window.localStorage.getItem(key);
  if (!stored) {
    return fallback;
  }

  try {
    return {
      ...fallback,
      ...(JSON.parse(stored) as Partial<T>),
    };
  } catch {
    return fallback;
  }
}

function readInstructionDraft() {
  if (typeof window === "undefined") {
    return defaultInstructionHtml;
  }

  return window.localStorage.getItem(campaignInstructionDraftStorageKey) || defaultInstructionHtml;
}

function isValidUrl(value: string) {
  if (!value.trim()) {
    return true;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function getTextLengthFromHtml(html: string) {
  if (typeof document === "undefined") {
    return html.replace(/<[^>]*>/g, "").trim().length;
  }

  const element = document.createElement("div");
  element.innerHTML = html;
  return element.textContent?.trim().length || 0;
}

export function CampaignReviewPage() {
  const navigate = useNavigate();
  const { categories: childCategories } = useChildCategoriesApi();
  const [form] = useState<CampaignCreateForm>(() => readJsonDraft(campaignBasicDraftStorageKey, defaultCampaignCreateForm));
  const [settings] = useState<CampaignAdvancedSettings>(() => readJsonDraft(campaignAdvancedSettingsStorageKey, defaultAdvancedSettings));
  const [instruction] = useState(readInstructionDraft);
  const [confirmed, setConfirmed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const category = useMemo(
    () => childCategories.find((item) => item.id === form.categoryId),
    [form.categoryId, childCategories],
  );

  const validationItems = useMemo<ValidationItem[]>(() => {
    const instructionLength = getTextLengthFromHtml(instruction);
    const hasSafetyRule = settings.limitWrongPass || settings.pauseOnNoValidEntry || settings.notifyCampaignPaused;

    return [
      { label: "Tên chiến dịch đã nhập", status: form.name.trim() ? "pass" : "error" },
      { label: "Keyword đã nhập", status: form.keyword.trim() ? "pass" : "error" },
      { label: "Pass hợp lệ", status: form.pass.trim().length >= 4 ? "pass" : "error" },
      { label: "User/ngày lớn hơn 0", status: Number(form.dailyUsers) > 0 ? "pass" : "error" },
      { label: "URL đích hợp lệ nếu có", status: isValidUrl(form.url) ? "pass" : "error" },
      {
        label: "Hướng dẫn nhiệm vụ không rỗng",
        status: instructionLength >= 30 ? "pass" : instructionLength > 0 ? "warning" : "error",
      },
      { label: "Có ít nhất 1 rule an toàn đang bật", status: hasSafetyRule ? "pass" : "warning" },
    ];
  }, [form, instruction, settings]);

  const blockingCount = validationItems.filter((item) => item.status === "error").length;
  const canCreate = confirmed && blockingCount === 0;

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const createCampaign = async () => {
    if (!canCreate) {
      showToast(blockingCount ? "Cần xử lý lỗi trước khi tạo." : "Vui lòng xác nhận trước khi tạo.");
      return;
    }

    if (!category) {
      showToast("Không tìm thấy danh mục con. Vui lòng quay lại bước 1.");
      return;
    }

    if (!category.parentId) {
      showToast("Danh mục con không có danh mục cha hợp lệ.");
      return;
    }

    const dto: CreateFullCampaignDto = {
      parentCategoryId: category.parentId,
      childCategoryId: category.id,
      name: form.name.trim(),
      keyword: form.keyword.trim() || null,
      targetUrl: form.url.trim() || null,
      passCode: form.pass.trim() || null,
      dailyUserTarget: Number(form.dailyUsers) || 0,
      priority: form.priority,
      maxWrongAttempts: Number(form.maxWrongAttempts) || null,
      status: form.active ? "active" : "draft",
      instructions: { contentHtml: instruction },
      settings: {
        notifyLowUsers: settings.notifyLowUsers,
        lowUsersThreshold: Number(settings.lowUsersThreshold) || null,
        notifyCampaignPaused: settings.notifyCampaignPaused,
        autoReactivateNextDay: settings.autoReactivateNextDay,
        limitWrongPass: settings.limitWrongPass,
        maxWrongPassAttempts: Number(settings.maxWrongPassAttempts) || null,
        pauseOnNoValidEntry: settings.pauseOnNoValidEntry,
        noValidEntryDisplays: Number(settings.noValidEntryDisplays) || null,
      },
    };

    try {
      setSubmitting(true);
      const editingId = typeof window !== "undefined" ? window.localStorage.getItem(campaignEditingIdStorageKey) : null;
      if (editingId) {
        await updateFullCampaign(editingId, dto);
      } else {
        await createFullCampaign(dto);
      }
      window.localStorage.removeItem(campaignBasicDraftStorageKey);
      window.localStorage.removeItem(campaignInstructionDraftStorageKey);
      window.localStorage.removeItem(campaignAdvancedSettingsStorageKey);
      window.localStorage.removeItem(campaignEditingIdStorageKey);
      showToast(editingId ? "Đã cập nhật chiến dịch." : "Đã tạo chiến dịch mới.");
      window.setTimeout(() => navigate("/campaigns"), 500);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Lỗi tạo chiến dịch");
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = typeof window !== "undefined" && Boolean(window.localStorage.getItem(campaignEditingIdStorageKey));
  const wizardBase = getCampaignWizardBase();

  return (
    <div>
      <AdminShell activeLabel="Chiến dịch">
        <header className="mb-5 rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl sm:p-5">
          <div className="min-w-0">
            <Link className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-white" to={`${wizardBase}/advanced`}>
              <ArrowLeft className="size-4" />
              Quay lại cài đặt nâng cao
            </Link>
            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
              <span>Danh mục chiến dịch</span>
              <span className="text-zinc-600">&gt;</span>
              <span>{category?.name || "Caraluna"}</span>
              <span className="text-zinc-600">&gt;</span>
              <span className="font-medium text-lime-100">Xem trước & Xác nhận</span>
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Xem trước & Xác nhận</h2>
            <p className="mt-2 text-sm text-zinc-400 sm:text-base">Kiểm tra toàn bộ cấu hình trước khi tạo chiến dịch.</p>
          </div>
        </header>

        <CampaignCreateStepper activeStep={4} />

        <div className="grid gap-5 pb-8 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-5">
            <CampaignSummary category={category} form={form} />
            <InstructionReviewPreview content={instruction} />
          </div>

          <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
            <ValidationChecklist items={validationItems} />
            <AdvancedRulesReview settings={settings} />
            <section className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl sm:p-5">
              <label className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-zinc-950/36 p-4">
                <input
                  checked={confirmed}
                  className="mt-1"
                  onChange={(event) => setConfirmed(event.target.checked)}
                  type="checkbox"
                />
                <span>
                  <span className="block font-semibold text-white">Tôi đã kiểm tra và xác nhận tạo chiến dịch</span>
                  <span className="mt-1 block text-sm text-zinc-400">Campaign sẽ dùng đúng thông tin, hướng dẫn và rule đang hiển thị.</span>
                </span>
              </label>
              <button
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--brand))] px-5 text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-45"
                disabled={!canCreate || submitting}
                onClick={createCampaign}
                type="button"
              >
                {submitting ? (isEditing ? "Đang cập nhật..." : "Đang tạo...") : (isEditing ? "Cập nhật chiến dịch" : "Tạo chiến dịch")}
              </button>
            </section>
          </aside>
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="text-sm text-zinc-400">Xác nhận ở bảng kiểm tra bên phải để {isEditing ? "cập nhật" : "tạo"} chiến dịch.</div>
          <Link
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-4 text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.11]"
            to={`${wizardBase}/advanced`}
          >
            <ArrowLeft className="size-4" />
            Quay lại
          </Link>
        </div>
      </AdminShell>
      <Toast message={toast} />
    </div>
  );
}

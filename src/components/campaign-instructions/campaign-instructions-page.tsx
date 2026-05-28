import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { AdminShell } from "@/components/campaign-ops/admin-shell";
import { Toast } from "@/components/campaign-ops/toast";
import { CampaignCreateStepper } from "@/components/campaign-create/campaign-create-stepper";
import { WizardFooter } from "@/components/campaign-create/wizard-footer";
import {
  campaignBasicDraftStorageKey,
  campaignInstructionDraftStorageKey,
  defaultCampaignCreateForm,
  defaultInstructionHtml,
  generateInstructionHtml,
  getCampaignWizardBase,
  type CampaignCreateForm,
} from "@/lib/campaign-create-data";
import { InstructionInlineEditor } from "./instruction-inline-editor";

function getBasicForm(): CampaignCreateForm {
  if (typeof window === "undefined") return defaultCampaignCreateForm;
  const stored = window.localStorage.getItem(campaignBasicDraftStorageKey);
  if (!stored) return defaultCampaignCreateForm;
  try {
    return { ...defaultCampaignCreateForm, ...JSON.parse(stored) };
  } catch { return defaultCampaignCreateForm; }
}

function getInitialContent(basicForm: CampaignCreateForm) {
  if (typeof window === "undefined") return defaultInstructionHtml;
  const stored = window.localStorage.getItem(campaignInstructionDraftStorageKey);
  if (stored) return stored;
  return generateInstructionHtml(basicForm);
}

export function CampaignInstructionsPage() {
  const [basicForm] = useState<CampaignCreateForm>(getBasicForm);
  const [content, setContent] = useState(() => getInitialContent(basicForm));
  const [toast] = useState<string | null>(null);

  const wizardBase = getCampaignWizardBase();

  return (
    <div>
      <AdminShell activeLabel="Chiến dịch">
        <header className="mb-5 rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl sm:p-5">
          <div className="min-w-0">
            <Link className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-white" to={wizardBase}>
              <ArrowLeft className="size-4" />
              Quay lại thông tin cơ bản
            </Link>
            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
              <span>Danh mục chiến dịch</span>
              <span className="text-zinc-600">&gt;</span>
              <span className="font-medium text-lime-100">Hướng dẫn nhiệm vụ</span>
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Hướng dẫn nhiệm vụ</h2>
            <p className="mt-2 text-sm text-zinc-400 sm:text-base">Chỉnh sửa trực tiếp nội dung hướng dẫn trong khung preview bên dưới.</p>
          </div>
        </header>

        <CampaignCreateStepper activeStep={2} />

        <div className="pb-8">
          <InstructionInlineEditor
            content={content}
            form={basicForm}
            onChange={setContent}
          />
        </div>

        <WizardFooter
          backHref={wizardBase}
          nextHref={`${wizardBase}/advanced`}
          onNext={() => window.localStorage.setItem(campaignInstructionDraftStorageKey, content)}
        />
      </AdminShell>
      <Toast message={toast} />
    </div>
  );
}

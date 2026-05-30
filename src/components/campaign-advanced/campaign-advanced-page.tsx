import { useState } from "react";
import { ArrowLeft, BellRing, RotateCcw, ShieldAlert, TimerReset } from "lucide-react";
import { Link } from "react-router";
import { AdminShell } from "@/components/campaign-ops/admin-shell";
import { Toast } from "@/components/campaign-ops/toast";
import { CampaignCreateStepper } from "@/components/campaign-create/campaign-create-stepper";
import { WizardFooter } from "@/components/campaign-create/wizard-footer";
import {
  campaignAdvancedSettingsStorageKey,
  defaultAdvancedSettings,
  getCampaignWizardBase,
  type CampaignAdvancedSettings,
} from "@/lib/campaign-create-data";
import { AdvancedNumberField } from "./advanced-number-field";
import { AdvancedSettingsCard } from "./advanced-settings-card";
import { AdvancedSettingToggle } from "./advanced-setting-toggle";

function getInitialSettings() {
  if (typeof window === "undefined") {
    return defaultAdvancedSettings;
  }

  const stored = window.localStorage.getItem(campaignAdvancedSettingsStorageKey);
  if (!stored) {
    return defaultAdvancedSettings;
  }

  try {
    return {
      ...defaultAdvancedSettings,
      ...(JSON.parse(stored) as Partial<CampaignAdvancedSettings>),
    };
  } catch {
    return defaultAdvancedSettings;
  }
}

export function CampaignAdvancedPage() {
  const [settings, setSettings] = useState<CampaignAdvancedSettings>(getInitialSettings);
  const [toast] = useState<string | null>(null);

  const updateSettings = (patch: Partial<CampaignAdvancedSettings>) => {
    setSettings((current) => ({
      ...current,
      ...patch,
    }));
  };

  const wizardBase = getCampaignWizardBase();

  return (
    <div>
      <AdminShell activeLabel="Chiến dịch">
        <header className="glass-card mb-5 p-4 sm:p-5">
          <div className="min-w-0">
            <Link className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground" to={`${wizardBase}/instructions`}>
              <ArrowLeft className="size-4" />
              Quay lại hướng dẫn nhiệm vụ
            </Link>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>Danh mục chiến dịch</span>
              <span className="text-muted-foreground/60">&gt;</span>
              <span>Caraluna</span>
              <span className="text-muted-foreground/60">&gt;</span>
              <span className="font-medium text-brand">Cài đặt nâng cao</span>
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Cài đặt nâng cao</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">Thiết lập cảnh báo và tự động hóa riêng cho chiến dịch này.</p>
          </div>
        </header>

        <CampaignCreateStepper activeStep={3} />

        <div className="grid gap-5 pb-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <AdvancedSettingsCard
              description="Tự pause campaign khi đạt target & gửi mail thông báo người phụ trách."
              title="Cảnh báo admin"
            >
              <AdvancedSettingToggle
                checked={settings.notifyTargetReached}
                description="Khi số user hoàn thành ≥ User cần chạy/ngày, tự pause campaign và gửi email cho người phụ trách."
                label="Tự pause & gửi mail khi đạt target"
                onChange={(checked) => updateSettings({ notifyTargetReached: checked })}
              />
              <AdvancedSettingToggle
                checked={settings.notifyCampaignPaused}
                description="Gửi thông báo ngay khi campaign bị tạm dừng thủ công hoặc tự động."
                label="Gửi thông báo khi campaign dừng"
                onChange={(checked) => updateSettings({ notifyCampaignPaused: checked })}
              />
            </AdvancedSettingsCard>

            <AdvancedSettingsCard
              description="Các hành động tự động giúp campaign không bị kẹt hoặc chạy sai logic."
              title="Tự động hóa"
            >
              <AdvancedSettingToggle
                checked={settings.autoReactivateNextDay}
                description="Nếu campaign bị tạm dừng hôm nay, hệ thống tự bật lại vào ngày hôm sau."
                label="Tự bật lại campaign vào hôm sau"
                onChange={(checked) => updateSettings({ autoReactivateNextDay: checked })}
              />
            </AdvancedSettingsCard>

            <AdvancedSettingsCard
              description="Giới hạn lỗi pass và tự dừng khi campaign có tín hiệu không hiệu quả."
              title="Quy tắc lỗi"
            >
              <AdvancedSettingToggle
                checked={settings.limitWrongPass}
                description="Khi user nhập sai quá số lần cho phép, user sẽ bị chuyển khỏi campaign này."
                label="User nhập sai pass N lần"
                onChange={(checked) => updateSettings({ limitWrongPass: checked })}
              />
              <AdvancedNumberField
                disabled={!settings.limitWrongPass}
                help="Ví dụ: nhập sai 3 lần thì chuyển user sang campaign khác."
                label="Số lần nhập sai tối đa"
                min={1}
                onChange={(value) => updateSettings({ maxWrongPassAttempts: value })}
                suffix="lần"
                value={settings.maxWrongPassAttempts}
              />
              <AdvancedSettingToggle
                checked={settings.pauseOnNoValidEntry}
                description="Nếu campaign hiển thị nhiều lần nhưng không có lượt nhập đúng, hệ thống tự tạm dừng."
                label="Hiển thị N lần nhưng không có lượt nhập"
                onChange={(checked) => updateSettings({ pauseOnNoValidEntry: checked })}
              />
              <AdvancedNumberField
                disabled={!settings.pauseOnNoValidEntry}
                help="Ví dụ: hiển thị 5 lần không có lượt nhập đúng thì tự dừng."
                label="Số lần hiển thị không hiệu quả"
                min={1}
                onChange={(value) => updateSettings({ noValidEntryDisplays: value })}
                suffix="lần"
                value={settings.noValidEntryDisplays}
              />
            </AdvancedSettingsCard>
          </div>

          <aside className="space-y-5">
            <section className="glass-card p-4 sm:p-5">
              <h3 className="font-semibold text-foreground">Tóm tắt rule</h3>
              <div className="mt-4 space-y-3 text-sm text-foreground">
                <SummaryItem icon={<BellRing className="size-4" />} active={settings.notifyTargetReached}>
                  Tự pause & gửi mail khi đạt target.
                </SummaryItem>
                <SummaryItem icon={<ShieldAlert className="size-4" />} active={settings.notifyCampaignPaused}>
                  Cảnh báo khi campaign dừng.
                </SummaryItem>
                <SummaryItem icon={<RotateCcw className="size-4" />} active={settings.autoReactivateNextDay}>
                  Tự bật lại campaign ngày hôm sau.
                </SummaryItem>
                <SummaryItem icon={<ShieldAlert className="size-4" />} active={settings.limitWrongPass}>
                  User nhập sai {settings.maxWrongPassAttempts || 0} lần sẽ bị chuyển.
                </SummaryItem>
                <SummaryItem icon={<TimerReset className="size-4" />} active={settings.pauseOnNoValidEntry}>
                  Hiển thị {settings.noValidEntryDisplays || 0} lần không nhập đúng thì tự dừng.
                </SummaryItem>
              </div>
            </section>
          </aside>
        </div>
        <WizardFooter
          backHref={`${wizardBase}/instructions`}
          nextHref={`${wizardBase}/review`}
          nextLabel="Xem trước"
          onNext={() => window.localStorage.setItem(campaignAdvancedSettingsStorageKey, JSON.stringify(settings))}
        />
      </AdminShell>
      <Toast message={toast} />
    </div>
  );
}

function SummaryItem({ active, children, icon }: { active: boolean; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-3 py-2 ${active ? "border-brand/20 bg-brand/10 text-brand" : "border-border bg-surface-2 text-muted-foreground"}`}>
      <span className="mt-0.5">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

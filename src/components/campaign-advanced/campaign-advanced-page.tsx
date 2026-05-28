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
        <header className="mb-5 rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl sm:p-5">
          <div className="min-w-0">
            <Link className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-white" to={`${wizardBase}/instructions`}>
              <ArrowLeft className="size-4" />
              Quay lại hướng dẫn nhiệm vụ
            </Link>
            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
              <span>Danh mục chiến dịch</span>
              <span className="text-zinc-600">&gt;</span>
              <span>Caraluna</span>
              <span className="text-zinc-600">&gt;</span>
              <span className="font-medium text-lime-100">Cài đặt nâng cao</span>
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Cài đặt nâng cao</h2>
            <p className="mt-2 text-sm text-zinc-400 sm:text-base">Thiết lập cảnh báo và tự động hóa riêng cho chiến dịch này.</p>
          </div>
        </header>

        <CampaignCreateStepper activeStep={3} />

        <div className="grid gap-5 pb-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <AdvancedSettingsCard
              description="Thông báo cho admin khi chiến dịch có dấu hiệu thiếu user hoặc bị tạm dừng."
              title="Cảnh báo admin"
            >
              <AdvancedSettingToggle
                checked={settings.notifyLowUsers}
                description="Gửi cảnh báo nếu số user còn thiếu vượt ngưỡng đã đặt."
                label="Gửi thông báo khi thiếu user nhiều"
                onChange={(checked) => updateSettings({ notifyLowUsers: checked })}
              />
              <AdvancedNumberField
                disabled={!settings.notifyLowUsers}
                help="Ví dụ: còn thiếu từ 5 user trở lên thì cảnh báo."
                label="Ngưỡng thiếu user"
                onChange={(value) => updateSettings({ lowUsersThreshold: value })}
                suffix="user"
                value={settings.lowUsersThreshold}
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
            <section className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl sm:p-5">
              <h3 className="font-semibold text-white">Tóm tắt rule</h3>
              <div className="mt-4 space-y-3 text-sm text-zinc-300">
                <SummaryItem icon={<BellRing className="size-4" />} active={settings.notifyLowUsers}>
                  Cảnh báo thiếu từ {settings.lowUsersThreshold || 0} user.
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
    <div className={`flex items-start gap-3 rounded-xl border px-3 py-2 ${active ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-100" : "border-white/10 bg-white/[0.03] text-zinc-500"}`}>
      <span className="mt-0.5">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

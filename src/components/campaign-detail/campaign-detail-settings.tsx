import { Check, X } from "lucide-react";

type SettingsShape = {
  notifyLowUsers?: boolean;
  lowUsersThreshold?: number | null;
  notifyCampaignPaused?: boolean;
  autoReactivateNextDay?: boolean;
  limitWrongPass?: boolean;
  maxWrongPassAttempts?: number | null;
  pauseOnNoValidEntry?: boolean;
  noValidEntryDisplays?: number | null;
};

type Props = { settings: object | null };

export function CampaignDetailSettings({ settings }: Props) {
  const s = (settings ?? {}) as SettingsShape;

  return (
    <section className="glass-card p-4 sm:p-5">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Cài đặt nâng cao</h3>
      <ul className="space-y-3 text-sm">
        <Toggle
          enabled={Boolean(s.notifyLowUsers)}
          label="Cảnh báo khi user/ngày thấp"
          meta={s.lowUsersThreshold ? `Ngưỡng: ${s.lowUsersThreshold}` : undefined}
        />
        <Toggle enabled={Boolean(s.notifyCampaignPaused)} label="Cảnh báo khi chiến dịch tạm dừng" />
        <Toggle enabled={Boolean(s.autoReactivateNextDay)} label="Tự kích hoạt lại ngày hôm sau" />
        <Toggle
          enabled={Boolean(s.limitWrongPass)}
          label="Giới hạn nhập sai pass"
          meta={s.maxWrongPassAttempts ? `Tối đa: ${s.maxWrongPassAttempts} lần` : undefined}
        />
        <Toggle
          enabled={Boolean(s.pauseOnNoValidEntry)}
          label="Tự tạm dừng nếu không có pass đúng"
          meta={s.noValidEntryDisplays ? `Sau: ${s.noValidEntryDisplays} lần hiển thị` : undefined}
        />
      </ul>
    </section>
  );
}

function Toggle({ enabled, label, meta }: { enabled: boolean; label: string; meta?: string }) {
  return (
    <li className="flex items-center justify-between gap-3 border-b border-border/50 pb-3 last:border-b-0 last:pb-0">
      <div className="min-w-0">
        <p className="font-medium text-foreground">{label}</p>
        {meta && <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p>}
      </div>
      <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${enabled ? "bg-brand/15 text-brand" : "bg-surface-2 text-muted-foreground"}`}>
        {enabled ? <Check className="size-4" /> : <X className="size-4" />}
      </span>
    </li>
  );
}

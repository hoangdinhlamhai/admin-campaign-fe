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
    <section className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl sm:p-5">
      <h3 className="mb-4 text-lg font-semibold text-white">Cài đặt nâng cao</h3>
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
    <li className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
      <div className="min-w-0">
        <p className="font-medium text-zinc-100">{label}</p>
        {meta && <p className="mt-0.5 text-xs text-zinc-500">{meta}</p>}
      </div>
      <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${enabled ? "bg-emerald-300/15 text-emerald-300" : "bg-zinc-700/30 text-zinc-500"}`}>
        {enabled ? <Check className="size-4" /> : <X className="size-4" />}
      </span>
    </li>
  );
}

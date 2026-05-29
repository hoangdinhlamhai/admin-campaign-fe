import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { fetchFullCampaign } from "@/lib/api/campaigns-api";
import { AssigneeCell } from "@/components/common/assignee-cell";

type FullCampaign = Awaited<ReturnType<typeof fetchFullCampaign>>;

type Props = { campaign: FullCampaign };

export function CampaignDetailInfo({ campaign }: Props) {
  return (
    <section className="glass-card p-4 sm:p-5">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Thông tin cơ bản</h3>
      <dl className="space-y-3 text-sm">
        <Row label="Mã chiến dịch" value={<span className="rounded-md bg-surface-2 px-2 py-1 font-mono text-xs font-semibold text-foreground">{campaign.code}</span>} />
        <Row label="Mục tiêu/ngày" value={<span className="font-mono font-semibold text-brand">{campaign.dailyUserTarget} user</span>} />
        <Row label="Keyword" value={campaign.keyword || <span className="text-muted-foreground/60">—</span>} />
        <Row label="URL đích" value={campaign.targetUrl ? <a className="text-brand underline underline-offset-2 hover:brightness-110" href={campaign.targetUrl} rel="noreferrer" target="_blank">{campaign.targetUrl}</a> : <span className="text-muted-foreground/60">—</span>} />
        <Row label="Mật khẩu" value={<PassValue value={campaign.passCode} />} />
        <Row label="Nhập sai tối đa" value={<span className="font-mono">{campaign.maxWrongAttempts ?? "—"}</span>} />
        <Row label="Ngày tạo" value={<span className="text-foreground">{formatDate(campaign.createdAt)}</span>} />
        {campaign.publishedAt && <Row label="Ngày xuất bản" value={<span className="text-foreground">{formatDate(campaign.publishedAt)}</span>} />}
        <Row label="Người phụ trách" value={<AssigneeCell assignedTo={campaign.assignedTo} assignedToName={campaign.assignedToName} />} />
      </dl>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3 last:border-b-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}

function PassValue({ value }: { value: string | null }) {
  const [copied, setCopied] = useState(false);
  if (!value) return <span className="text-muted-foreground/60">—</span>;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="inline-flex items-center gap-2">
      <span className="rounded-md bg-surface-2 px-2 py-1 font-mono text-xs font-semibold">{value}</span>
      <button
        aria-label="Sao chép"
        className="grid size-7 place-items-center rounded-lg text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"
        onClick={handleCopy}
        type="button"
      >
        {copied ? <Check className="size-3.5 text-brand" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("vi-VN");
}

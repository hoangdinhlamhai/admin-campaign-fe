import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { fetchFullCampaign } from "@/lib/api/campaigns-api";

type FullCampaign = Awaited<ReturnType<typeof fetchFullCampaign>>;

type Props = { campaign: FullCampaign };

export function CampaignDetailInfo({ campaign }: Props) {
  return (
    <section className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl sm:p-5">
      <h3 className="mb-4 text-lg font-semibold text-white">Thông tin cơ bản</h3>
      <dl className="space-y-3 text-sm">
        <Row label="Mã chiến dịch" value={<span className="rounded-md bg-zinc-800 px-2 py-1 font-mono text-xs font-semibold text-zinc-200">{campaign.code}</span>} />
        <Row label="Mục tiêu/ngày" value={<span className="font-mono font-semibold text-emerald-300">{campaign.dailyUserTarget} user</span>} />
        <Row label="Keyword" value={campaign.keyword || <span className="text-zinc-600">—</span>} />
        <Row label="URL đích" value={campaign.targetUrl ? <a className="text-emerald-300 underline underline-offset-2 hover:text-emerald-200" href={campaign.targetUrl} rel="noreferrer" target="_blank">{campaign.targetUrl}</a> : <span className="text-zinc-600">—</span>} />
        <Row label="Mật khẩu" value={<PassValue value={campaign.passCode} />} />
        <Row label="Nhập sai tối đa" value={<span className="font-mono">{campaign.maxWrongAttempts ?? "—"}</span>} />
        <Row label="Ngày tạo" value={<span className="text-zinc-300">{formatDate(campaign.createdAt)}</span>} />
        {campaign.publishedAt && <Row label="Ngày xuất bản" value={<span className="text-zinc-300">{formatDate(campaign.publishedAt)}</span>} />}
      </dl>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
      <dt className="text-zinc-400">{label}</dt>
      <dd className="text-right font-medium text-zinc-100">{value}</dd>
    </div>
  );
}

function PassValue({ value }: { value: string | null }) {
  const [copied, setCopied] = useState(false);
  if (!value) return <span className="text-zinc-600">—</span>;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="inline-flex items-center gap-2">
      <span className="rounded-md bg-zinc-800 px-2 py-1 font-mono text-xs font-semibold">{value}</span>
      <button
        aria-label="Sao chép"
        className="grid size-7 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
        onClick={handleCopy}
        type="button"
      >
        {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
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

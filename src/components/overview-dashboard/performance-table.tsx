import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, MoreHorizontal, Search } from "lucide-react";
import { performanceCampaigns, type PerformanceCampaign } from "@/lib/overview-dashboard-data";

const sourceClass: Record<PerformanceCampaign["source"], string> = {
  "Google Ads": "bg-sky-400/14 text-sky-200 ring-sky-300/20",
  "TikTok Ads": "bg-zinc-100 text-zinc-950 ring-white/20",
};

const statusLabel: Record<PerformanceCampaign["status"], string> = {
  off: "Đã tắt",
  paused: "Tạm dừng",
  running: "Đang chạy",
};

const statusClass: Record<PerformanceCampaign["status"], string> = {
  off: "bg-rose-400/12 text-rose-200",
  paused: "bg-amber-400/12 text-amber-200",
  running: "bg-emerald-400/12 text-emerald-200",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

export function PerformanceTable() {
  const [query, setQuery] = useState("");
  const [quiz, setQuiz] = useState("all");
  const [source, setSource] = useState("all");

  const quizOptions = useMemo(() => Array.from(new Set(performanceCampaigns.map((campaign) => campaign.quiz))), []);
  const sourceOptions = useMemo(() => Array.from(new Set(performanceCampaigns.map((campaign) => campaign.source))), []);

  const filteredCampaigns = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi-VN");

    return performanceCampaigns.filter((campaign) => {
      const matchesQuery =
        !normalizedQuery ||
        campaign.name.toLocaleLowerCase("vi-VN").includes(normalizedQuery) ||
        campaign.code.toLocaleLowerCase("vi-VN").includes(normalizedQuery);
      const matchesQuiz = quiz === "all" || campaign.quiz === quiz;
      const matchesSource = source === "all" || campaign.source === source;

      return matchesQuery && matchesQuiz && matchesSource;
    });
  }, [query, quiz, source]);

  return (
    <section className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl">
      <div className="flex flex-col gap-4 border-b border-white/10 p-4 lg:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Hiệu suất chiến dịch</h3>
            <p className="mt-1 text-sm text-zinc-400">So sánh chi phí, lượt click và tỷ lệ chuyển đổi theo từng campaign.</p>
          </div>
          <div className="grid gap-2 md:grid-cols-[minmax(16rem,1fr)_auto_auto_auto]">
            <label className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <span className="sr-only">Tìm kiếm chiến dịch</span>
              <input
                className="h-11 w-full rounded-xl border border-white/10 bg-zinc-950/55 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/60"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm kiếm chiến dịch..."
                value={query}
              />
            </label>
            <select className="h-11 rounded-xl border border-white/10 bg-zinc-950/85 px-3 text-sm text-white outline-none transition focus:border-emerald-300/60" onChange={(event) => setQuiz(event.target.value)} value={quiz}>
              <option value="all">Tất cả quiz</option>
              {quizOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <select className="h-11 rounded-xl border border-white/10 bg-zinc-950/85 px-3 text-sm text-white outline-none transition focus:border-emerald-300/60" onChange={(event) => setSource(event.target.value)} value={source}>
              <option value="all">Tất cả nguồn</option>
              {sourceOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.11]" type="button">
              <Download className="size-4" />
              Xuất Excel
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1160px] border-separate border-spacing-0 text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.08em] text-zinc-500">
            <tr>
              <HeaderCell className="w-72">Chiến dịch</HeaderCell>
              <HeaderCell className="w-36">Nguồn</HeaderCell>
              <HeaderCell className="w-32">Quiz</HeaderCell>
              <HeaderCell className="w-28 text-right">Chi phí (đ)</HeaderCell>
              <HeaderCell className="w-28 text-right">Lượt click</HeaderCell>
              <HeaderCell className="w-32 text-right">Hoàn thành quiz</HeaderCell>
              <HeaderCell className="w-40 text-right">Hoàn thành nhiệm vụ</HeaderCell>
              <HeaderCell className="w-24 text-right">CPA (đ)</HeaderCell>
              <HeaderCell className="w-28 text-right">Tỷ lệ chuyển đổi</HeaderCell>
              <HeaderCell className="w-28">Trạng thái</HeaderCell>
              <HeaderCell className="w-20 text-right">Thao tác</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.map((campaign) => (
              <tr className="text-zinc-200 transition hover:bg-white/[0.055]" key={campaign.id}>
                <BodyCell>
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-400/14 text-xs font-bold text-indigo-100 ring-1 ring-indigo-300/20">
                      {campaign.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{campaign.name}</p>
                      <p className="mt-1 text-xs text-zinc-500">ID: {campaign.code}</p>
                    </div>
                  </div>
                </BodyCell>
                <BodyCell>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${sourceClass[campaign.source]}`}>
                    {campaign.source}
                  </span>
                </BodyCell>
                <BodyCell>{campaign.quiz}</BodyCell>
                <BodyCell className="text-right font-mono text-emerald-200">{formatCurrency(campaign.cost)}</BodyCell>
                <BodyCell className="text-right font-mono">{formatCurrency(campaign.clicks)}</BodyCell>
                <BodyCell className="text-right font-mono">{formatCurrency(campaign.quizCompleted)}</BodyCell>
                <BodyCell className="text-right font-mono">{formatCurrency(campaign.tasksCompleted)}</BodyCell>
                <BodyCell className="text-right font-mono">{formatCurrency(campaign.cpa)}</BodyCell>
                <BodyCell className="text-right font-mono font-semibold">{campaign.conversionRate.toFixed(2)}%</BodyCell>
                <BodyCell>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusClass[campaign.status]}`}>
                    {statusLabel[campaign.status]}
                  </span>
                </BodyCell>
                <BodyCell>
                  <button className="ml-auto grid size-8 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/[0.08] hover:text-white" type="button">
                    <MoreHorizontal className="size-4" />
                  </button>
                </BodyCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 p-4 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
        <span>Hiển thị 1 - {filteredCampaigns.length} của 12 chiến dịch</span>
        <div className="flex items-center gap-2">
          <button aria-label="Trang trước" className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-300 transition hover:bg-white/[0.1]" type="button">
            <ChevronLeft className="size-4" />
          </button>
          <span className="rounded-lg bg-emerald-300 px-3 py-1.5 font-bold text-zinc-950">1</span>
          <span className="rounded-lg border border-white/10 px-3 py-1.5 font-bold text-zinc-300">2</span>
          <span className="rounded-lg border border-white/10 px-3 py-1.5 font-bold text-zinc-300">3</span>
          <button aria-label="Trang sau" className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-300 transition hover:bg-white/[0.1]" type="button">
            <ChevronRight className="size-4" />
          </button>
          <select className="h-9 rounded-lg border border-white/10 bg-zinc-950/85 px-2 text-white">
            <option>5/trang</option>
          </select>
        </div>
      </div>
    </section>
  );
}

function HeaderCell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`border-b border-white/10 px-4 py-3 font-semibold ${className}`}>{children}</th>;
}

function BodyCell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`border-b border-white/5 px-4 py-4 align-middle ${className}`}>{children}</td>;
}

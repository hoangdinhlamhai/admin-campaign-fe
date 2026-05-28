import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AdminShell } from "@/components/campaign-ops/admin-shell";
import { type DateRangeValue } from "@/components/common/date-range-picker";
import { dateToISO } from "@/lib/format-date";
import { formatNumber } from "@/lib/format-currency";
import { fetchParentDetail, type ParentDetailDto } from "@/lib/api/parent-categories-api";
import { ParentDetailInfo } from "@/components/campaign-categories/parent-detail-info";
import { ParentChildrenSection } from "@/components/campaign-categories/parent-children-section";
import {
  FolderTree,
  Megaphone,
  Target,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

export default function ParentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const today = new Date();
  const [range, setRange] = useState<DateRangeValue>({ from: today, to: today });
  const [parent, setParent] = useState<ParentDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchParentDetail(id, dateToISO(range.from), dateToISO(range.to));
      setParent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [id, range]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  const cards = parent
    ? [
        { label: "Tổng DM con", value: parent.childCount, Icon: FolderTree, tone: "text-lime-200" },
        { label: "Tổng chiến dịch", value: parent.campaignCount, Icon: Megaphone, tone: "text-sky-200" },
        { label: "User cần chạy", value: parent.rangeStats.target, Icon: Target, tone: "text-lime-200" },
        { label: "Đã hoàn thành", value: parent.rangeStats.completed, Icon: ShieldCheck, tone: "text-emerald-200" },
        { label: "Còn thiếu", value: parent.rangeStats.missing, Icon: AlertTriangle, tone: "text-amber-200" },
      ]
    : [];

  return (
    <AdminShell activeLabel="Danh mục">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="text-sm text-zinc-400">Đang tải...</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20">
          <span className="text-sm text-rose-400">{error}</span>
        </div>
      ) : parent ? (
        <>
          <ParentDetailInfo parent={parent} range={range} onRangeChange={setRange} />

          {/* Stats cards */}
          <section className="mb-5" aria-label="Chỉ số danh mục cha">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
              {cards.map(({ label, value, Icon, tone }) => (
                <article
                  key={label}
                  className="group rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-xl shadow-zinc-950/20 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.085]"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-zinc-400">{label}</p>
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/[0.08] text-lime-100 transition group-hover:bg-emerald-300/18">
                      <Icon className="size-4" />
                    </span>
                  </div>
                  <div className="flex items-end justify-between gap-3">
                    <span className="font-mono text-4xl font-semibold tracking-tight text-white">
                      {formatNumber(value)}
                    </span>
                    <span className={`rounded-full bg-white/[0.07] px-2.5 py-1 text-sm font-semibold ${tone}`}>
                      &mdash;
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <ParentChildrenSection children={parent.children} />
        </>
      ) : null}
    </AdminShell>
  );
}

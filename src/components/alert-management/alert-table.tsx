import { type ReactNode } from "react";
import { ChevronLeft, ChevronRight, CheckCheck, ShieldCheck } from "lucide-react";
import { type Alert, severityConfig, alertStatusLabels, alertTypeLabels } from "@/lib/alert-management-data";
import type { AlertsFilters, AlertSeverityApi, AlertStatusApi, AlertTypeApi } from "@/lib/api/alerts-api";
import { formatRelativeTime } from "./alert-time-utils";

type AlertTableProps = {
  alerts: Alert[];
  filters: AlertsFilters;
  loading: boolean;
  total: number;
  onFiltersChange: (next: AlertsFilters) => void;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  onRowClick: (id: string) => void;
};

type DatePreset = "" | "today" | "7d" | "30d";

function presetToRange(preset: DatePreset): { from?: string; to?: string } {
  if (!preset) return { from: undefined, to: undefined };
  const today = new Date();
  const to = today.toISOString().slice(0, 10);
  if (preset === "today") return { from: to, to };
  const days = preset === "7d" ? 6 : 29;
  const fromDate = new Date(today);
  fromDate.setDate(fromDate.getDate() - days);
  return { from: fromDate.toISOString().slice(0, 10), to };
}

function rangeToPreset(filters: AlertsFilters): DatePreset {
  if (!filters.from && !filters.to) return "";
  if (filters.from === filters.to) return "today";
  // best-effort: only restore exact 7d/30d if from matches the formula
  const today = new Date().toISOString().slice(0, 10);
  if (filters.to === today) {
    const diff = Math.round((Date.parse(today) - Date.parse(filters.from ?? today)) / 86_400_000);
    if (diff === 6) return "7d";
    if (diff === 29) return "30d";
  }
  return "";
}

export function AlertTable({
  alerts,
  filters,
  loading,
  total,
  onFiltersChange,
  onAcknowledge,
  onResolve,
  onRowClick,
}: AlertTableProps) {
  const pageSize = filters.pageSize ?? 10;
  const page = filters.page ?? 1;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);

  const update = (patch: Partial<AlertsFilters>, resetPage = true) => {
    onFiltersChange({ ...filters, ...patch, page: resetPage ? 1 : (patch.page ?? filters.page) });
  };

  return (
    <section className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 border-b border-white/10 p-4 sm:p-5">
        <Filter
          id="severity-filter"
          label="Mức độ"
          onChange={(v) => update({ severity: (v as AlertSeverityApi) || "" })}
          value={filters.severity ?? ""}
        >
          <option value="">Tất cả</option>
          <option value="danger">Nguy hiểm</option>
          <option value="warning">Cảnh báo</option>
          <option value="info">Thông tin</option>
        </Filter>

        <Filter
          id="status-filter"
          label="Trạng thái"
          onChange={(v) => update({ status: (v as AlertStatusApi) || "" })}
          value={filters.status ?? ""}
        >
          <option value="">Tất cả</option>
          <option value="open">Đang mở</option>
          <option value="acknowledged">Đã xác nhận</option>
          <option value="resolved">Đã xử lý</option>
        </Filter>

        <Filter
          id="type-filter"
          label="Loại"
          onChange={(v) => update({ type: (v as AlertTypeApi) || "" })}
          value={filters.type ?? ""}
        >
          <option value="">Tất cả</option>
          <option value="low_users">{alertTypeLabels.low_users}</option>
          <option value="no_valid_entry">{alertTypeLabels.no_valid_entry}</option>
          <option value="wrong_pass_exceeded">{alertTypeLabels.wrong_pass_exceeded}</option>
          <option value="campaign_paused">{alertTypeLabels.campaign_paused}</option>
        </Filter>

        <Filter
          id="date-filter"
          label="Thời gian"
          onChange={(v) => update(presetToRange(v as DatePreset))}
          value={rangeToPreset(filters)}
        >
          <option value="">Tất cả</option>
          <option value="today">Hôm nay</option>
          <option value="7d">7 ngày</option>
          <option value="30d">30 ngày</option>
        </Filter>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.12em] text-zinc-500">
              <HeaderCell className="w-10">Mức</HeaderCell>
              <HeaderCell>Tiêu đề</HeaderCell>
              <HeaderCell className="w-40">Chiến dịch</HeaderCell>
              <HeaderCell className="w-32">Thời gian</HeaderCell>
              <HeaderCell className="w-32">Trạng thái</HeaderCell>
              <HeaderCell className="w-36 text-right">Thao tác</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-10 text-center text-zinc-400" colSpan={6}>
                  Đang tải cảnh báo...
                </td>
              </tr>
            ) : alerts.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-zinc-400" colSpan={6}>
                  Không có cảnh báo nào phù hợp.
                </td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <AlertRow
                  alert={alert}
                  key={alert.id}
                  onAcknowledge={() => onAcknowledge(alert.id)}
                  onResolve={() => onResolve(alert.id)}
                  onRowClick={() => onRowClick(alert.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 border-t border-white/10 p-4 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <span>
          Hiển thị {total === 0 ? 0 : (safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, total)} của {total} cảnh báo
        </span>
        <div className="flex items-center gap-2">
          <button
            aria-label="Trang trước"
            className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-300 transition hover:bg-white/[0.1] disabled:opacity-40"
            disabled={safePage <= 1}
            onClick={() => update({ page: safePage - 1 }, false)}
            type="button"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="rounded-lg bg-emerald-300 px-3 py-1.5 font-bold text-zinc-950">{safePage}</span>
          <button
            aria-label="Trang sau"
            className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-300 transition hover:bg-white/[0.1] disabled:opacity-40"
            disabled={safePage >= totalPages}
            onClick={() => update({ page: safePage + 1 }, false)}
            type="button"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function Filter({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-zinc-400" htmlFor={id}>{label}:</label>
      <select
        className="h-9 rounded-xl border border-white/10 bg-zinc-950/85 px-3 text-sm text-white outline-none focus:border-emerald-300/60"
        id={id}
        onChange={(e) => onChange(e.target.value)}
        value={value}
      >
        {children}
      </select>
    </div>
  );
}

function AlertRow({
  alert,
  onRowClick,
  onAcknowledge,
  onResolve,
}: {
  alert: Alert;
  onRowClick: () => void;
  onAcknowledge: () => void;
  onResolve: () => void;
}) {
  const cfg = severityConfig[alert.severity];
  const Icon = cfg.icon;
  const isOpen = alert.status === "open";
  const canResolve = alert.status === "open" || alert.status === "acknowledged";

  return (
    <tr
      className="cursor-pointer border-b border-white/[0.06] text-zinc-200 transition hover:bg-white/[0.035]"
      onClick={onRowClick}
    >
      <td className="px-4 py-4 align-middle">
        <span className={`inline-flex rounded-lg p-1.5 ${cfg.bgColor}`}>
          <Icon className={`size-4 ${cfg.color}`} />
        </span>
      </td>
      <td className="px-4 py-4 align-middle">
        <span className={isOpen ? "font-bold text-white" : "font-medium text-zinc-300"}>
          {alert.title}
        </span>
        <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">{alert.message}</p>
      </td>
      <td className="px-4 py-4 align-middle text-zinc-400">
        {alert.campaignId ?? <span className="text-zinc-600">—</span>}
      </td>
      <td className="px-4 py-4 align-middle text-xs text-zinc-500">
        {formatRelativeTime(alert.triggeredAt)}
      </td>
      <td className="px-4 py-4 align-middle">
        <StatusBadge status={alert.status} />
      </td>
      <td className="px-4 py-4 align-middle" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end gap-1">
          {isOpen && (
            <button
              aria-label="Xác nhận"
              className="grid size-8 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/[0.08] hover:text-amber-300"
              onClick={onAcknowledge}
              title="Xác nhận"
              type="button"
            >
              <CheckCheck className="size-4" />
            </button>
          )}
          {canResolve && (
            <button
              aria-label="Đã xử lý"
              className="grid size-8 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/[0.08] hover:text-emerald-300"
              onClick={onResolve}
              title="Đã xử lý"
              type="button"
            >
              <ShieldCheck className="size-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: Alert["status"] }) {
  const styles: Record<Alert["status"], string> = {
    open: "bg-rose-500/15 text-rose-400 border-rose-500/20",
    acknowledged: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    resolved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}>
      {alertStatusLabels[status]}
    </span>
  );
}

function HeaderCell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <th className={`px-4 py-3 font-semibold ${className}`}>{children}</th>;
}

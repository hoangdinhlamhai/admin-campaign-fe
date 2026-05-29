import {
  DateRangePicker,
  type DateRangeValue,
} from "@/components/common/date-range-picker";

type Props = {
  value: DateRangeValue;
  onChange: (range: DateRangeValue) => void;
};

export function OverviewHeader({ value, onChange }: Props) {
  return (
    <header className="mb-5 flex flex-col gap-4 rounded-[1.1rem] border border-border bg-surface p-4 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl sm:p-5 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-lime-100">Tổng quan</span>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Dashboard tổng</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">Theo dõi hiệu suất quảng cáo, quiz và nhiệm vụ trong toàn hệ thống.</p>
      </div>

      <DateRangePicker value={value} onChange={onChange} />
    </header>
  );
}

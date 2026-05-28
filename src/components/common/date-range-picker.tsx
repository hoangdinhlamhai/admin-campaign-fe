import { useEffect, useRef, useState } from "react"
import { DayPicker, type DateRange } from "react-day-picker"
import { vi } from "date-fns/locale"
import {
  format,
  startOfMonth,
  subDays,
  differenceInCalendarDays,
  isSameDay,
} from "date-fns"
import { Calendar, X } from "lucide-react"
import "react-day-picker/src/style.css"
import "@/styles/date-picker.css"

export type DateRangeValue = { from: Date; to: Date }

type DateRangePickerProps = {
  value: DateRangeValue
  onChange: (range: DateRangeValue) => void
  maxRangeDays?: number
  disabled?: boolean
}

const PRESETS = [
  { label: "Hôm nay", get: (today: Date) => ({ from: today, to: today }) },
  {
    label: "7 ngày qua",
    get: (today: Date) => ({ from: subDays(today, 6), to: today }),
  },
  {
    label: "30 ngày qua",
    get: (today: Date) => ({ from: subDays(today, 29), to: today }),
  },
  {
    label: "Tháng này",
    get: (today: Date) => ({ from: startOfMonth(today), to: today }),
  },
] as const

export function DateRangePicker({
  value,
  onChange,
  maxRangeDays = 90,
  disabled = false,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const [warning, setWarning] = useState<string | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Click outside to close
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
        setWarning(null)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  // Esc to close
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false)
        setWarning(null)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  function applyRange(from: Date, to: Date) {
    const days = differenceInCalendarDays(to, from) + 1
    if (days > maxRangeDays) {
      setWarning(`Tối đa ${maxRangeDays} ngày`)
      return
    }
    setWarning(null)
    onChange({ from, to })
    setOpen(false)
  }

  function handleSelect(selected: DateRange | undefined) {
    if (!selected?.from) return
    if (selected.from && !selected.to) {
      // First click — single day selected
      setWarning(null)
      return
    }
    if (selected.from && selected.to) {
      applyRange(selected.from, selected.to)
    }
  }

  const today = new Date()
  const isSingle = isSameDay(value.from, value.to)
  const display = isSingle
    ? format(value.from, "dd/MM/yyyy")
    : `${format(value.from, "dd/MM/yyyy")} → ${format(value.to, "dd/MM/yyyy")}`

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-label="Chọn khoảng thời gian"
        aria-expanded={open}
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/55 px-4 text-sm font-semibold text-white transition hover:border-emerald-300/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Calendar className="size-4 text-zinc-400" />
        <span>{display}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Bộ chọn khoảng ngày"
          className="absolute right-0 z-50 mt-2 flex rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/40"
        >
          {/* Presets sidebar */}
          <div className="flex flex-col gap-1 border-r border-white/10 p-3">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  const { from, to } = p.get(today)
                  applyRange(from, to)
                }}
                className="rounded-lg px-3 py-2 text-left text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Calendar */}
          <div className="p-3">
            <DayPicker
              className="rdp-dark"
              mode="range"
              numberOfMonths={2}
              locale={vi}
              selected={{ from: value.from, to: value.to }}
              onSelect={handleSelect}
              disabled={[{ after: today }]}
            />
            {warning && (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-rose-500/15 px-3 py-2 text-xs text-rose-400">
                <X className="size-3 shrink-0" />
                <span>{warning}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

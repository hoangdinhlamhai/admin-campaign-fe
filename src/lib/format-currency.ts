const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 0,
})

/**
 * Format a number as Vietnamese Dong (VND).
 * Example: 1500000 → "1.500.000 ₫"
 */
export function formatVND(amount: number): string {
  return vndFormatter.format(amount)
}

/**
 * Format a number with Vietnamese locale grouping.
 * Example: 1500000 → "1.500.000"
 */
export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

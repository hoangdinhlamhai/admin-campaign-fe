/**
 * Converts a Date to YYYY-MM-DD string using LOCAL date parts.
 * This is intentional: the picker selects local dates and the BE expects
 * YYYY-MM-DD interpreted as VN local time.
 *
 * DO NOT use Date.toISOString() — it converts to UTC which shifts the date
 * for VN timezone (UTC+7).
 */
export function dateToISO(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

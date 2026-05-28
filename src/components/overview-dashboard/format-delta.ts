export type DeltaTone = "up" | "down" | "flat";

export type DeltaResult = {
  text: string;
  tone: DeltaTone;
};

/**
 * Calculate percentage delta between current and previous period values.
 * Returns formatted text like "+12.5% so với kỳ trước" and a tone for styling.
 */
export function formatDelta(curr: number, prev: number): DeltaResult {
  if (prev === 0) {
    return { text: "— so với kỳ trước", tone: "flat" };
  }

  const pct = ((curr - prev) / prev) * 100;
  const sign = pct > 0 ? "+" : "";

  return {
    text: `${sign}${pct.toFixed(1)}% so với kỳ trước`,
    tone: pct > 0.05 ? "up" : pct < -0.05 ? "down" : "flat",
  };
}

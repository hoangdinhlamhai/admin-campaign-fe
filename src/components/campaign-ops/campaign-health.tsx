import { RadialBar, RadialBarChart } from "recharts";
import type { Campaign } from "@/lib/campaign-ops-data";

function calculateHealth(campaigns: Campaign[]) {
  const active = campaigns.filter(
    (c) => c.status === "active" && c.dailyUserTarget > 0,
  );
  if (active.length === 0)
    return { score: 0, buckets: { good: 0, medium: 0, weak: 0 } };

  const ratios = active.map((c) =>
    Math.min(c.completedCount / c.dailyUserTarget, 1),
  );
  const score = Math.round(
    (ratios.reduce((a, b) => a + b, 0) / ratios.length) * 100,
  );
  const buckets = ratios.reduce(
    (acc, r) => {
      if (r >= 0.8) acc.good++;
      else if (r >= 0.5) acc.medium++;
      else acc.weak++;
      return acc;
    },
    { good: 0, medium: 0, weak: 0 },
  );
  return { score, buckets };
}

function getRating(score: number) {
  if (score >= 80) return { label: "Tốt", color: "text-emerald-200" };
  if (score >= 50) return { label: "Trung bình", color: "text-amber-200" };
  return { label: "Yếu", color: "text-rose-200" };
}

function getGaugeFill(score: number) {
  if (score >= 80) return "hsl(141 74% 56%)";
  if (score >= 50) return "hsl(45 93% 58%)";
  return "hsl(0 84% 60%)";
}

export function CampaignHealth({ campaigns }: { campaigns: Campaign[] }) {
  const { score, buckets } = calculateHealth(campaigns);
  const active = campaigns.filter(
    (c) => c.status === "active" && c.dailyUserTarget > 0,
  );
  const rating = getRating(score);

  const legend = [
    {
      label: "Tốt (80-100)",
      value: `${buckets.good} chiến dịch`,
      color: "bg-emerald-400",
    },
    {
      label: "Trung bình (50-79)",
      value: `${buckets.medium} chiến dịch`,
      color: "bg-amber-400",
    },
    {
      label: "Yếu (<50)",
      value: `${buckets.weak} chiến dịch`,
      color: "bg-rose-400",
    },
  ];

  return (
    <article className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-5 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-white">Sức khỏe chiến dịch</h3>
        <p className="mt-1 text-sm text-zinc-400">% tiến độ trung bình</p>
      </div>
      {active.length === 0 ? (
        <div className="flex h-52 items-center justify-center">
          <p className="text-sm text-zinc-500">Chưa có chiến dịch hoạt động</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-[13rem_1fr] xl:grid-cols-1 2xl:grid-cols-[13rem_1fr]">
          <div className="relative h-52">
            <RadialBarChart
              barSize={16}
              className="mx-auto"
              cx="50%"
              cy="54%"
              data={[{ name: "health", value: score, fill: getGaugeFill(score) }]}
              endAngle={-210}
              height={208}
              innerRadius="72%"
              outerRadius="96%"
              startAngle={30}
              width={208}
            >
              <RadialBar background={{ fill: "rgba(161,161,170,0.16)" }} cornerRadius={999} dataKey="value" />
            </RadialBarChart>
            <div className="absolute inset-0 grid place-items-center pt-5 text-center">
              <div>
                <p className="font-mono text-5xl font-semibold text-white">{score}</p>
                <p className={`mt-1 text-sm font-semibold ${rating.color}`}>
                  Điểm sức khỏe: {rating.label}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-3">
            {legend.map((item) => (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-zinc-950/34 px-3 py-2" key={item.label}>
                <div className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-full ${item.color}`} />
                  <span className="text-sm text-zinc-300">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

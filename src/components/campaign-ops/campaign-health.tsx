import { RadialBar, RadialBarChart } from "recharts";
import { healthLegend } from "@/lib/campaign-ops-data";

const gaugeData = [{ name: "health", value: 78, fill: "hsl(141 74% 56%)" }];

export function CampaignHealth() {
  return (
    <article className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-5 shadow-2xl shadow-zinc-950/25 backdrop-blur-2xl">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-white">Sức khỏe chiến dịch</h3>
        <p className="mt-1 text-sm text-zinc-400">Điểm tổng hợp từ tiến độ và tỷ lệ nhập sai</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-[13rem_1fr] xl:grid-cols-1 2xl:grid-cols-[13rem_1fr]">
        <div className="relative h-52">
          <RadialBarChart
            barSize={16}
            className="mx-auto"
            cx="50%"
            cy="54%"
            data={gaugeData}
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
              <p className="font-mono text-5xl font-semibold text-white">78</p>
              <p className="mt-1 text-sm font-semibold text-emerald-200">Điểm sức khỏe: Tốt</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-3">
          {healthLegend.map((item) => (
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
    </article>
  );
}

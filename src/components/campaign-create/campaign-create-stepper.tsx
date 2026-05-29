import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { campaignCreateSteps, getCampaignWizardBase } from "@/lib/campaign-create-data";

type CampaignCreateStepperProps = {
  activeStep?: number;
};

const stepSuffix: Record<number, string> = {
  1: "",
  2: "/instructions",
  3: "/advanced",
  4: "/review",
};

export function CampaignCreateStepper({ activeStep = 1 }: CampaignCreateStepperProps) {
  const base = getCampaignWizardBase();

  return (
    <section className="mb-5 grid gap-3 rounded-[1.1rem] border border-border bg-surface p-4 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl lg:grid-cols-4">
      {campaignCreateSteps.map((step, index) => {
        const active = step.id === activeStep;
        const href = `${base}${stepSuffix[step.id]}`;
        const content = (
          <>
            <div className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold ${active ? "bg-[hsl(var(--brand))] text-zinc-950" : "bg-indigo-400/16 text-indigo-100"}`}>
              {step.id}
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>{step.title}</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">{step.description}</p>
            </div>
          </>
        );

        return (
          <div className="flex items-center gap-3" key={step.id}>
            <Link className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-1 transition hover:bg-white/[0.05]" to={href}>
              {content}
            </Link>
            {index < campaignCreateSteps.length - 1 ? <ChevronRight className="ml-auto hidden size-4 text-muted-foreground lg:block" /> : null}
          </div>
        );
      })}
    </section>
  );
}

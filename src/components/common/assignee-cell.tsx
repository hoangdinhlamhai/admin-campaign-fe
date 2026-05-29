import { computeInitials } from "@/lib/initials";

type AssigneeCellProps = {
  assignedTo: string | null;
  assignedToName: string | null;
};

export function AssigneeCell({ assignedTo, assignedToName }: AssigneeCellProps) {
  if (!assignedTo) {
    return (
      <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
        Chưa phân công
      </span>
    );
  }

  const initials = computeInitials(assignedToName ?? "?");

  return (
    <div className="flex items-center gap-2">
      <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-indigo-400/15 text-[11px] font-bold text-indigo-200">
        {initials}
      </div>
      <span className="truncate text-sm text-foreground">{assignedToName ?? "—"}</span>
    </div>
  );
}

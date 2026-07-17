import { cn } from "@/lib/utils";

type Accent = "primary" | "warning" | "success" | "muted";

const ACCENT: Record<Accent, string> = {
  primary: "bg-primary/10 text-primary",
  warning: "bg-warning/10 text-warning",
  success: "bg-success/10 text-success",
  muted: "bg-muted text-muted-foreground",
};

export function DashboardCard({
  label,
  value,
  icon: Icon,
  accent = "primary",
  hint,
  className,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  accent?: Accent;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl bg-card p-5 ring-1 ring-foreground/10", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-lg",
            ACCENT[accent],
          )}
        >
          <Icon className="size-5" />
        </span>
      </div>
      <div className="mt-3 font-heading text-3xl font-semibold tracking-tight tabular-nums">
        {value}
      </div>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

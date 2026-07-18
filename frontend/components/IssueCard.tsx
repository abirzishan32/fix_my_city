import { Clock, MapPin } from "lucide-react";
import { CategoryIcon } from "@/components/category-icon";
import { SeverityBadge, StatusBadge } from "@/components/issue-badges";
import { CATEGORY_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Issue } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function locationLabel(issue: Issue) {
  if (issue.address) return issue.address;
  if (issue.latitude != null && issue.longitude != null) {
    return `${issue.latitude.toFixed(4)}, ${issue.longitude.toFixed(4)}`;
  }
  return "No location";
}

export function IssueCard({
  issue,
  onClick,
}: {
  issue: Issue;
  onClick?: () => void;
}) {
  const clickable = Boolean(onClick);
  return (
    <article
      onClick={onClick}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-shadow duration-200 hover:shadow-md",
        clickable &&
          "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {issue.imageUrl ? (
          // User-uploaded image from Supabase Storage — plain <img> avoids next/image remote config.
          <img
            src={issue.imageUrl}
            alt={issue.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground/50">
            <CategoryIcon category={issue.category} className="size-10" />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <StatusBadge status={issue.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <CategoryIcon category={issue.category} className="size-3.5" />
          <span>{CATEGORY_LABELS[issue.category]}</span>
          <span className="text-border">•</span>
          <SeverityBadge severity={issue.severity} />
        </div>

        <h3 className="font-heading text-base font-semibold leading-snug line-clamp-1">
          {issue.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {issue.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1 text-xs text-muted-foreground">
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{locationLabel(issue)}</span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5">
            <Clock className="size-3.5" />
            {formatDate(issue.createdAt)}
          </span>
        </div>
      </div>
    </article>
  );
}

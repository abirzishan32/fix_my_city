"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FilePlus, Inbox } from "lucide-react";
import { issueService } from "@/services/issueService";
import { apiErrorMessage } from "@/lib/api";
import { STATUSES, type Issue, type IssueStatus } from "@/types";
import { STATUS_LABELS } from "@/lib/constants";
import { PageHeader } from "@/components/page-header";
import { IssueCard } from "@/components/IssueCard";
import { EmptyState } from "@/components/empty-state";
import { ErrorBanner } from "@/components/form-field";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Filter = "ALL" | IssueStatus;

export default function MyIssuesPage() {
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("ALL");

  useEffect(() => {
    let active = true;
    issueService
      .myIssues()
      .then((data) => {
        if (active) setIssues(data);
      })
      .catch((err) => {
        if (active) setError(apiErrorMessage(err));
      });
    return () => {
      active = false;
    };
  }, []);

  const loading = issues === null && !error;
  const filtered = useMemo(() => {
    if (!issues) return [];
    return filter === "ALL" ? issues : issues.filter((i) => i.status === filter);
  }, [issues, filter]);

  const filters: Filter[] = ["ALL", ...STATUSES];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My issues"
        description="Every report you've submitted, with its current status."
        actions={
          <Link href="/citizen/report" className={cn(buttonVariants())}>
            <FilePlus className="size-4" />
            Report issue
          </Link>
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      {!loading && issues && issues.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = filter === f;
            const count =
              f === "ALL"
                ? issues.length
                : issues.filter((i) => i.status === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition-colors",
                  active
                    ? "bg-primary text-primary-foreground ring-primary"
                    : "bg-card text-muted-foreground ring-border hover:text-foreground",
                )}
              >
                {f === "ALL" ? "All" : STATUS_LABELS[f]}
                <span
                  className={cn(
                    "tabular-nums",
                    active
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground/70",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : !issues || issues.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No issues yet"
          description="Report your first civic issue and it'll appear here."
          action={
            <Link href="/citizen/report" className={cn(buttonVariants())}>
              <FilePlus className="size-4" />
              Report an issue
            </Link>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Nothing here"
          description={`You have no ${STATUS_LABELS[
            filter as IssueStatus
          ].toLowerCase()} issues.`}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CircleCheck, ClipboardList, Clock, Inbox } from "lucide-react";
import { issueService } from "@/services/issueService";
import { apiErrorMessage } from "@/lib/api";
import {
  CATEGORIES,
  STATUSES,
  type Issue,
  type IssueStatus,
  type Statistics,
} from "@/types";
import {
  CATEGORY_LABELS,
  CHART_COLORS,
  STATUS_CHART_COLOR,
  STATUS_LABELS,
} from "@/lib/constants";
import { PageHeader } from "@/components/page-header";
import { DashboardCard } from "@/components/DashboardCard";
import { IssueGrid } from "@/components/IssueGrid";
import { ChartCard } from "@/components/chart-card";
import { CategoryBarChart } from "@/components/charts/category-bar-chart";
import { StatusDonutChart } from "@/components/charts/status-donut-chart";
import { EmptyState } from "@/components/empty-state";
import { ErrorBanner } from "@/components/form-field";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Filter = "ALL" | IssueStatus;

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("ALL");

  const load = useCallback(async () => {
    try {
      const [s, i] = await Promise.all([
        issueService.statistics(),
        issueService.allIssues(),
      ]);
      setStats(s);
      setIssues(i);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const loading = (stats === null || issues === null) && !error;

  const statusData = STATUSES.map((s) => ({
    name: STATUS_LABELS[s],
    value: stats?.byStatus?.[s] ?? 0,
    color: STATUS_CHART_COLOR[s],
  }));
  const categoryData = CATEGORIES.map((c, i) => ({
    name: CATEGORY_LABELS[c],
    value: stats?.byCategory?.[c] ?? 0,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const filtered = useMemo(() => {
    if (!issues) return [];
    return filter === "ALL" ? issues : issues.filter((i) => i.status === filter);
  }, [issues, filter]);

  const total = stats?.totalIssues ?? 0;
  const submitted = stats?.byStatus?.SUBMITTED ?? 0;
  const inProgress = stats?.byStatus?.IN_PROGRESS ?? 0;
  const resolved = stats?.byStatus?.RESOLVED ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Administrator dashboard"
        description="Monitor and manage every issue reported across the city."
      />

      {error ? <ErrorBanner message={error} /> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))
        ) : (
          <>
            <DashboardCard
              label="Total issues"
              value={total}
              icon={ClipboardList}
              accent="primary"
            />
            <DashboardCard
              label="Submitted"
              value={submitted}
              icon={Inbox}
              accent="primary"
            />
            <DashboardCard
              label="In progress"
              value={inProgress}
              icon={Clock}
              accent="warning"
            />
            <DashboardCard
              label="Resolved"
              value={resolved}
              icon={CircleCheck}
              accent="success"
            />
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Issues by status" description="Distribution across the workflow">
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <StatusDonutChart data={statusData} />
          )}
        </ChartCard>
        <ChartCard title="Issues by category" description="What citizens report most">
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <CategoryBarChart data={categoryData} />
          )}
        </ChartCard>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold">All issues</h2>
          {issues && issues.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {(["ALL", ...STATUSES] as Filter[]).map((f) => {
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
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition-colors",
                      active
                        ? "bg-primary text-primary-foreground ring-primary"
                        : "bg-card text-muted-foreground ring-border hover:text-foreground",
                    )}
                  >
                    {f === "ALL" ? "All" : STATUS_LABELS[f]}
                    <span className="tabular-nums opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : !issues || issues.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No issues reported yet"
            description="When citizens submit issues, they'll appear here for review."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="Nothing to show"
            description={`There are no ${STATUS_LABELS[
              filter as IssueStatus
            ].toLowerCase()} issues.`}
          />
        ) : (
          <IssueGrid issues={filtered} canManage onUpdated={load} />
        )}
      </section>
    </div>
  );
}

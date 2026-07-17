"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CircleCheck, Clock, FilePlus, Inbox, ListChecks } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { issueService } from "@/services/issueService";
import { apiErrorMessage } from "@/lib/api";
import { CATEGORIES, STATUSES, type Issue } from "@/types";
import {
  CATEGORY_LABELS,
  CHART_COLORS,
  STATUS_CHART_COLOR,
  STATUS_LABELS,
} from "@/lib/constants";
import { PageHeader } from "@/components/page-header";
import { DashboardCard } from "@/components/DashboardCard";
import { IssueCard } from "@/components/IssueCard";
import { ChartCard } from "@/components/chart-card";
import { CategoryBarChart } from "@/components/charts/category-bar-chart";
import { StatusDonutChart } from "@/components/charts/status-donut-chart";
import { EmptyState } from "@/components/empty-state";
import { ErrorBanner } from "@/components/form-field";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CitizenDashboardPage() {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [error, setError] = useState<string | null>(null);

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
  const firstName = user?.name?.split(" ")[0] ?? "there";

  const total = issues?.length ?? 0;
  const resolved = issues?.filter((i) => i.status === "RESOLVED").length ?? 0;
  const pending = total - resolved;

  const statusData = STATUSES.map((s) => ({
    name: STATUS_LABELS[s],
    value: issues?.filter((i) => i.status === s).length ?? 0,
    color: STATUS_CHART_COLOR[s],
  }));
  const categoryData = CATEGORIES.map((c, i) => ({
    name: CATEGORY_LABELS[c],
    value: issues?.filter((issue) => issue.category === c).length ?? 0,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const recent = issues?.slice(0, 3) ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here's an overview of the issues you've reported."
        actions={
          <Link href="/citizen/report" className={cn(buttonVariants())}>
            <FilePlus className="size-4" />
            Report issue
          </Link>
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      <div className="grid gap-4 sm:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))
        ) : (
          <>
            <DashboardCard
              label="Total reports"
              value={total}
              icon={ListChecks}
              accent="primary"
            />
            <DashboardCard
              label="Pending"
              value={pending}
              icon={Clock}
              accent="warning"
              hint="Submitted or in progress"
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
        <ChartCard
          title="Status distribution"
          description="How your reports are progressing"
        >
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <StatusDonutChart data={statusData} />
          )}
        </ChartCard>
        <ChartCard
          title="Reports by category"
          description="Where you've spotted problems"
        >
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <CategoryBarChart data={categoryData} />
          )}
        </ChartCard>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Recent reports</h2>
          {total > 0 ? (
            <Link
              href="/citizen/issues"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          ) : null}
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : total === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No reports yet"
            description="When you report an issue, it'll show up here so you can track its progress."
            action={
              <Link href="/citizen/report" className={cn(buttonVariants())}>
                <FilePlus className="size-4" />
                Report your first issue
              </Link>
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

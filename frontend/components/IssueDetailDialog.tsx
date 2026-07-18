"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin, User, X } from "lucide-react";
import { CategoryIcon } from "@/components/category-icon";
import { SeverityBadge, StatusBadge } from "@/components/issue-badges";
import { Spinner } from "@/components/spinner";
import { apiErrorMessage } from "@/lib/api";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/constants";
import { issueService } from "@/services/issueService";
import { STATUSES, type Issue, type IssueStatus } from "@/types";
import { cn } from "@/lib/utils";

export function IssueDetailDialog({
  issue,
  canManage = false,
  onClose,
  onUpdated,
}: {
  issue: Issue;
  canManage?: boolean;
  onClose: () => void;
  onUpdated?: (updated: Issue) => void;
}) {
  const [current, setCurrent] = useState<Issue>(issue);
  const [saving, setSaving] = useState<IssueStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setCurrent(issue), [issue]);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function changeStatus(status: IssueStatus) {
    if (status === current.status || saving) return;
    setSaving(status);
    setError(null);
    try {
      const updated = await issueService.updateStatus(current.id, status);
      setCurrent(updated);
      onUpdated?.(updated);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not update the status."));
    } finally {
      setSaving(null);
    }
  }

  const location =
    current.address ||
    (current.latitude != null && current.longitude != null
      ? `${current.latitude.toFixed(5)}, ${current.longitude.toFixed(5)}`
      : "—");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={current.title}
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-card shadow-xl ring-1 ring-foreground/10 sm:rounded-2xl">
        <div className="relative shrink-0">
          {current.imageUrl ? (
            <img
              src={current.imageUrl}
              alt={current.title}
              className="h-48 w-full object-cover"
            />
          ) : (
            <div className="flex h-28 w-full items-center justify-center bg-muted text-muted-foreground/50">
              <CategoryIcon category={current.category} className="size-10" />
            </div>
          )}
          <div className="absolute left-3 top-3">
            <StatusBadge status={current.status} />
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <CategoryIcon category={current.category} className="size-3.5" />
              {CATEGORY_LABELS[current.category]}
              <span className="text-border">•</span>
              <SeverityBadge severity={current.severity} />
            </div>
            <h2 className="mt-2 font-heading text-lg font-semibold">
              {current.title}
            </h2>
            <p className="mt-1.5 whitespace-pre-line text-sm text-muted-foreground">
              {current.description}
            </p>
          </div>

          <dl className="space-y-2 border-t border-border pt-4 text-sm">
            <DetailRow icon={User} label="Reported by" value={current.citizenName} />
            <DetailRow icon={MapPin} label="Location" value={location} />
            <DetailRow
              icon={Clock}
              label="Reported"
              value={new Date(current.createdAt).toLocaleString()}
            />
          </dl>

          {canManage ? (
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-sm font-medium">Update status</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {STATUSES.map((s) => {
                  const active = current.status === s;
                  const isSaving = saving === s;
                  return (
                    <button
                      key={s}
                      onClick={() => changeStatus(s)}
                      disabled={active || saving !== null}
                      className={cn(
                        "flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium ring-1 transition-colors disabled:cursor-not-allowed",
                        active
                          ? "bg-primary text-primary-foreground ring-primary"
                          : "bg-card text-foreground ring-border hover:bg-accent disabled:opacity-60",
                      )}
                    >
                      {isSaving ? <Spinner className="size-3.5" /> : null}
                      {STATUS_LABELS[s]}
                    </button>
                  );
                })}
              </div>
              {error ? (
                <p className="mt-2 text-xs text-destructive">{error}</p>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  Currently{" "}
                  <span className="font-medium text-foreground">
                    {STATUS_LABELS[current.status]}
                  </span>
                  . Pick a new status to update it.
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-right font-medium">{value}</span>
      </div>
    </div>
  );
}

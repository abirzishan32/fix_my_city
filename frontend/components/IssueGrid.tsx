"use client";

import { useState } from "react";
import { IssueCard } from "@/components/IssueCard";
import { IssueDetailDialog } from "@/components/IssueDetailDialog";
import type { Issue } from "@/types";

/**
 * Responsive issue grid where each card opens a detail dialog.
 * With `canManage`, the dialog also lets an admin change the status.
 */
export function IssueGrid({
  issues,
  canManage = false,
  onUpdated,
}: {
  issues: Issue[];
  canManage?: boolean;
  onUpdated?: (updated: Issue) => void;
}) {
  const [selected, setSelected] = useState<Issue | null>(null);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onClick={() => setSelected(issue)}
          />
        ))}
      </div>

      {selected ? (
        <IssueDetailDialog
          issue={selected}
          canManage={canManage}
          onClose={() => setSelected(null)}
          onUpdated={(updated) => {
            onUpdated?.(updated);
            setSelected(updated);
          }}
        />
      ) : null}
    </>
  );
}

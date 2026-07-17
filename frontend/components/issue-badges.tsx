import { Badge } from "@/components/ui/badge";
import {
  SEVERITY_LABELS,
  SEVERITY_VARIANT,
  STATUS_LABELS,
  STATUS_VARIANT,
} from "@/lib/constants";
import type { IssueStatus, Severity } from "@/types";

export function StatusBadge({ status }: { status: IssueStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABELS[status]}</Badge>;
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <Badge variant={SEVERITY_VARIANT[severity]}>{SEVERITY_LABELS[severity]}</Badge>
  );
}

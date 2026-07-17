import type { Category, IssueStatus, Severity } from "@/types";

export const CATEGORY_LABELS: Record<Category, string> = {
  POTHOLE: "Pothole",
  GARBAGE: "Garbage",
  WATER_LEAKAGE: "Water leakage",
  BROKEN_LIGHT: "Broken light",
  TRAFFIC: "Traffic",
  OTHER: "Other",
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const STATUS_LABELS: Record<IssueStatus, string> = {
  SUBMITTED: "Submitted",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
};

/** Badge variants (see components/ui/badge) per enum value. */
export const STATUS_VARIANT: Record<IssueStatus, "default" | "warning" | "success"> = {
  SUBMITTED: "default",
  IN_PROGRESS: "warning",
  RESOLVED: "success",
};

export const SEVERITY_VARIANT: Record<Severity, "neutral" | "warning" | "danger"> = {
  LOW: "neutral",
  MEDIUM: "warning",
  HIGH: "danger",
};

/** Fixed chart colors keyed to CSS variables so they follow the active theme. */
export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export const STATUS_CHART_COLOR: Record<IssueStatus, string> = {
  SUBMITTED: "var(--chart-1)",
  IN_PROGRESS: "var(--chart-3)",
  RESOLVED: "var(--chart-2)",
};

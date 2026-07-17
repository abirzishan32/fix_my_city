export type Role = "CITIZEN" | "ADMIN";

export interface AuthUser {
  userId: number;
  name: string;
  email: string;
  role: Role;
}

export const CATEGORIES = [
  "POTHOLE",
  "GARBAGE",
  "WATER_LEAKAGE",
  "BROKEN_LIGHT",
  "TRAFFIC",
  "OTHER",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const SEVERITIES = ["LOW", "MEDIUM", "HIGH"] as const;
export type Severity = (typeof SEVERITIES)[number];

export const STATUSES = ["SUBMITTED", "IN_PROGRESS", "RESOLVED"] as const;
export type IssueStatus = (typeof STATUSES)[number];

export interface Issue {
  id: number;
  title: string;
  description: string;
  category: Category;
  severity: Severity;
  status: IssueStatus;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  citizenId: number;
  citizenName: string;
}

export interface Statistics {
  totalIssues: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  bySeverity: Record<string, number>;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface CreateIssuePayload {
  title: string;
  description: string;
  category: Category;
  severity: Severity;
  latitude: number;
  longitude: number;
  address?: string;
  image?: File | null;
}

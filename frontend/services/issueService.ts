import { api } from "@/lib/api";
import type { CreateIssuePayload, Issue, Statistics } from "@/types";

export const issueService = {
  /** Citizen: create an issue (multipart, optional image). */
  async create(payload: CreateIssuePayload): Promise<Issue> {
    const form = new FormData();
    form.append("title", payload.title);
    form.append("description", payload.description);
    form.append("category", payload.category);
    form.append("severity", payload.severity);
    form.append("latitude", String(payload.latitude));
    form.append("longitude", String(payload.longitude));
    if (payload.address) form.append("address", payload.address);
    if (payload.image) form.append("image", payload.image);

    const { data } = await api.post<Issue>("/issues", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  /** Citizen: list the current user's issues. */
  async myIssues(): Promise<Issue[]> {
    const { data } = await api.get<Issue[]>("/issues/my");
    return data;
  },

  /** Admin: list every issue. */
  async allIssues(): Promise<Issue[]> {
    const { data } = await api.get<Issue[]>("/admin/issues");
    return data;
  },

  /** Admin: aggregated statistics for the dashboard. */
  async statistics(): Promise<Statistics> {
    const { data } = await api.get<Statistics>("/admin/statistics");
    return data;
  },
};

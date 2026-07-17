import { api } from "@/lib/api";
import type { AuthUser, LoginPayload, RegisterPayload } from "@/types";

/**
 * Auth API. The JWT is delivered by the backend as an HttpOnly cookie, so these
 * methods never see or store a token — they only return the user profile.
 */
export const authService = {
  async register(payload: RegisterPayload): Promise<AuthUser> {
    const { data } = await api.post<AuthUser>("/auth/register", payload);
    return data;
  },

  async login(payload: LoginPayload): Promise<AuthUser> {
    const { data } = await api.post<AuthUser>("/auth/login", payload);
    return data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  async me(): Promise<AuthUser> {
    const { data } = await api.get<AuthUser>("/auth/me");
    return data;
  },
};

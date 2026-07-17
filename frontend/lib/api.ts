import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

/**
 * Single axios instance for the whole app.
 * `withCredentials` is essential: it makes the browser send/receive the
 * backend's HttpOnly auth cookie on cross-origin requests.
 */
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

interface ApiErrorBody {
  message?: string;
  fieldErrors?: Record<string, string>;
}

/** Extracts a human-readable message from an axios error (or anything). */
export function apiErrorMessage(err: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiErrorBody | undefined;
    if (data?.fieldErrors) {
      const first = Object.values(data.fieldErrors)[0];
      if (first) return first;
    }
    if (data?.message) return data.message;
    if (err.code === "ERR_NETWORK") {
      return "Cannot reach the server. Make sure the backend is running.";
    }
    if (err.message) return err.message;
  }
  return fallback;
}

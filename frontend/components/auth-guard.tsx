"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FullPageLoader } from "@/components/spinner";
import type { Role } from "@/types";

/**
 * Client-side route guard. Because the JWT lives in an HttpOnly cookie scoped to
 * the API origin, the Next server can't read it — so we gate on the AuthContext
 * session (hydrated via /auth/me) and redirect on mismatch.
 */
export function AuthGuard({
  role,
  children,
}: {
  role?: Role;
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (role && user.role !== role) {
      router.replace(
        user.role === "ADMIN" ? "/admin/dashboard" : "/citizen/dashboard",
      );
    }
  }, [loading, user, role, router]);

  if (loading || !user || (role && user.role !== role)) {
    return <FullPageLoader label="Checking your session…" />;
  }

  return <>{children}</>;
}

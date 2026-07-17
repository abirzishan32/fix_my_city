"use client";

import Link from "next/link";
import { Wordmark } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  const { user, loading } = useAuth();
  const dashboardHref =
    user?.role === "ADMIN" ? "/admin/dashboard" : "/citizen/dashboard";

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Wordmark />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!loading && user ? (
            <Link href={dashboardHref} className={cn(buttonVariants({ size: "sm" }))}>
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "hidden sm:inline-flex",
                )}
              >
                Sign in
              </Link>
              <Link href="/register" className={cn(buttonVariants({ size: "sm" }))}>
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

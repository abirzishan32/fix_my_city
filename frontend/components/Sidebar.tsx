"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FilePlus, LayoutDashboard, ListChecks } from "lucide-react";
import { Wordmark } from "@/components/brand";
import { useAuth } from "@/context/AuthContext";
import { cn, getInitials } from "@/lib/utils";
import type { Role } from "@/types";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV: Record<Role, NavItem[]> = {
  CITIZEN: [
    { href: "/citizen/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/citizen/report", label: "Report issue", icon: FilePlus },
    { href: "/citizen/issues", label: "My issues", icon: ListChecks },
  ],
  ADMIN: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
};

export function Sidebar({
  role,
  onNavigate,
}: {
  role: Role;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const items = NAV[role];

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-5">
        <Wordmark
          href={role === "ADMIN" ? "/admin/dashboard" : "/citizen/dashboard"}
        />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {role === "ADMIN" ? "Administration" : "Menu"}
        </p>
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="size-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {user ? (
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {getInitials(user.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs capitalize text-muted-foreground">
                {user.role.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

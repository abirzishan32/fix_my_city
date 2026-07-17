import { AuthGuard } from "@/components/auth-guard";
import { DashboardShell } from "@/components/dashboard-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard role="ADMIN">
      <DashboardShell role="ADMIN">{children}</DashboardShell>
    </AuthGuard>
  );
}

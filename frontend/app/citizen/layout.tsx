import { AuthGuard } from "@/components/auth-guard";
import { DashboardShell } from "@/components/dashboard-shell";

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard role="CITIZEN">
      <DashboardShell role="CITIZEN">{children}</DashboardShell>
    </AuthGuard>
  );
}

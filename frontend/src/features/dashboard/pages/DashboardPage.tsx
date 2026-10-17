import { PageHeader } from "@/components/common";
import { useCurrentUser } from "@/features/auth";
import { useDocumentTitle } from "@/hooks";
import { ChartGrid } from "../components/ChartGrid";
import { KpiGrid } from "../components/KpiGrid";
import { ROLE_DASHBOARDS } from "../lib/dashboardConfig";

// The overview tab: key numbers, then the charts for the user's role
export function DashboardPage() {
  useDocumentTitle("Dashboard");
  const { user } = useCurrentUser();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <PageHeader title={`Welcome, ${user.name}`} description="Here's how things are going." />
      <KpiGrid role={user.role} />
      <ChartGrid charts={ROLE_DASHBOARDS[user.role].charts} />
    </div>
  );
}

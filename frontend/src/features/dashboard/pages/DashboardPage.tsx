import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants";
import { USER_ROLE_LABELS } from "@/enums";
import { useCurrentUser } from "@/features/auth";
import { useDocumentTitle } from "@/hooks";
import { ChartGrid } from "../components/ChartGrid";
import { KpiGrid } from "../components/KpiGrid";
import { QuickActions } from "../components/QuickActions";
import { OVERVIEW_CHART_COUNT, ROLE_DASHBOARDS } from "../lib/dashboardConfig";

// Dashboard home (inside DashboardLayout): key figures, what to do next, and the two main charts
export function DashboardPage() {
  useDocumentTitle("Dashboard");
  const { user } = useCurrentUser();
  if (!user) return null;

  const charts = ROLE_DASHBOARDS[user.role].charts.slice(0, OVERVIEW_CHART_COUNT);

  return (
    <>
      <PageHeader
        title={`Welcome, ${user.name}`}
        description={`${USER_ROLE_LABELS[user.role]} dashboard`}
      />
      <KpiGrid role={user.role} />
      <QuickActions role={user.role} />
      <section aria-labelledby="highlights-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 id="highlights-heading" className="text-lg font-semibold">
            Highlights
          </h2>
          <Button variant="ghost" asChild>
            <Link to={ROUTES.dashboardAnalytics}>
              All analytics
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
        <ChartGrid charts={charts} />
      </section>
    </>
  );
}

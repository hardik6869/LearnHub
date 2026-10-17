import { PageHeader } from "@/components/common";
import type { UserRole } from "@/enums";
import { useCurrentUser } from "@/features/auth";
import { useDocumentTitle } from "@/hooks";
import { ChartGrid } from "../components/ChartGrid";
import { ROLE_DASHBOARDS } from "../lib/dashboardConfig";

// The API scopes the numbers, so the description says whose data this is
const SCOPE: Record<UserRole, string> = {
  admin: "Activity across the whole platform.",
  publisher: "Activity on the academies you manage.",
  user: "The reviews you have written.",
};

export function AnalyticsPage() {
  useDocumentTitle("Analytics");
  const { user } = useCurrentUser();
  if (!user) return null;

  return (
    <>
      <PageHeader title="Analytics" description={SCOPE[user.role]} />
      <ChartGrid charts={ROLE_DASHBOARDS[user.role].charts} />
    </>
  );
}

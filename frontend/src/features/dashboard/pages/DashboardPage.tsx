import { Container, PageHeader } from "@/components/common";
import { USER_ROLE_LABELS } from "@/enums";
import { ACADEMY_MANAGER_ROLES, hasRole, REVIEWER_ROLES, useCurrentUser } from "@/features/auth";
import { useDocumentTitle } from "@/hooks";
import { DashboardOverview } from "../components/DashboardOverview";
import { MyAcademies } from "../components/MyAcademies";
import { MyReviews } from "../components/MyReviews";

// Behind RequireAuth. An overview of KPIs and charts for the user's role, then sections that
// follow the role: publishers manage academies, students write reviews, admins see both.
export function DashboardPage() {
  useDocumentTitle("Dashboard");
  const { user } = useCurrentUser();
  if (!user) return null;

  return (
    <Container className="space-y-8 py-6">
      <PageHeader
        title={`Welcome, ${user.name}`}
        description={`${USER_ROLE_LABELS[user.role]} dashboard`}
      />
      <DashboardOverview role={user.role} />
      {hasRole(user, ACADEMY_MANAGER_ROLES) && <MyAcademies user={user} />}
      {hasRole(user, REVIEWER_ROLES) && <MyReviews user={user} />}
    </Container>
  );
}

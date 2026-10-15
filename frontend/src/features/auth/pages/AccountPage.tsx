import { Container, PageHeader } from "@/components/common";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { USER_ROLE_LABELS } from "@/enums";
import { useDocumentTitle } from "@/hooks";
import { UpdateDetailsForm } from "../components/UpdateDetailsForm";
import { UpdatePasswordForm } from "../components/UpdatePasswordForm";
import { useCurrentUser } from "../hooks/useCurrentUser";

// Behind RequireAuth, so the user is always loaded here
export function AccountPage() {
  useDocumentTitle("Account");
  const { user } = useCurrentUser();
  if (!user) return null;

  return (
    <Container className="space-y-8 py-8">
      <PageHeader
        title="Account"
        description={`Signed in as ${user.email} · ${USER_ROLE_LABELS[user.role]}`}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Profile</h2>
            </CardTitle>
            <CardDescription>Your name and email address.</CardDescription>
          </CardHeader>
          <CardContent>
            <UpdateDetailsForm user={user} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Password</h2>
            </CardTitle>
            <CardDescription>Use at least 6 characters.</CardDescription>
          </CardHeader>
          <CardContent>
            <UpdatePasswordForm />
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

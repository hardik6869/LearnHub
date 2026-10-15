import { useNavigate, useParams } from "react-router";
import { AccessDenied, Container, PageError, PageHeader, PageLoading } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { ROUTES } from "@/constants";
import { canManage, useCurrentUser } from "@/features/auth";
import { useDocumentTitle } from "@/hooks";
import { AcademyForm } from "../components/AcademyForm";
import { AcademyPhotoUpload } from "../components/AcademyPhotoUpload";
import { useAcademy } from "../hooks/useAcademies";
import { useUpdateAcademy } from "../hooks/useAcademyMutations";
import { toAcademyFormValues, type AcademyFormValues } from "../schemas/academySchema";

export function EditAcademyPage() {
  useDocumentTitle("Edit academy");
  const { id = "" } = useParams();
  const { user } = useCurrentUser();
  const { data: academy, isPending, isError, error, refetch } = useAcademy(id);
  const updateAcademy = useUpdateAcademy(id);
  const navigate = useNavigate();

  if (isPending) return <PageLoading />;
  if (isError) {
    return (
      <PageError error={error} notFoundTitle="Academy not found" onRetry={() => void refetch()} />
    );
  }
  if (!canManage(user, academy)) return <AccessDenied />;

  const handleSubmit = (values: AcademyFormValues) => {
    updateAcademy.mutate(values, {
      onSuccess: () => void navigate(ROUTES.academyDetail(id)),
    });
  };

  return (
    <Container className="max-w-3xl space-y-8 py-8">
      <PageHeader title="Edit academy" description={academy.name} />
      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Photo</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AcademyPhotoUpload academy={academy} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Details</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AcademyForm
            defaultValues={toAcademyFormValues(academy)}
            onSubmit={handleSubmit}
            isPending={updateAcademy.isPending}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
    </Container>
  );
}

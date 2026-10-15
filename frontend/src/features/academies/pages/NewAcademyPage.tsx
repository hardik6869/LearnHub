import { useNavigate } from "react-router";
import { Container, PageHeader } from "@/components/common";
import { Card, CardContent } from "@/components/ui";
import { ROUTES } from "@/constants";
import { useDocumentTitle } from "@/hooks";
import { AcademyForm } from "../components/AcademyForm";
import { useCreateAcademy } from "../hooks/useAcademyMutations";
import { toAcademyFormValues, type AcademyFormValues } from "../schemas/academySchema";

const EMPTY_VALUES = toAcademyFormValues();

export function NewAcademyPage() {
  useDocumentTitle("Add academy");
  const createAcademy = useCreateAcademy();
  const navigate = useNavigate();

  const handleSubmit = (values: AcademyFormValues) => {
    createAcademy.mutate(values, {
      onSuccess: (academy) => void navigate(ROUTES.academyDetail(academy._id)),
    });
  };

  return (
    <Container className="max-w-3xl space-y-8 py-8">
      <PageHeader
        title="Add academy"
        description="Publishers can add one academy. You can upload a photo after saving."
      />
      <Card>
        <CardContent>
          <AcademyForm
            defaultValues={EMPTY_VALUES}
            onSubmit={handleSubmit}
            isPending={createAcademy.isPending}
            submitLabel="Create academy"
          />
        </CardContent>
      </Card>
    </Container>
  );
}

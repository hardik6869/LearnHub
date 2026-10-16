import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { FormDialog } from "@/components/common";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants";
import { useCreateAcademy } from "../hooks/useAcademyMutations";
import { toAcademyFormValues, type AcademyFormValues } from "../schemas/academySchema";
import { AcademyForm } from "./AcademyForm";

const EMPTY_VALUES = toAcademyFormValues();

// "Add academy" button and its create dialog; opens the new academy once it is saved
export function AddAcademyButton() {
  const [open, setOpen] = useState(false);
  const createAcademy = useCreateAcademy();
  const navigate = useNavigate();

  const handleSubmit = (values: AcademyFormValues) => {
    createAcademy.mutate(values, {
      onSuccess: (academy) => {
        setOpen(false);
        void navigate(ROUTES.academyDetail(academy._id));
      },
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus aria-hidden />
        Add academy
      </Button>
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title="Add academy"
        description="Publishers can add one academy. You can upload a photo after saving."
        size="lg"
      >
        <AcademyForm
          defaultValues={EMPTY_VALUES}
          onSubmit={handleSubmit}
          isPending={createAcademy.isPending}
          submitLabel="Create academy"
        />
      </FormDialog>
    </>
  );
}

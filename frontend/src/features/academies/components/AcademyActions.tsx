import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ConfirmDialog, FormDialog } from "@/components/common";
import { Button, Separator } from "@/components/ui";
import { ROUTES } from "@/constants";
import type { Academy } from "@/types";
import { useDeleteAcademy, useUpdateAcademy } from "../hooks/useAcademyMutations";
import { toAcademyFormValues, type AcademyFormValues } from "../schemas/academySchema";
import { AcademyForm } from "./AcademyForm";
import { AcademyPhotoUpload } from "./AcademyPhotoUpload";

type OpenDialog = "edit" | "delete" | null;

// Edit (dialog with photo + details) and Delete (confirm) for the academy's owner or an admin;
// the caller checks canManage
export function AcademyActions({ academy }: { academy: Academy }) {
  const [openDialog, setOpenDialog] = useState<OpenDialog>(null);
  const updateAcademy = useUpdateAcademy(academy._id);
  const deleteAcademy = useDeleteAcademy();
  const navigate = useNavigate();

  const close = () => setOpenDialog(null);
  const toggle = (dialog: OpenDialog) => (open: boolean) => setOpenDialog(open ? dialog : null);

  const handleUpdate = (values: AcademyFormValues) => {
    updateAcademy.mutate(values, { onSuccess: close });
  };

  const handleDelete = () => {
    deleteAcademy.mutate(academy._id, {
      onSuccess: () => {
        close();
        void navigate(ROUTES.academies, { replace: true });
      },
    });
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpenDialog("edit")}>
        <Pencil aria-hidden />
        Edit
      </Button>
      <Button variant="outline" onClick={() => setOpenDialog("delete")}>
        <Trash2 aria-hidden />
        Delete
      </Button>

      <FormDialog
        open={openDialog === "edit"}
        onOpenChange={toggle("edit")}
        title="Edit academy"
        description={academy.name}
        size="lg"
      >
        <div className="space-y-6">
          {/* The photo saves on its own, so it can be changed without touching the details */}
          <AcademyPhotoUpload academy={academy} />
          <Separator />
          <AcademyForm
            defaultValues={toAcademyFormValues(academy)}
            onSubmit={handleUpdate}
            isPending={updateAcademy.isPending}
            submitLabel="Save changes"
          />
        </div>
      </FormDialog>

      <ConfirmDialog
        open={openDialog === "delete"}
        onOpenChange={toggle("delete")}
        title={`Delete ${academy.name}?`}
        description="This also deletes its courses. This can't be undone."
        confirmLabel="Delete academy"
        destructive
        isPending={deleteAcademy.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}

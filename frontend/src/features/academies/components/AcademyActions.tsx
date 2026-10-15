import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ConfirmDialog } from "@/components/common";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants";
import type { Academy } from "@/types";
import { useDeleteAcademy } from "../hooks/useAcademyMutations";

// Edit and Delete for the academy's owner or an admin (the caller checks canManage)
export function AcademyActions({ academy }: { academy: Academy }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteAcademy = useDeleteAcademy();
  const navigate = useNavigate();

  const handleDelete = () => {
    deleteAcademy.mutate(academy._id, {
      onSuccess: () => {
        setConfirmOpen(false);
        void navigate(ROUTES.academies, { replace: true });
      },
    });
  };

  return (
    <>
      <Button variant="outline" asChild>
        <Link to={ROUTES.academyEdit(academy._id)}>
          <Pencil aria-hidden />
          Edit
        </Link>
      </Button>
      <Button variant="outline" onClick={() => setConfirmOpen(true)}>
        <Trash2 aria-hidden />
        Delete
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
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

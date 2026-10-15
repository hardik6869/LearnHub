import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { SubmitButton } from "@/components/common";
import { Field, FieldDescription, FieldError, FieldLabel, Input } from "@/components/ui";
import { MAX_PHOTO_BYTES } from "@/constants";
import type { Academy } from "@/types";
import { useUploadAcademyPhoto } from "../hooks/useAcademyMutations";
import { AcademyPhoto } from "./AcademyPhoto";

const MAX_PHOTO_LABEL = `${String(MAX_PHOTO_BYTES / 1_000_000)} MB`;

// Checked here too so users get instant feedback; the API enforces the same rules
const validatePhoto = (file: File): string | null => {
  if (!file.type.startsWith("image/")) return "Choose an image file.";
  if (file.size > MAX_PHOTO_BYTES) return `The image must be ${MAX_PHOTO_LABEL} or smaller.`;
  return null;
};

export function AcademyPhotoUpload({ academy }: { academy: Academy }) {
  const upload = useUploadAcademyPhoto(academy._id);
  const [file, setFile] = useState<File | null>(null);
  const error = file && validatePhoto(file);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || error) return;
    const formElement = event.currentTarget;
    upload.mutate(file, {
      onSuccess: () => {
        setFile(null);
        formElement.reset();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-[12rem_1fr] sm:items-start">
      <AcademyPhoto academy={academy} fit="contain" className="max-h-40 w-full max-w-48" />
      <div className="space-y-4">
        <Field data-invalid={Boolean(error)}>
          <FieldLabel htmlFor="academy-photo">Photo</FieldLabel>
          <Input
            id="academy-photo"
            type="file"
            accept="image/*"
            onChange={handleChange}
            aria-invalid={Boolean(error)}
          />
          <FieldDescription>
            A landscape photo works best (16:9, at least 1200 × 675 px), up to {MAX_PHOTO_LABEL}.
            Lists crop it to 16:9.
          </FieldDescription>
          {error && <FieldError>{error}</FieldError>}
        </Field>
        <SubmitButton isPending={upload.isPending} disabled={!file || Boolean(error)}>
          Upload photo
        </SubmitButton>
      </div>
    </form>
  );
}

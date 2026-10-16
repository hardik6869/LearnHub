import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SelectField, SubmitButton, TextareaField, TextField } from "@/components/common";
import { FieldGroup } from "@/components/ui";
import { RATING_OPTIONS, reviewSchema, type ReviewFormValues } from "../schemas/reviewSchema";

interface ReviewFormProps {
  defaultValues: ReviewFormValues;
  onSubmit: (values: ReviewFormValues) => void;
  isPending: boolean;
  submitLabel: string;
}

// Shared by the write and edit dialogs
export function ReviewForm({ defaultValues, onSubmit, isPending, submitLabel }: ReviewFormProps) {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues,
  });
  const { control } = form;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <SelectField
          control={control}
          name="rating"
          label="Rating"
          options={RATING_OPTIONS}
          placeholder="Choose a rating"
          required
        />
        <TextField control={control} name="title" label="Title" required />
        <TextareaField
          control={control}
          name="text"
          label="Your review"
          rows={5}
          placeholder="What was good, and what could be better?"
          required
        />
        <SubmitButton isPending={isPending} className="self-start">
          {submitLabel}
        </SubmitButton>
      </FieldGroup>
    </form>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CheckboxField,
  SelectField,
  SubmitButton,
  TextareaField,
  TextField,
} from "@/components/common";
import { FieldGroup } from "@/components/ui";
import { MINIMUM_SKILL_OPTIONS } from "@/enums";
import { courseSchema, type CourseFormValues } from "../schemas/courseSchema";

interface CourseFormProps {
  defaultValues: CourseFormValues;
  onSubmit: (values: CourseFormValues) => void;
  isPending: boolean;
  submitLabel: string;
}

// Shared by the add and edit dialogs
export function CourseForm({ defaultValues, onSubmit, isPending, submitLabel }: CourseFormProps) {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues,
  });
  const { control } = form;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <TextField control={control} name="title" label="Title" required />
        <TextareaField control={control} name="description" label="Description" required />
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField
            control={control}
            name="weeks"
            label="Weeks"
            type="number"
            inputMode="numeric"
            min={1}
            required
          />
          <TextField
            control={control}
            name="tuition"
            label="Tuition (USD)"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            required
          />
          <SelectField
            control={control}
            name="minimumSkill"
            label="Minimum skill"
            options={MINIMUM_SKILL_OPTIONS}
            required
          />
        </div>
        <CheckboxField
          control={control}
          name="scholarhipsAvailable"
          label="Scholarships available"
        />
        <SubmitButton isPending={isPending} className="self-start">
          {submitLabel}
        </SubmitButton>
      </FieldGroup>
    </form>
  );
}

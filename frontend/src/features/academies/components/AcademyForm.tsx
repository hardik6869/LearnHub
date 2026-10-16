import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CheckboxField,
  CheckboxGroupField,
  SubmitButton,
  TextareaField,
  TextField,
} from "@/components/common";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui";
import { CAREER_OPTIONS } from "@/enums";
import { academySchema, type AcademyFormValues } from "../schemas/academySchema";

interface AcademyFormProps {
  defaultValues: AcademyFormValues;
  onSubmit: (values: AcademyFormValues) => void;
  isPending: boolean;
  submitLabel: string;
}

// Shared by the create and edit pages
export function AcademyForm({ defaultValues, onSubmit, isPending, submitLabel }: AcademyFormProps) {
  const form = useForm<AcademyFormValues>({
    resolver: zodResolver(academySchema),
    defaultValues,
  });
  const { control } = form;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <TextField control={control} name="name" label="Name" required />
        <TextareaField
          control={control}
          name="description"
          label="Description"
          description="10–500 characters."
          required
        />
        <TextField
          control={control}
          name="address"
          label="Address"
          autoComplete="street-address"
          required
        />

        <div className="grid gap-5 sm:grid-cols-3">
          <TextField
            control={control}
            name="website"
            label="Website"
            type="url"
            placeholder="https://"
          />
          <TextField control={control} name="phone" label="Phone" type="tel" />
          <TextField control={control} name="email" label="Email" type="email" />
        </div>

        <CheckboxGroupField
          control={control}
          name="careers"
          label="Careers"
          options={CAREER_OPTIONS}
          required
        />

        <FieldSet>
          <FieldLegend variant="label">Features</FieldLegend>
          <div className="grid gap-3 sm:grid-cols-2">
            <CheckboxField control={control} name="housing" label="Housing" />
            <CheckboxField control={control} name="jobAssistance" label="Job assistance" />
            <CheckboxField control={control} name="jobGuarantee" label="Job guarantee" />
            <CheckboxField control={control} name="acceptGi" label="Accepts GI Bill" />
          </div>
        </FieldSet>

        <SubmitButton isPending={isPending} className="self-start">
          {submitLabel}
        </SubmitButton>
      </FieldGroup>
    </form>
  );
}

import type { ReactNode } from "react";
import {
  Controller,
  type Control,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui";

// Props shared by every form field wrapper
export interface BaseFieldProps<TValues extends FieldValues> {
  control: Control<TValues>;
  name: FieldPath<TValues>;
  label: string;
  description?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

interface FormFieldProps<TValues extends FieldValues> extends BaseFieldProps<TValues> {
  /** "horizontal" puts the control before the label (checkboxes) */
  orientation?: "vertical" | "horizontal";
  render: (
    field: ControllerRenderProps<TValues, FieldPath<TValues>>,
    fieldState: ControllerFieldState,
  ) => ReactNode;
}

// Label, description and error around one react-hook-form control. The field wrappers
// (TextField, SelectField…) only supply the control itself.
export function FormField<TValues extends FieldValues>({
  control,
  name,
  label,
  description,
  required = false,
  disabled,
  className,
  orientation = "vertical",
  render,
}: FormFieldProps<TValues>) {
  return (
    <Controller
      name={name}
      control={control}
      disabled={disabled}
      render={({ field, fieldState }) => {
        const labelNode = (
          <FieldLabel htmlFor={field.name}>
            {label}
            {required && <span className="font-normal text-muted-foreground">(required)</span>}
          </FieldLabel>
        );

        return (
          <Field data-invalid={fieldState.invalid} orientation={orientation} className={className}>
            {orientation === "horizontal" ? (
              <>
                {render(field, fieldState)}
                {labelNode}
              </>
            ) : (
              <>
                {labelNode}
                {render(field, fieldState)}
              </>
            )}
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}

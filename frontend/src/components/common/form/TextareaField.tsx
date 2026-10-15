import type { FieldValues } from "react-hook-form";
import { Textarea } from "@/components/ui";
import { FormField, type BaseFieldProps } from "./FormField";

export type TextareaFieldProps<TValues extends FieldValues> = BaseFieldProps<TValues> & {
  placeholder?: string;
  rows?: number;
};

export function TextareaField<TValues extends FieldValues>({
  placeholder,
  rows = 4,
  ...fieldProps
}: TextareaFieldProps<TValues>) {
  return (
    <FormField
      {...fieldProps}
      render={(field, fieldState) => (
        <Textarea
          {...field}
          value={field.value ?? ""}
          id={field.name}
          placeholder={placeholder}
          rows={rows}
          required={fieldProps.required}
          aria-invalid={fieldState.invalid}
        />
      )}
    />
  );
}

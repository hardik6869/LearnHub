import type { FieldValues } from "react-hook-form";
import { Checkbox } from "@/components/ui";
import { FormField, type BaseFieldProps } from "./FormField";

// A single boolean: <CheckboxField control={form.control} name="housing" label="Housing" />
export function CheckboxField<TValues extends FieldValues>(props: BaseFieldProps<TValues>) {
  return (
    <FormField
      {...props}
      orientation="horizontal"
      render={(field, fieldState) => (
        <Checkbox
          ref={field.ref}
          id={field.name}
          name={field.name}
          checked={field.value === true}
          onCheckedChange={(checked) => field.onChange(checked === true)}
          onBlur={field.onBlur}
          disabled={field.disabled}
          aria-invalid={fieldState.invalid}
        />
      )}
    />
  );
}

import type { FieldValues } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import type { SelectOption } from "@/types";
import { FormField, type BaseFieldProps } from "./FormField";

export type SelectFieldProps<TValues extends FieldValues> = BaseFieldProps<TValues> & {
  options: readonly SelectOption[];
  placeholder?: string;
};

// <SelectField control={form.control} name="role" label="Role" options={ASSIGNABLE_ROLE_OPTIONS} />
export function SelectField<TValues extends FieldValues>({
  options,
  placeholder = "Select…",
  ...fieldProps
}: SelectFieldProps<TValues>) {
  return (
    <FormField
      {...fieldProps}
      render={(field, fieldState) => (
        <Select
          name={field.name}
          value={field.value ?? ""}
          onValueChange={field.onChange}
          disabled={field.disabled}
        >
          <SelectTrigger
            ref={field.ref}
            id={field.name}
            onBlur={field.onBlur}
            aria-invalid={fieldState.invalid}
            className="w-full"
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}

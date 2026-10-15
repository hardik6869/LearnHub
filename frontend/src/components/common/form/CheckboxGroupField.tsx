import { Controller, type FieldValues } from "react-hook-form";
import { Checkbox, Field, FieldError, FieldLabel, FieldLegend, FieldSet } from "@/components/ui";
import type { SelectOption } from "@/types";
import type { BaseFieldProps } from "./FormField";

export type CheckboxGroupFieldProps<TValues extends FieldValues> = BaseFieldProps<TValues> & {
  options: readonly SelectOption[];
};

// Several values from a fixed list, stored as a string array:
// <CheckboxGroupField control={form.control} name="careers" label="Careers" options={CAREER_OPTIONS} />
export function CheckboxGroupField<TValues extends FieldValues>({
  control,
  name,
  label,
  required = false,
  disabled,
  className,
  options,
}: CheckboxGroupFieldProps<TValues>) {
  return (
    <Controller
      name={name}
      control={control}
      disabled={disabled}
      render={({ field, fieldState }) => {
        const selected: readonly string[] = Array.isArray(field.value) ? field.value : [];
        const toggle = (value: string, checked: boolean) => {
          field.onChange(
            checked ? [...selected, value] : selected.filter((item) => item !== value),
          );
        };

        return (
          <FieldSet data-invalid={fieldState.invalid} className={className}>
            <FieldLegend variant="label">
              {label}
              {required && (
                <span className="ml-1 font-normal text-muted-foreground">(required)</span>
              )}
            </FieldLegend>
            <div className="grid gap-3 sm:grid-cols-2">
              {options.map((option) => {
                const id = `${field.name}-${option.value}`;
                return (
                  <Field key={option.value} orientation="horizontal">
                    <Checkbox
                      id={id}
                      checked={selected.includes(option.value)}
                      onCheckedChange={(checked) => toggle(option.value, checked === true)}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldLabel htmlFor={id} className="font-normal">
                      {option.label}
                    </FieldLabel>
                  </Field>
                );
              })}
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldSet>
        );
      }}
    />
  );
}

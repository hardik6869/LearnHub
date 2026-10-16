import type { ComponentProps } from "react";
import type { FieldValues } from "react-hook-form";
import { Input } from "@/components/ui";
import { FormField, type BaseFieldProps } from "./FormField";

type InputProps = Pick<
  ComponentProps<"input">,
  "type" | "placeholder" | "autoComplete" | "inputMode" | "min" | "max" | "step"
>;

export type TextFieldProps<TValues extends FieldValues> = BaseFieldProps<TValues> & InputProps;

// <TextField control={form.control} name="email" label="Email" type="email" required />
export function TextField<TValues extends FieldValues>({
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  min,
  max,
  step,
  ...fieldProps
}: TextFieldProps<TValues>) {
  return (
    <FormField
      {...fieldProps}
      render={(field, fieldState) => (
        <Input
          {...field}
          // Number inputs start empty rather than showing "undefined"
          value={field.value ?? ""}
          id={field.name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          min={min}
          max={max}
          step={step}
          required={fieldProps.required}
          aria-invalid={fieldState.invalid}
        />
      )}
    />
  );
}

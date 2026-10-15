import {
  Field,
  FieldLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { cn } from "@/lib";
import type { SelectOption } from "@/types";

// Radix Select doesn't allow "" as an item value, so this stands for "not set"
const UNSET = "__unset";

interface FilterSelectProps {
  id: string;
  label: string;
  /** Label of the "not set" option, e.g. "All careers" or "Newest" */
  unsetLabel: string;
  value: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
  className?: string;
}

// A labelled select for list filters; "" means "not set"
export function FilterSelect({
  id,
  label,
  unsetLabel,
  value,
  options,
  onChange,
  className,
}: FilterSelectProps) {
  return (
    <Field className={cn("gap-1.5", className)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select value={value || UNSET} onValueChange={(next) => onChange(next === UNSET ? "" : next)}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={UNSET}>{unsetLabel}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

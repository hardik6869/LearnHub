import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { cn } from "@/lib";
import type { SelectOption } from "@/types";

// Radix Select doesn't allow "" as an item value, so this stands for "not set"
const UNSET = "__unset";

interface FilterSelectProps {
  /** Accessible name; not shown, because the selected value ("All careers") says enough */
  label: string;
  /** Label of the "not set" option, e.g. "All careers" or "Newest" */
  unsetLabel: string;
  value: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
  className?: string;
}

// A compact select for the filter bar; "" means "not set"
export function FilterSelect({
  label,
  unsetLabel,
  value,
  options,
  onChange,
  className,
}: FilterSelectProps) {
  return (
    <Select value={value || UNSET} onValueChange={(next) => onChange(next === UNSET ? "" : next)}>
      <SelectTrigger aria-label={label} className={cn("w-auto min-w-36 shrink-0", className)}>
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
  );
}

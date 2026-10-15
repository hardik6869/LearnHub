import {
  Button,
  Field,
  FieldLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { CAREER_OPTIONS } from "@/enums";
import { formatCurrency } from "@/lib";
import type { SelectOption } from "@/types";

// Radix Select doesn't allow "" as an item value, so "any" stands for "no filter"
const ANY = "any";

const MAX_COST_OPTIONS: readonly SelectOption[] = [5_000, 10_000, 15_000, 20_000].map((cost) => ({
  value: String(cost),
  label: `Up to ${formatCurrency(cost)}`,
}));

export interface AcademyFilterValues {
  career: string;
  maxCost: string;
}

interface AcademyFiltersProps {
  values: AcademyFilterValues;
  onChange: (key: keyof AcademyFilterValues, value: string) => void;
  onReset: () => void;
}

interface FilterSelectProps {
  id: string;
  label: string;
  anyLabel: string;
  value: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
}

function FilterSelect({ id, label, anyLabel, value, options, onChange }: FilterSelectProps) {
  return (
    <Field className="sm:w-56">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select value={value || ANY} onValueChange={(next) => onChange(next === ANY ? "" : next)}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>{anyLabel}</SelectItem>
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

export function AcademyFilters({ values, onChange, onReset }: AcademyFiltersProps) {
  const isFiltered = Boolean(values.career || values.maxCost);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <FilterSelect
        id="filter-career"
        label="Career"
        anyLabel="All careers"
        value={values.career}
        options={CAREER_OPTIONS}
        onChange={(value) => onChange("career", value)}
      />
      <FilterSelect
        id="filter-cost"
        label="Average cost"
        anyLabel="Any cost"
        value={values.maxCost}
        options={MAX_COST_OPTIONS}
        onChange={(value) => onChange("maxCost", value)}
      />
      {isFiltered && (
        <Button variant="ghost" onClick={onReset} className="sm:mb-0.5">
          Clear filters
        </Button>
      )}
    </div>
  );
}

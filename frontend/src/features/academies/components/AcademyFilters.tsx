import { Button, Checkbox, Field, FieldLabel, FieldLegend, FieldSet } from "@/components/ui";
import { CAREER_OPTIONS } from "@/enums";
import { formatCurrency } from "@/lib";
import type { SelectOption } from "@/types";
import type { AcademyFilterKey, AcademyFilterValues } from "../hooks/useAcademyListParams";
import { FilterSelect } from "./FilterSelect";

const MAX_COST_OPTIONS: readonly SelectOption[] = [5_000, 10_000, 15_000, 20_000].map((cost) => ({
  value: String(cost),
  label: `Up to ${formatCurrency(cost)}`,
}));

const MIN_RATING_OPTIONS: readonly SelectOption[] = [6, 7, 8, 9].map((rating) => ({
  value: String(rating),
  label: `${String(rating)}+ / 10`,
}));

const FEATURES: readonly { key: AcademyFilterKey; label: string }[] = [
  { key: "housing", label: "Housing" },
  { key: "jobAssistance", label: "Job assistance" },
  { key: "jobGuarantee", label: "Job guarantee" },
  { key: "acceptGi", label: "Accepts GI Bill" },
];

interface AcademyFiltersProps {
  values: AcademyFilterValues;
  onChange: (key: AcademyFilterKey, value: string) => void;
  onReset: () => void;
  isFiltered: boolean;
  /** Prefix for element ids; the panel renders in the sidebar and the mobile sheet */
  idPrefix: string;
}

// The filter panel: desktop sidebar and mobile sheet
export function AcademyFilters({
  values,
  onChange,
  onReset,
  isFiltered,
  idPrefix,
}: AcademyFiltersProps) {
  return (
    <div className="space-y-5">
      <FilterSelect
        id={`${idPrefix}-career`}
        label="Career"
        unsetLabel="All careers"
        value={values.career}
        options={CAREER_OPTIONS}
        onChange={(value) => onChange("career", value)}
      />
      <FilterSelect
        id={`${idPrefix}-cost`}
        label="Average cost"
        unsetLabel="Any cost"
        value={values.maxCost}
        options={MAX_COST_OPTIONS}
        onChange={(value) => onChange("maxCost", value)}
      />
      <FilterSelect
        id={`${idPrefix}-rating`}
        label="Rating"
        unsetLabel="Any rating"
        value={values.minRating}
        options={MIN_RATING_OPTIONS}
        onChange={(value) => onChange("minRating", value)}
      />
      <FieldSet className="gap-3">
        <FieldLegend variant="label">Features</FieldLegend>
        {FEATURES.map(({ key, label }) => {
          const id = `${idPrefix}-${key}`;
          return (
            <Field key={key} orientation="horizontal">
              <Checkbox
                id={id}
                checked={values[key] === "true"}
                onCheckedChange={(checked) => onChange(key, checked === true ? "true" : "")}
              />
              <FieldLabel htmlFor={id} className="font-normal">
                {label}
              </FieldLabel>
            </Field>
          );
        })}
      </FieldSet>
      {isFiltered && (
        <Button variant="outline" onClick={onReset} className="w-full">
          Clear all filters
        </Button>
      )}
    </div>
  );
}

import { X } from "lucide-react";
import { Button } from "@/components/ui";
import { CAREER_OPTIONS } from "@/enums";
import { formatCurrency } from "@/lib";
import type { SelectOption } from "@/types";
import type { AcademyFilterKey, AcademyFilterValues } from "../hooks/useAcademyListParams";
import { FeaturesFilter } from "./FeaturesFilter";
import { FilterSelect } from "./FilterSelect";

const MAX_COST_OPTIONS: readonly SelectOption[] = [5_000, 10_000, 15_000, 20_000].map((cost) => ({
  value: String(cost),
  label: `Up to ${formatCurrency(cost)}`,
}));

const MIN_RATING_OPTIONS: readonly SelectOption[] = [6, 7, 8, 9].map((rating) => ({
  value: String(rating),
  label: `Rating ${String(rating)}+`,
}));

interface AcademyFiltersProps {
  values: AcademyFilterValues;
  onChange: (key: AcademyFilterKey, value: string) => void;
  onReset: () => void;
  isFiltered: boolean;
}

// The filter controls. `contents` makes them items of the parent's toolbar row, which decides
// whether they scroll sideways (phones) or wrap (wider screens).
export function AcademyFilters({ values, onChange, onReset, isFiltered }: AcademyFiltersProps) {
  return (
    <div className="contents">
      <FilterSelect
        label="Career"
        unsetLabel="All careers"
        value={values.career}
        options={CAREER_OPTIONS}
        onChange={(value) => onChange("career", value)}
      />
      <FilterSelect
        label="Average cost"
        unsetLabel="Any cost"
        value={values.maxCost}
        options={MAX_COST_OPTIONS}
        onChange={(value) => onChange("maxCost", value)}
      />
      <FilterSelect
        label="Minimum rating"
        unsetLabel="Any rating"
        value={values.minRating}
        options={MIN_RATING_OPTIONS}
        onChange={(value) => onChange("minRating", value)}
      />
      <FeaturesFilter values={values} onChange={onChange} />
      {isFiltered && (
        <Button variant="ghost" onClick={onReset} className="shrink-0">
          <X aria-hidden />
          Clear
        </Button>
      )}
    </div>
  );
}

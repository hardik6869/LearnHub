import { ChevronDown } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui";
import type { AcademyFilterKey, AcademyFilterValues } from "../hooks/useAcademyListParams";

const FEATURES: readonly { key: AcademyFilterKey; label: string }[] = [
  { key: "housing", label: "Housing" },
  { key: "jobAssistance", label: "Job assistance" },
  { key: "jobGuarantee", label: "Job guarantee" },
  { key: "acceptGi", label: "Accepts GI Bill" },
];

interface FeaturesFilterProps {
  values: AcademyFilterValues;
  onChange: (key: AcademyFilterKey, value: string) => void;
}

// The four yes/no features in one dropdown; it stays open so several can be ticked
export function FeaturesFilter({ values, onChange }: FeaturesFilterProps) {
  const selected = FEATURES.filter(({ key }) => values[key] === "true").length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="shrink-0 border-input font-normal">
          Features{selected > 0 && ` (${String(selected)})`}
          <ChevronDown className="text-muted-foreground" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        {FEATURES.map(({ key, label }) => (
          <DropdownMenuCheckboxItem
            key={key}
            checked={values[key] === "true"}
            onCheckedChange={(checked) => onChange(key, checked ? "true" : "")}
            onSelect={(event) => event.preventDefault()}
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

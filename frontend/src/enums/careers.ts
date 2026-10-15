import type { SelectOption } from "@/types";

// Mirrors CAREERS in backend/src/config/enums.ts — keep the values identical
export const CAREERS = [
  "Web Development",
  "Mobile Development",
  "UI/UX",
  "Data Science",
  "Business",
  "Other",
] as const;

export type Career = (typeof CAREERS)[number];

export const CAREER_OPTIONS: readonly SelectOption<Career>[] = CAREERS.map((career) => ({
  value: career,
  label: career,
}));

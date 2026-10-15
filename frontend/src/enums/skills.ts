import type { SelectOption } from "@/types";

// Mirrors MINIMUM_SKILLS in backend/src/config/enums.ts — keep the values identical
export const MINIMUM_SKILLS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

export type MinimumSkill = (typeof MINIMUM_SKILLS)[keyof typeof MINIMUM_SKILLS];

export const MINIMUM_SKILL_LABELS: Record<MinimumSkill, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const MINIMUM_SKILL_OPTIONS: readonly SelectOption<MinimumSkill>[] = Object.values(
  MINIMUM_SKILLS,
).map((skill) => ({ value: skill, label: MINIMUM_SKILL_LABELS[skill] }));

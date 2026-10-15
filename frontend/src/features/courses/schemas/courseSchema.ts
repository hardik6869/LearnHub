import { z } from "zod";
import { MINIMUM_SKILLS } from "@/enums";
import type { Course, CoursePayload } from "@/types";

// Mirrors backend/src/models/Course.ts. Number inputs give strings, so weeks and tuition are
// validated as digit strings here and converted in toCoursePayload.
export const courseSchema = z.object({
  title: z.string().trim().min(1, "Enter a title"),
  description: z.string().trim().min(1, "Enter a description"),
  weeks: z.string().regex(/^[1-9]\d{0,2}$/, "Enter the number of weeks (1–999)"),
  tuition: z.string().regex(/^\d{1,7}$/, "Enter the tuition in whole dollars"),
  minimumSkill: z.enum(MINIMUM_SKILLS, "Choose a skill level"),
  scholarhipsAvailable: z.boolean(),
});

export type CourseFormValues = z.infer<typeof courseSchema>;

export const toCourseFormValues = (course?: Course): CourseFormValues => ({
  title: course?.title ?? "",
  description: course?.description ?? "",
  weeks: course?.weeks ?? "",
  tuition: course ? String(course.tuition) : "",
  minimumSkill: course?.minimumSkill ?? MINIMUM_SKILLS.BEGINNER,
  scholarhipsAvailable: course?.scholarhipsAvailable ?? false,
});

export const toCoursePayload = (values: CourseFormValues): CoursePayload => ({
  ...values,
  tuition: Number(values.tuition),
});

import type { Id, ListParams } from "@/types";

// Hierarchical keys so one invalidation covers a whole entity:
// invalidateQueries({ queryKey: queryKeys.academies.all }) refreshes every academy list and detail
const entityKeys = <TName extends string>(name: TName) => {
  const all = [name] as const;
  return {
    all,
    lists: () => [...all, "list"] as const,
    list: (params: ListParams = {}) => [...all, "list", params] as const,
    details: () => [...all, "detail"] as const,
    detail: (id: Id) => [...all, "detail", id] as const,
  };
};

const academies = entityKeys("academies");
const courses = entityKeys("courses");
const reviews = entityKeys("reviews");

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  academies,
  // Under "academies" on purpose: academy, course and review mutations all invalidate
  // academies.all, which then refreshes the dashboard KPIs too
  stats: [...academies.all, "stats"] as const,
  courses: {
    ...courses,
    byAcademy: (academyId: Id, params: ListParams = {}) =>
      [...courses.all, "academy", academyId, params] as const,
  },
  reviews: {
    ...reviews,
    byAcademy: (academyId: Id, params: ListParams = {}) =>
      [...reviews.all, "academy", academyId, params] as const,
  },
  users: entityKeys("users"),
} as const;

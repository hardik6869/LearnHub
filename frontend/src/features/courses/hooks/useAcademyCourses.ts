import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import type { Id, ListParams } from "@/types";
import { getAcademyCourses } from "../api/coursesApi";

// An academy has a handful of courses, so they load in one request without pagination
const PARAMS: ListParams = { limit: 100, sort: "title" };

export function useAcademyCourses(academyId: Id) {
  return useQuery({
    queryKey: queryKeys.courses.byAcademy(academyId, PARAMS),
    queryFn: () => getAcademyCourses(academyId, PARAMS),
  });
}

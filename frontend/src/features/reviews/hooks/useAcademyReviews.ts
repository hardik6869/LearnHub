import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import type { Id, ListParams } from "@/types";
import { getAcademyReviews } from "../api/reviewsApi";

// Newest first, in one request: enough for this app's academies, and it lets the page tell
// whether the signed-in user has already reviewed (one review per user per academy)
const PARAMS: ListParams = { limit: 100, sort: "-createdAt" };

export function useAcademyReviews(academyId: Id) {
  return useQuery({
    queryKey: queryKeys.reviews.byAcademy(academyId, PARAMS),
    queryFn: () => getAcademyReviews(academyId, PARAMS),
  });
}

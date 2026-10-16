import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import type { Id, ListParams } from "@/types";
import { getReviews } from "../api/reviewsApi";

// One author's reviews, newest first (each includes its academy's name)
export function useUserReviews(userId: Id) {
  const params: ListParams = { user: userId, limit: 100, sort: "-createdAt" };
  return useQuery({
    queryKey: queryKeys.reviews.list(params),
    queryFn: () => getReviews(params),
  });
}

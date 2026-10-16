import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/constants";
import type { Id, ReviewPayload } from "@/types";
import * as reviewsApi from "../api/reviewsApi";

// A review change also changes its academy's average rating, so academies refresh too
const useInvalidateReviews = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.academies.all }),
    ]);
};

export function useCreateReview(academyId: Id) {
  const invalidate = useInvalidateReviews();
  return useMutation({
    mutationFn: (payload: ReviewPayload) => reviewsApi.createReview(academyId, payload),
    onSuccess: async () => {
      await invalidate();
      toast.success("Thanks for your review!");
    },
  });
}

export function useUpdateReview() {
  const invalidate = useInvalidateReviews();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Id; payload: ReviewPayload }) =>
      reviewsApi.updateReview(id, payload),
    onSuccess: async () => {
      await invalidate();
      toast.success("Review updated");
    },
  });
}

export function useDeleteReview() {
  const invalidate = useInvalidateReviews();
  return useMutation({
    mutationFn: reviewsApi.deleteReview,
    onSuccess: async () => {
      await invalidate();
      toast.success("Review deleted");
    },
  });
}

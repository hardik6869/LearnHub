import { z } from "zod";
import type { Review, ReviewPayload, SelectOption } from "@/types";

// Mirrors backend/src/models/Review.ts. The rating comes from a select (a string), so it is
// validated as "1"–"10" here and converted in toReviewPayload.
export const reviewSchema = z.object({
  title: z.string().trim().min(1, "Enter a title").max(100, "Title must be at most 100 characters"),
  text: z.string().trim().min(1, "Write your review"),
  rating: z.string().regex(/^(10|[1-9])$/, "Choose a rating from 1 to 10"),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

// Best first, so the most common choices are at the top
export const RATING_OPTIONS: readonly SelectOption[] = Array.from({ length: 10 }, (_, index) => {
  const rating = String(10 - index);
  return { value: rating, label: `${rating} / 10` };
});

export const toReviewFormValues = (review?: Review): ReviewFormValues => ({
  title: review?.title ?? "",
  text: review?.text ?? "",
  rating: review ? String(review.rating) : "",
});

export const toReviewPayload = (values: ReviewFormValues): ReviewPayload => ({
  ...values,
  rating: Number(values.rating),
});

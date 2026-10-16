import { MessageSquare, PenLine } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ConfirmDialog,
  EmptyState,
  ErrorState,
  FormDialog,
  LoadingState,
} from "@/components/common";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants";
import { canManage, hasRole, REVIEWER_ROLES, useCurrentUser } from "@/features/auth";
import { cn, getGridColumns } from "@/lib";
import type { Academy, Review } from "@/types";
import { useAcademyReviews } from "../hooks/useAcademyReviews";
import { useCreateReview, useDeleteReview, useUpdateReview } from "../hooks/useReviewMutations";
import {
  toReviewFormValues,
  toReviewPayload,
  type ReviewFormValues,
} from "../schemas/reviewSchema";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";

// "new" opens the write dialog; a review opens the edit dialog
type Editing = Review | "new" | null;

const getAuthorId = (review: Review) =>
  typeof review.user === "string" ? review.user : review.user._id;

// The reviews section of the academy page: list, a "Write a review" button for students and
// admins who haven't reviewed yet, and edit/delete for the author or an admin.
export function ReviewList({ academy }: { academy: Academy }) {
  const { user } = useCurrentUser();
  const location = useLocation();
  const { data, isPending, isError, refetch } = useAcademyReviews(academy._id);
  const createReview = useCreateReview(academy._id);
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const [editing, setEditing] = useState<Editing>(null);
  const [deleting, setDeleting] = useState<Review | null>(null);
  const isNew = editing === "new";
  const editingReview = editing === "new" || editing === null ? undefined : editing;

  // One review per user per academy (the API enforces it too)
  const hasReviewed = Boolean(
    user && data?.data.some((review) => getAuthorId(review) === user._id),
  );
  const canWrite = hasRole(user, REVIEWER_ROLES) && !hasReviewed;

  // Stable callbacks so memoised ReviewCards don't re-render when a dialog opens
  const handleEdit = useCallback((review: Review) => setEditing(review), []);
  const handleDelete = useCallback((review: Review) => setDeleting(review), []);

  const handleSubmit = (values: ReviewFormValues) => {
    const payload = toReviewPayload(values);
    const close = { onSuccess: () => setEditing(null) };
    if (isNew) createReview.mutate(payload, close);
    else if (editingReview) updateReview.mutate({ id: editingReview._id, payload }, close);
  };

  const confirmDelete = () => {
    if (deleting) deleteReview.mutate(deleting._id, { onSuccess: () => setDeleting(null) });
  };

  const renderAction = () => {
    if (!user) {
      const redirect = encodeURIComponent(location.pathname);
      return (
        <Button variant="outline" size="sm" asChild>
          <Link to={`${ROUTES.login}?redirect=${redirect}`}>Log in to review</Link>
        </Button>
      );
    }
    if (!canWrite) return null;
    return (
      <Button variant="outline" size="sm" onClick={() => setEditing("new")}>
        <PenLine aria-hidden />
        Write a review
      </Button>
    );
  };

  const renderReviews = () => {
    if (isPending) return <LoadingState variant="list" count={2} label="Loading reviews…" />;
    if (isError) {
      return <ErrorState message="We couldn't load the reviews." onRetry={() => void refetch()} />;
    }
    if (data.data.length === 0) {
      return (
        <EmptyState
          icon={MessageSquare}
          title="No reviews yet"
          description="Studied here? Be the first to share your experience."
        />
      );
    }
    // Reviews are text-heavy, so at most two per row
    return (
      <ul className={cn("grid grid-cols-1 gap-4", getGridColumns(data.data.length, 2))}>
        {data.data.map((review) => (
          <li key={review._id}>
            <ReviewCard
              review={review}
              canEdit={canManage(user, review)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section aria-labelledby="reviews-heading" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 id="reviews-heading" className="text-lg font-semibold">
          Reviews{data && data.count > 0 && ` (${String(data.count)})`}
        </h2>
        {renderAction()}
      </div>

      {renderReviews()}

      <FormDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        title={isNew ? "Write a review" : "Edit review"}
        description={academy.name}
      >
        <ReviewForm
          defaultValues={toReviewFormValues(editingReview)}
          onSubmit={handleSubmit}
          isPending={createReview.isPending || updateReview.isPending}
          submitLabel={isNew ? "Post review" : "Save changes"}
        />
      </FormDialog>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete your review?"
        description="This can't be undone."
        confirmLabel="Delete review"
        destructive
        isPending={deleteReview.isPending}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

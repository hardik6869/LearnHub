import { MessageSquare } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { EmptyState, ErrorState, LoadingState } from "@/components/common";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants";
import { ReviewCard, useUserReviews } from "@/features/reviews";
import { cn, formatDate, getGridColumns } from "@/lib";
import type { Review, User } from "@/types";

// "Academy name · date"; the list endpoint populates the academy. Reviews are edited on the
// academy page, which the name links to.
const renderSubtitle = (review: Review): ReactNode => {
  const date = formatDate(review.createdAt);
  if (typeof review.academy === "string") return date;
  return (
    <>
      <Link
        to={ROUTES.academyDetail(review.academy._id)}
        className="font-medium text-foreground underline"
      >
        {review.academy.name}
      </Link>{" "}
      · {date}
    </>
  );
};

export function MyReviews({ user }: { user: User }) {
  const { data, isPending, isError, refetch } = useUserReviews(user._id);
  const count = data?.data.length ?? 0;

  const renderContent = () => {
    if (isPending) return <LoadingState variant="list" count={2} label="Loading your reviews…" />;
    if (isError) return <ErrorState onRetry={() => void refetch()} />;
    if (count === 0) {
      return (
        <EmptyState
          icon={MessageSquare}
          title="You haven't written any reviews yet"
          description="Find an academy you studied at and share your experience."
          action={
            <Button asChild>
              <Link to={ROUTES.academies}>Browse academies</Link>
            </Button>
          }
        />
      );
    }
    return (
      <ul className={cn("grid grid-cols-1 gap-4", getGridColumns(count, 2))}>
        {data.data.map((review) => (
          <li key={review._id}>
            <ReviewCard review={review} subtitle={renderSubtitle(review)} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section aria-labelledby="my-reviews-heading" className="space-y-4">
      <h2 id="my-reviews-heading" className="text-lg font-semibold">
        My reviews{count > 0 && ` (${String(count)})`}
      </h2>
      {renderContent()}
    </section>
  );
}

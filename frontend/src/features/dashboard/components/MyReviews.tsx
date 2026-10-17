import { MessageSquare } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { EmptyState, ErrorState, LoadingState, PageHeader } from "@/components/common";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants";
import { ReviewCard, useUserReviews } from "@/features/reviews";
import { formatDate, REVIEW_GRID } from "@/lib";
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

// The user's reviews, with the page header
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
      <ul className={REVIEW_GRID}>
        {data.data.map((review) => (
          <li key={review._id}>
            <ReviewCard review={review} subtitle={renderSubtitle(review)} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <PageHeader
        title={count > 0 ? `My reviews (${String(count)})` : "My reviews"}
        description="To edit or delete a review, open its academy."
      />
      {renderContent()}
    </>
  );
}

import { Pencil, Star, Trash2 } from "lucide-react";
import { memo, type ReactNode } from "react";
import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { formatDate } from "@/lib";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
  /** Replaces the "author · date" line, e.g. with the academy on the dashboard */
  subtitle?: ReactNode;
  /** Shows Edit and Delete (the author or an admin) */
  canEdit?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (review: Review) => void;
}

// The list endpoint populates the author's name; a freshly created review only has the id
const getAuthorName = (review: Review): string =>
  typeof review.user === "string" ? "A student" : review.user.name;

export const ReviewCard = memo(function ReviewCard({
  review,
  subtitle,
  canEdit = false,
  onEdit,
  onDelete,
}: ReviewCardProps) {
  return (
    <Card className="h-full gap-3">
      <CardHeader>
        <CardTitle>
          <h3>{review.title}</h3>
        </CardTitle>
        <CardDescription>
          {subtitle ?? `${getAuthorName(review)} · ${formatDate(review.createdAt)}`}
        </CardDescription>
        {canEdit && (
          <CardAction className="-my-1 flex gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit?.(review)}
              aria-label={`Edit review "${review.title}"`}
            >
              <Pencil aria-hidden />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete?.(review)}
              aria-label={`Delete review "${review.title}"`}
            >
              <Trash2 aria-hidden />
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <Badge variant="secondary">
          <Star aria-hidden />
          {review.rating} / 10
        </Badge>
        <p className="text-sm leading-relaxed whitespace-pre-line">{review.text}</p>
      </CardContent>
    </Card>
  );
});

import { CalendarDays, GraduationCap, Pencil, Trash2, Wallet } from "lucide-react";
import { memo } from "react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { MINIMUM_SKILL_LABELS } from "@/enums";
import { formatCurrency } from "@/lib";
import type { Course } from "@/types";

interface CourseCardProps {
  course: Course;
  /** Shows Edit and Delete (the owner or an admin) */
  canEdit: boolean;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

export const CourseCard = memo(function CourseCard({
  course,
  canEdit,
  onEdit,
  onDelete,
}: CourseCardProps) {
  return (
    <Card className="gap-3 py-4">
      <CardHeader className="flex items-start justify-between gap-2 px-4">
        <CardTitle className="text-base">
          <h3>{course.title}</h3>
        </CardTitle>
        {canEdit && (
          <div className="-my-1 flex shrink-0 gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(course)}
              aria-label={`Edit ${course.title}`}
            >
              <Pencil aria-hidden />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(course)}
              aria-label={`Delete ${course.title}`}
            >
              <Trash2 aria-hidden />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3 px-4">
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <li className="flex items-center gap-1">
            <CalendarDays className="size-4 text-muted-foreground" aria-hidden />
            {course.weeks} weeks
          </li>
          <li className="flex items-center gap-1">
            <Wallet className="size-4 text-muted-foreground" aria-hidden />
            {formatCurrency(course.tuition)}
          </li>
          <li className="flex items-center gap-1">
            <GraduationCap className="size-4 text-muted-foreground" aria-hidden />
            {MINIMUM_SKILL_LABELS[course.minimumSkill]}
          </li>
        </ul>
        <p className="line-clamp-3 text-sm text-muted-foreground">{course.description}</p>
        {course.scholarhipsAvailable && <Badge variant="secondary">Scholarships available</Badge>}
      </CardContent>
    </Card>
  );
});

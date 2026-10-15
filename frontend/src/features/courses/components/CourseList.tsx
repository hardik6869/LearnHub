import { BookOpen, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import {
  ConfirmDialog,
  EmptyState,
  ErrorState,
  FormDialog,
  LoadingState,
} from "@/components/common";
import { Button } from "@/components/ui";
import { canManage, useCurrentUser } from "@/features/auth";
import type { Academy, Course } from "@/types";
import { useAcademyCourses } from "../hooks/useAcademyCourses";
import { useCreateCourse, useDeleteCourse, useUpdateCourse } from "../hooks/useCourseMutations";
import {
  toCourseFormValues,
  toCoursePayload,
  type CourseFormValues,
} from "../schemas/courseSchema";
import { CourseCard } from "./CourseCard";
import { CourseForm } from "./CourseForm";

// "new" opens the add dialog; a course opens the edit dialog
type Editing = Course | "new" | null;

// The courses section of the academy page: list, plus add/edit/delete for the owner or an admin.
// One form dialog and one confirm dialog serve every course.
export function CourseList({ academy }: { academy: Academy }) {
  const { user } = useCurrentUser();
  const { data, isPending, isError, refetch } = useAcademyCourses(academy._id);
  const createCourse = useCreateCourse(academy._id);
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const [editing, setEditing] = useState<Editing>(null);
  const [deleting, setDeleting] = useState<Course | null>(null);
  const canAdd = canManage(user, academy);
  const isNew = editing === "new";
  const editingCourse = editing === "new" || editing === null ? undefined : editing;

  // Stable callbacks so memoised CourseCards don't re-render when a dialog opens
  const handleEdit = useCallback((course: Course) => setEditing(course), []);
  const handleDelete = useCallback((course: Course) => setDeleting(course), []);

  const handleSubmit = (values: CourseFormValues) => {
    const payload = toCoursePayload(values);
    const close = { onSuccess: () => setEditing(null) };
    if (isNew) createCourse.mutate(payload, close);
    else if (editingCourse) updateCourse.mutate({ id: editingCourse._id, payload }, close);
  };

  const confirmDelete = () => {
    if (deleting) deleteCourse.mutate(deleting._id, { onSuccess: () => setDeleting(null) });
  };

  const renderCourses = () => {
    if (isPending) return <LoadingState variant="list" count={2} label="Loading courses…" />;
    if (isError) {
      return <ErrorState message="We couldn't load the courses." onRetry={() => void refetch()} />;
    }
    if (data.data.length === 0) {
      return (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          description={canAdd ? "Add the first course for this academy." : undefined}
        />
      );
    }
    return (
      <ul className="grid gap-4 md:grid-cols-2">
        {data.data.map((course) => (
          <li key={course._id}>
            <CourseCard
              course={course}
              canEdit={canManage(user, course)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section aria-labelledby="courses-heading" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 id="courses-heading" className="text-lg font-semibold">
          Courses{data && data.count > 0 && ` (${String(data.count)})`}
        </h2>
        {canAdd && (
          <Button variant="outline" size="sm" onClick={() => setEditing("new")}>
            <Plus aria-hidden />
            Add course
          </Button>
        )}
      </div>

      {renderCourses()}

      <FormDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        title={isNew ? "Add course" : "Edit course"}
        description={academy.name}
      >
        <CourseForm
          defaultValues={toCourseFormValues(editingCourse)}
          onSubmit={handleSubmit}
          isPending={createCourse.isPending || updateCourse.isPending}
          submitLabel={isNew ? "Add course" : "Save changes"}
        />
      </FormDialog>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete ${deleting?.title ?? "course"}?`}
        description="This can't be undone."
        confirmLabel="Delete course"
        destructive
        isPending={deleteCourse.isPending}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/constants";
import type { CoursePayload, Id } from "@/types";
import * as coursesApi from "../api/coursesApi";

// A course change also changes its academy's average cost, so academies refresh too
const useInvalidateCourses = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.academies.all }),
    ]);
};

export function useCreateCourse(academyId: Id) {
  const invalidate = useInvalidateCourses();
  return useMutation({
    mutationFn: (payload: CoursePayload) => coursesApi.createCourse(academyId, payload),
    onSuccess: async () => {
      await invalidate();
      toast.success("Course added");
    },
  });
}

export function useUpdateCourse() {
  const invalidate = useInvalidateCourses();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Id; payload: CoursePayload }) =>
      coursesApi.updateCourse(id, payload),
    onSuccess: async () => {
      await invalidate();
      toast.success("Course updated");
    },
  });
}

export function useDeleteCourse() {
  const invalidate = useInvalidateCourses();
  return useMutation({
    mutationFn: coursesApi.deleteCourse,
    onSuccess: async () => {
      await invalidate();
      toast.success("Course deleted");
    },
  });
}

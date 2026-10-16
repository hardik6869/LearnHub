import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/constants";
import type { AcademyPayload, Id } from "@/types";
import * as academiesApi from "../api/academiesApi";

// Every academy change refreshes all academy lists and details
const useInvalidateAcademies = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.academies.all });
};

export function useCreateAcademy() {
  const invalidate = useInvalidateAcademies();
  return useMutation({
    mutationFn: academiesApi.createAcademy,
    onSuccess: async () => {
      await invalidate();
      toast.success("Academy created");
    },
  });
}

export function useUpdateAcademy(id: Id) {
  const invalidate = useInvalidateAcademies();
  return useMutation({
    mutationFn: (payload: AcademyPayload) => academiesApi.updateAcademy(id, payload),
    onSuccess: async () => {
      await invalidate();
      toast.success("Academy updated");
    },
  });
}

export function useDeleteAcademy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academiesApi.deleteAcademy,
    onSuccess: (_data, id) => {
      // Drop the deleted detail instead of refetching it (it would 404)
      queryClient.removeQueries({ queryKey: queryKeys.academies.detail(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.academies.lists() });
      toast.success("Academy deleted");
    },
  });
}

export function useUploadAcademyPhoto(id: Id) {
  const invalidate = useInvalidateAcademies();
  return useMutation({
    mutationFn: (file: File) => academiesApi.uploadAcademyPhoto(id, file),
    onSuccess: async () => {
      await invalidate();
      toast.success("Photo uploaded");
    },
  });
}

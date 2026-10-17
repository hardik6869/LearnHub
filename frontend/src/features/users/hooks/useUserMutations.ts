import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/constants";
import type { Id, UpdateUserPayload } from "@/types";
import * as usersApi from "../api/usersApi";

const useInvalidateUsers = () => {
  const queryClient = useQueryClient();
  // Stats count users by role
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.stats }),
    ]);
};

export function useCreateUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: async () => {
      await invalidate();
      toast.success("User created");
    },
  });
}

export function useUpdateUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Id; payload: UpdateUserPayload }) =>
      usersApi.updateUser(id, payload),
    onSuccess: async () => {
      await invalidate();
      toast.success("User updated");
    },
  });
}

export function useDeleteUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: async () => {
      await invalidate();
      toast.success("User deleted");
    },
  });
}

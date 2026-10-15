import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/constants";
import type { ResetPasswordPayload } from "@/types";
import * as authApi from "../api/authApi";

// Signing in or out changes what every query may return (owner-only buttons, "my" lists),
// so these mutations refresh the current user. RequireGuest then redirects away from the
// auth pages.
const useRefreshUser = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
};

export function useLogin() {
  const refreshUser = useRefreshUser();
  return useMutation({ mutationFn: authApi.login, onSuccess: refreshUser });
}

export function useRegister() {
  const refreshUser = useRefreshUser();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: async () => {
      await refreshUser();
      toast.success("Welcome to LearnHub!");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.auth.me, null);
      toast.success("You have been logged out");
    },
  });
}

export function useUpdateDetails() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.updateDetails,
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.me, user);
      toast.success("Profile updated");
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: authApi.updatePassword,
    onSuccess: () => toast.success("Password changed"),
  });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: authApi.forgotPassword });
}

export function useResetPassword(token: string) {
  const refreshUser = useRefreshUser();
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authApi.resetPassword(token, payload),
    onSuccess: async () => {
      await refreshUser();
      toast.success("Password reset. You are now signed in.");
    },
  });
}

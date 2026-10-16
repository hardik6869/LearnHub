import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type ApiError, getErrorMessage, isApiError } from "@/api";
import { queryKeys, STALE_TIME_MS } from "@/constants";

declare module "@tanstack/react-query" {
  interface Register {
    // Every rejected request is normalised to ApiError by the axios client
    defaultError: ApiError;
    mutationMeta: {
      /** Set when the component shows the error itself (e.g. inline form errors) */
      skipErrorToast?: boolean;
    };
  }
}

const MAX_RETRIES = 2;

/**
 * The login cookie expired while the app was open. A 401 alone doesn't prove it (a wrong
 * password or a non-owner also gets 401), so ask the API who is signed in. If nobody is, the
 * cached user becomes null: the header shows "Log in" and RequireAuth sends protected pages to
 * the login page, which returns the user here afterwards.
 */
const handleUnauthorized = async (error: ApiError) => {
  if (!error.isUnauthorized || !queryClient.getQueryData(queryKeys.auth.me)) return;
  await queryClient.refetchQueries({ queryKey: queryKeys.auth.me });
  if (queryClient.getQueryData(queryKeys.auth.me) === null) {
    // A fixed id, so several failed requests show one toast
    toast.info("Your session has expired. Please log in again.", { id: "session-expired" });
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_MS,
      refetchOnWindowFocus: false,
      // 4xx (not found, unauthorised, validation) won't succeed on retry; network/5xx might
      retry: (failureCount, error) =>
        !(isApiError(error) && error.isClientError) && failureCount < MAX_RETRIES,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => void handleUnauthorized(error),
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _onMutateResult, mutation) => {
      void handleUnauthorized(error);
      if (mutation.meta?.skipErrorToast) return;
      toast.error(getErrorMessage(error));
    },
  }),
});

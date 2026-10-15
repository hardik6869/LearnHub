import { MutationCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type ApiError, getErrorMessage, isApiError } from "@/api";
import { STALE_TIME_MS } from "@/constants";

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
  mutationCache: new MutationCache({
    onError: (error, _variables, _onMutateResult, mutation) => {
      if (mutation.meta?.skipErrorToast) return;
      toast.error(getErrorMessage(error));
    },
  }),
});

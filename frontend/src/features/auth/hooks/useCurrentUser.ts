import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import type { User } from "@/types";
import { getMe } from "../api/authApi";

interface CurrentUser {
  /** null when signed out */
  user: User | null;
  /** true only until the first check of the session finishes */
  isLoading: boolean;
}

// The signed-in user, shared by every component through the query cache. Login, logout and
// profile updates write to this cache entry, so it is never refetched on its own.
export function useCurrentUser(): CurrentUser {
  const { data, isPending } = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: getMe,
    staleTime: Infinity,
  });

  return { user: data ?? null, isLoading: isPending };
}

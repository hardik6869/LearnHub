import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import type { ListParams } from "@/types";
import { getUsers } from "../api/usersApi";

export function useUsers(params: ListParams) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
  });
}

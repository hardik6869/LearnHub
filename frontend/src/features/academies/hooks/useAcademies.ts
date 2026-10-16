import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import type { Id, ListParams } from "@/types";
import { getAcademies, getAcademy } from "../api/academiesApi";

export function useAcademies(params: ListParams) {
  return useQuery({
    queryKey: queryKeys.academies.list(params),
    queryFn: () => getAcademies(params),
    placeholderData: keepPreviousData,
  });
}

export function useAcademy(id: Id) {
  return useQuery({
    queryKey: queryKeys.academies.detail(id),
    queryFn: () => getAcademy(id),
  });
}

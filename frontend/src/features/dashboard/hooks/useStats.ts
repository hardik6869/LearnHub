import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import { getStats } from "../api/statsApi";

export function useStats() {
  return useQuery({ queryKey: queryKeys.stats, queryFn: getStats });
}

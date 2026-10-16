import { useSearchParams } from "react-router";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import type { ListParams } from "@/types";

// Every filter is a string in the URL; "" means "not set". Feature flags are "true" or "".
export interface AcademyFilterValues {
  search: string;
  sort: string;
  career: string;
  maxCost: string;
  minRating: string;
  housing: string;
  jobAssistance: string;
  jobGuarantee: string;
  acceptGi: string;
}

export type AcademyFilterKey = keyof AcademyFilterValues;

const toNumberFilter = (value: string, operator: "lte" | "gte") =>
  value ? { [operator]: Number(value) } : undefined;

const toFlag = (value: string) => (value === "true" ? true : undefined);

/**
 * The academies list state, kept in the URL (?search=…&career=…&page=2) so results can be
 * shared and the back button restores them. Any filter change starts again from page 1.
 */
export function useAcademyListParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const get = (key: AcademyFilterKey) => searchParams.get(key) ?? "";
  const filters: AcademyFilterValues = {
    search: get("search"),
    sort: get("sort"),
    career: get("career"),
    maxCost: get("maxCost"),
    minRating: get("minRating"),
    housing: get("housing"),
    jobAssistance: get("jobAssistance"),
    jobGuarantee: get("jobGuarantee"),
    acceptGi: get("acceptGi"),
  };

  const params: ListParams = {
    page,
    limit: DEFAULT_PAGE_SIZE,
    search: filters.search || undefined,
    sort: filters.sort || undefined,
    careers: filters.career || undefined,
    averageCost: toNumberFilter(filters.maxCost, "lte"),
    averageRating: toNumberFilter(filters.minRating, "gte"),
    housing: toFlag(filters.housing),
    jobAssistance: toFlag(filters.jobAssistance),
    jobGuarantee: toFlag(filters.jobGuarantee),
    acceptGi: toFlag(filters.acceptGi),
  };

  const setFilter = (key: AcademyFilterKey, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete("page");
      return next;
    });
  };

  const setPage = (nextPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(nextPage));
      return next;
    });
  };

  const resetFilters = () => setSearchParams({});

  // Sort only orders the results, so it doesn't count as a filter
  const isFiltered = Object.entries(filters).some(([key, value]) => key !== "sort" && value);

  return { page, filters, params, setFilter, setPage, resetFilters, isFiltered };
}

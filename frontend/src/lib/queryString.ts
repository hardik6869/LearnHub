import type { FilterPrimitive, FilterValue, ListParams } from "@/types";

const appendValue = (
  search: URLSearchParams,
  key: string,
  value: FilterPrimitive | readonly FilterPrimitive[],
) => {
  if (Array.isArray(value)) {
    // Repeated keys become an array on the server: careers[in]=A&careers[in]=B
    for (const item of value) search.append(key, String(item));
  } else {
    search.append(key, String(value));
  }
};

const isOperatorObject = (
  value: FilterValue,
): value is Exclude<FilterValue, FilterPrimitive | readonly FilterPrimitive[]> =>
  typeof value === "object" && !Array.isArray(value);

/**
 * Serialises list params into the bracket syntax the API's "extended" query parser reads:
 * { page: 2, averageCost: { lte: 10000 } } → "page=2&averageCost%5Blte%5D=10000".
 * Empty values are skipped so unset filters never reach the API.
 */
export const toQueryString = (params: ListParams): string => {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;

    if (isOperatorObject(value)) {
      for (const [operator, operand] of Object.entries(value)) {
        appendValue(search, `${key}[${operator}]`, operand);
      }
    } else {
      appendValue(search, key, value);
    }
  }

  return search.toString();
};

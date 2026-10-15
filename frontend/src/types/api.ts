// Response envelopes of the LearnHub API (backend/src/middleware/advancedResult.ts, error.ts)

export interface ApiResponse<TData> {
  success: true;
  data: TData;
}

export interface PageRef {
  page: number;
  limit: number;
}

// The API only says whether a next/previous page exists, not the total number of pages
export interface Pagination {
  next?: PageRef;
  prev?: PageRef;
}

export interface PaginatedResponse<TItem> {
  success: true;
  count: number;
  pagination: Pagination;
  data: TItem[];
}

export interface ApiErrorBody {
  success: false;
  error: string;
}

// Comparison operators accepted by list endpoints: ?averageCost[lte]=10000
export type FilterOperator = "gt" | "gte" | "lt" | "lte" | "in";

export type FilterPrimitive = string | number | boolean;

export type FilterValue =
  | FilterPrimitive
  | readonly FilterPrimitive[]
  | Partial<Record<FilterOperator, FilterPrimitive | readonly FilterPrimitive[]>>;

// Query params for list endpoints; any other key filters on that field
export interface ListParams {
  page?: number;
  limit?: number;
  /** Comma separated, "-" for descending: "-createdAt,name" */
  sort?: string;
  /** Comma separated field names */
  select?: string;
  [field: string]: FilterValue | undefined;
}

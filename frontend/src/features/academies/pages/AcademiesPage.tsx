import { SearchX } from "lucide-react";
import {
  Container,
  DataPagination,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
} from "@/components/common";
import { Button } from "@/components/ui";
import { ACADEMY_MANAGER_ROLES, hasRole, useCurrentUser } from "@/features/auth";
import { useDocumentTitle } from "@/hooks";
import type { SelectOption } from "@/types";
import { AcademyCard } from "../components/AcademyCard";
import { AcademyFilters } from "../components/AcademyFilters";
import { AcademySearch } from "../components/AcademySearch";
import { AddAcademyButton } from "../components/AddAcademyButton";
import { FilterSelect } from "../components/FilterSelect";
import { useAcademies } from "../hooks/useAcademies";
import { useAcademyListParams } from "../hooks/useAcademyListParams";

// API sort values; "" is the API default (newest first)
const SORT_OPTIONS: readonly SelectOption[] = [
  { value: "-averageRating", label: "Highest rated" },
  { value: "averageCost", label: "Lowest cost" },
  { value: "-averageCost", label: "Highest cost" },
  { value: "name", label: "Name (A–Z)" },
];

export function AcademiesPage() {
  useDocumentTitle("Academies");
  const { user } = useCurrentUser();
  const { page, filters, params, setFilter, setPage, resetFilters, isFiltered } =
    useAcademyListParams();
  const { data, isPending, isError, isPlaceholderData, refetch } = useAcademies(params);

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0 });
  };

  const renderResults = () => {
    if (isPending) return <LoadingState count={6} label="Loading academies…" />;
    if (isError) return <ErrorState onRetry={() => void refetch()} />;
    if (data.data.length === 0) {
      return (
        <EmptyState
          icon={SearchX}
          title="No academies found"
          description={
            isFiltered ? "Try a different search or fewer filters." : "No academies yet."
          }
          action={
            isFiltered && (
              <Button variant="outline" onClick={resetFilters}>
                Clear all filters
              </Button>
            )
          }
        />
      );
    }
    return (
      // Dimmed while the next page or filter result loads (the previous results stay visible)
      <div
        className="space-y-8 transition-opacity aria-busy:opacity-60"
        aria-busy={isPlaceholderData}
      >
        {/* 1 column on phones, 2 on tablets, 3 on desktop; 12 per page fills every layout */}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((academy) => (
            <li key={academy._id}>
              <AcademyCard academy={academy} />
            </li>
          ))}
        </ul>
        <DataPagination
          pagination={data.pagination}
          page={page}
          onPageChange={changePage}
          disabled={isPlaceholderData}
        />
      </div>
    );
  };

  return (
    <Container className="space-y-6 py-6">
      <PageHeader
        title="Academies"
        description="Search and compare academies by career, cost, rating and features."
        actions={hasRole(user, ACADEMY_MANAGER_ROLES) && <AddAcademyButton />}
      />

      {/* One toolbar row on desktop; wraps on narrower screens (search gets its own line) */}
      <search className="flex flex-wrap items-center gap-2">
        <AcademySearch value={filters.search} onSearch={(value) => setFilter("search", value)} />
        <AcademyFilters
          values={filters}
          onChange={setFilter}
          onReset={resetFilters}
          isFiltered={isFiltered}
        />
        <FilterSelect
          label="Sort by"
          unsetLabel="Newest first"
          value={filters.sort}
          options={SORT_OPTIONS}
          onChange={(value) => setFilter("sort", value)}
          className="ml-auto"
        />
      </search>

      {renderResults()}
    </Container>
  );
}

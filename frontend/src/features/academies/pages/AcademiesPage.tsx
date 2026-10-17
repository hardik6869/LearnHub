import { SearchX } from "lucide-react";
import {
  Container,
  DataPagination,
  EmptyState,
  ErrorState,
  FilterSelect,
  LoadingState,
  PageHeader,
  SearchInput,
} from "@/components/common";
import { Button } from "@/components/ui";
import { ACADEMY_MANAGER_ROLES, hasRole, useCurrentUser } from "@/features/auth";
import { useDocumentTitle } from "@/hooks";
import { CARD_GRID } from "@/lib";
import type { SelectOption } from "@/types";
import { AcademyCard } from "../components/AcademyCard";
import { AcademyFilters } from "../components/AcademyFilters";
import { AddAcademyButton } from "../components/AddAcademyButton";
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
        <ul className={CARD_GRID}>
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

      {/* Desktop: search, filters and sort in one row (wrapping if needed).
          Phones/tablets: search on top, then one row of filters you swipe sideways; it runs
          edge to edge (-mx/px match Container's padding) so it's clear there's more to scroll. */}
      <search className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
        <SearchInput
          id="academy-search"
          label="Search academies by name"
          value={filters.search}
          onSearch={(value) => setFilter("search", value)}
          className="min-w-full flex-1 md:min-w-64"
        />
        <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 md:contents">
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
            className="md:ml-auto"
          />
        </div>
      </search>

      {renderResults()}
    </Container>
  );
}

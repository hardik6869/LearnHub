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
import { MobileFiltersButton } from "../components/MobileFiltersButton";
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
  const { page, filters, params, setFilter, setPage, resetFilters, panelFilterCount, isFiltered } =
    useAcademyListParams();
  const { data, isPending, isError, isPlaceholderData, refetch } = useAcademies(params);

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0 });
  };

  const renderFilters = (idPrefix: string) => (
    <AcademyFilters
      idPrefix={idPrefix}
      values={filters}
      onChange={setFilter}
      onReset={resetFilters}
      isFiltered={isFiltered}
    />
  );

  const renderResults = () => {
    if (isPending) return <LoadingState count={4} label="Loading academies…" />;
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
        <div className="grid gap-4 sm:grid-cols-2">
          {data.data.map((academy) => (
            <AcademyCard key={academy._id} academy={academy} />
          ))}
        </div>
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
    <Container className="space-y-8 py-8">
      <PageHeader
        title="Academies"
        description="Search and compare academies by career, cost, rating and features."
        actions={hasRole(user, ACADEMY_MANAGER_ROLES) && <AddAcademyButton />}
      />

      <div className="grid gap-8 lg:grid-cols-[15rem_1fr]">
        <aside aria-label="Filters" className="hidden lg:block">
          {renderFilters("sidebar")}
        </aside>

        <section aria-label="Results" className="min-w-0 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <AcademySearch
              value={filters.search}
              onSearch={(value) => setFilter("search", value)}
            />
            <div className="flex items-end gap-3">
              <MobileFiltersButton count={panelFilterCount}>
                {renderFilters("sheet")}
              </MobileFiltersButton>
              <FilterSelect
                id="academy-sort"
                label="Sort by"
                unsetLabel="Newest"
                value={filters.sort}
                options={SORT_OPTIONS}
                onChange={(value) => setFilter("sort", value)}
                className="flex-1 sm:w-48"
              />
            </div>
          </div>
          {renderResults()}
        </section>
      </div>
    </Container>
  );
}

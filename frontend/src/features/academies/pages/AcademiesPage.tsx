import { SearchX } from "lucide-react";
import { useSearchParams } from "react-router";
import {
  Container,
  DataPagination,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
} from "@/components/common";
import { Button } from "@/components/ui";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { ACADEMY_MANAGER_ROLES, hasRole, useCurrentUser } from "@/features/auth";
import { useDocumentTitle } from "@/hooks";
import { AcademyCard } from "../components/AcademyCard";
import { AddAcademyButton } from "../components/AddAcademyButton";
import { AcademyFilters, type AcademyFilterValues } from "../components/AcademyFilters";
import { useAcademies } from "../hooks/useAcademies";

// Filters and page live in the URL (?career=…&maxCost=…&page=2), so results can be shared
// and the back button restores them
export function AcademiesPage() {
  useDocumentTitle("Academies");
  const { user } = useCurrentUser();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const filters: AcademyFilterValues = {
    career: searchParams.get("career") ?? "",
    maxCost: searchParams.get("maxCost") ?? "",
  };

  const { data, isPending, isError, isPlaceholderData, refetch } = useAcademies({
    page,
    limit: DEFAULT_PAGE_SIZE,
    careers: filters.career || undefined,
    averageCost: filters.maxCost ? { lte: Number(filters.maxCost) } : undefined,
  });

  // Changing a filter starts again from page 1
  const setFilter = (key: keyof AcademyFilterValues, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete("page");
      return next;
    });
  };
  const resetFilters = () => setSearchParams({});
  const setPage = (nextPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(nextPage));
      return next;
    });
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
          description="Try a different career or cost."
          action={
            <Button variant="outline" onClick={resetFilters}>
              Clear filters
            </Button>
          }
        />
      );
    }
    return (
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((academy) => (
            <AcademyCard key={academy._id} academy={academy} />
          ))}
        </div>
        <DataPagination
          pagination={data.pagination}
          page={page}
          onPageChange={setPage}
          disabled={isPlaceholderData}
        />
      </div>
    );
  };

  return (
    <Container className="space-y-8 py-8">
      <PageHeader
        title="Academies"
        description="Compare academies by career path and cost."
        actions={hasRole(user, ACADEMY_MANAGER_ROLES) && <AddAcademyButton />}
      />
      <AcademyFilters values={filters} onChange={setFilter} onReset={resetFilters} />
      {renderResults()}
    </Container>
  );
}

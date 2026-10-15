import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { LoadingState } from "@/components/common";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants";
import type { ListParams } from "@/types";
import { useAcademies } from "../hooks/useAcademies";
import { AcademyCard } from "./AcademyCard";

// Newest first is the API's default order
const PARAMS: ListParams = { limit: 3 };

// Home page teaser. Hidden on error or when there are no academies: the home page should
// never show an error block for optional content.
export function LatestAcademies() {
  const { data, isPending, isError } = useAcademies(PARAMS);
  if (isError || data?.data.length === 0) return null;

  return (
    <section aria-labelledby="latest-heading" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 id="latest-heading" className="text-xl font-semibold tracking-tight">
          Latest academies
        </h2>
        <Button variant="ghost" asChild>
          <Link to={ROUTES.academies}>
            View all
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      </div>
      {isPending ? (
        <LoadingState count={3} label="Loading academies…" />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((academy) => (
            <li key={academy._id}>
              <AcademyCard academy={academy} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

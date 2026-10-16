import { MapPin, Star, Wallet } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router";
import { Badge, Card } from "@/components/ui";
import { ROUTES } from "@/constants";
import { formatCurrency, formatRating } from "@/lib";
import type { Academy } from "@/types";
import { AcademyPhoto } from "./AcademyPhoto";

const MAX_CAREERS_SHOWN = 2;

// Grid item for academies: photo on top, details below; the grid decides how many fit per row.
// The title link stretches over the whole card (after:inset-0), so the card is one link for
// keyboard and screen-reader users.
export const AcademyCard = memo(function AcademyCard({ academy }: { academy: Academy }) {
  const hiddenCareers = academy.careers.length - MAX_CAREERS_SHOWN;

  return (
    <Card className="relative h-full gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md">
      <AcademyPhoto academy={academy} className="aspect-2/1 max-h-56 rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <h2 className="text-base leading-snug font-semibold">
            <Link
              to={ROUTES.academyDetail(academy._id)}
              className="after:absolute after:inset-0 hover:underline"
            >
              {academy.name}
            </Link>
          </h2>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" aria-hidden />
            <span className="min-w-0 truncate">{academy.address}</span>
          </p>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">{academy.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {academy.careers.slice(0, MAX_CAREERS_SHOWN).map((career) => (
            <Badge key={career} variant="secondary">
              {career}
            </Badge>
          ))}
          {hiddenCareers > 0 && <Badge variant="outline">+{hiddenCareers}</Badge>}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3 text-sm">
          <span className="flex items-center gap-1">
            <Star className="size-4" aria-hidden />
            {formatRating(academy.averageRating)}
          </span>
          {academy.averageCost !== undefined && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Wallet className="size-4" aria-hidden />
              {formatCurrency(academy.averageCost)}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
});

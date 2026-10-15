import { MapPin, Star } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { ROUTES } from "@/constants";
import { formatCurrency, formatRating } from "@/lib";
import type { Academy } from "@/types";
import { AcademyPhoto } from "./AcademyPhoto";

const MAX_CAREERS_SHOWN = 3;

// Grid item for academy lists. The title link stretches over the whole card (after:inset-0),
// so the card is one link for keyboard and screen-reader users.
export const AcademyCard = memo(function AcademyCard({ academy }: { academy: Academy }) {
  const hiddenCareers = academy.careers.length - MAX_CAREERS_SHOWN;

  return (
    <Card className="relative gap-4 pt-0 transition-shadow hover:shadow-md">
      <AcademyPhoto academy={academy} className="rounded-b-none" />
      <CardHeader>
        <CardTitle className="text-lg">
          <h2>
            <Link
              to={ROUTES.academyDetail(academy._id)}
              className="after:absolute after:inset-0 hover:underline"
            >
              {academy.name}
            </Link>
          </h2>
        </CardTitle>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden />
          <span className="truncate">{academy.address}</span>
        </p>
      </CardHeader>
      <CardContent className="mt-auto space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {academy.careers.slice(0, MAX_CAREERS_SHOWN).map((career) => (
            <Badge key={career} variant="secondary">
              {career}
            </Badge>
          ))}
          {hiddenCareers > 0 && <Badge variant="outline">+{hiddenCareers} more</Badge>}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1">
            <Star className="size-4" aria-hidden />
            {formatRating(academy.averageRating)}
          </span>
          {academy.averageCost !== undefined && (
            <span className="text-muted-foreground">
              Avg. {formatCurrency(academy.averageCost)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

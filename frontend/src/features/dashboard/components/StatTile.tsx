import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui";

interface StatTileProps {
  label: string;
  value: string;
  icon: LucideIcon;
}

// One KPI: a label, a big number and a decorative icon
export function StatTile({ label, value, icon: Icon }: StatTileProps) {
  return (
    <Card size="sm">
      <CardContent className="space-y-1">
        <div className="flex items-center justify-between gap-2 text-muted-foreground">
          <span className="truncate text-sm">{label}</span>
          <Icon className="size-4 shrink-0" aria-hidden />
        </div>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}

import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { cn, TONE_CHIP_CLASSES, type Tone } from "@/lib";

interface StatTileProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: Tone;
}

// One KPI: a decorative icon chip, a label and a big number
export function StatTile({ label, value, icon: Icon, tone = "primary" }: StatTileProps) {
  return (
    <Card size="sm" className="h-full">
      <CardContent className="flex items-center gap-3">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            TONE_CHIP_CLASSES[tone],
          )}
        >
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold tabular-nums">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

import { SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui";

interface MobileFiltersButtonProps {
  /** Number of active filters, shown on the button */
  count: number;
  /** The filter panel; filters apply immediately, so the sheet needs no "Apply" button */
  children: ReactNode;
}

// Small screens: the filter panel slides in from the side instead of taking up the page
export function MobileFiltersButton({ count, children }: MobileFiltersButtonProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <SlidersHorizontal aria-hidden />
          Filters{count > 0 && ` (${String(count)})`}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Results update as you change filters.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

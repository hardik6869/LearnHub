import { Building2 } from "lucide-react";
import { cn, getPhotoUrl } from "@/lib";
import type { Academy } from "@/types";

interface AcademyPhotoProps {
  academy: Pick<Academy, "name" | "photo">;
  className?: string;
}

// The academy's photo, or a neutral placeholder when it has none
export function AcademyPhoto({ academy, className }: AcademyPhotoProps) {
  const url = getPhotoUrl(academy.photo);

  return (
    <div className={cn("aspect-video overflow-hidden rounded-lg bg-muted", className)}>
      {url ? (
        <img
          src={url}
          alt={academy.name}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground">
          <Building2 className="size-10" aria-hidden />
        </div>
      )}
    </div>
  );
}

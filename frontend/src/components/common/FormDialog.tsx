import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { cn } from "@/lib";

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  /** "lg" for long forms such as the academy form */
  size?: "md" | "lg";
  children: ReactNode;
}

// Modal for create/edit forms. The header stays put and the body scrolls on small screens.
// Radix unmounts the content when closed, so a form inside starts fresh every time it opens.
export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  size = "md",
  children,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex max-h-[90dvh] flex-col gap-4 sm:p-6",
          size === "lg" ? "sm:max-w-2xl" : "sm:max-w-lg",
        )}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg">{title}</DialogTitle>
          {/* Always render a description so screen readers get one (Radix warns otherwise) */}
          <DialogDescription className={cn(!description && "sr-only")}>
            {description ?? title}
          </DialogDescription>
        </DialogHeader>
        {/* Padding inside the scroll area keeps focus rings from being clipped */}
        <div className="-mx-4 overflow-y-auto px-4 pb-1 sm:-mx-6 sm:px-6">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

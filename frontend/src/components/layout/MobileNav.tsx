import { Menu } from "lucide-react";
import { useState } from "react";
import {
  Button,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui";
import { APP_DESCRIPTION } from "@/constants";
import { AuthActions } from "./AuthActions";
import { Logo } from "./Logo";
import { MainNav } from "./MainNav";

// Slide-in menu for small screens; closes after a link is chosen
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <Menu aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle asChild>
            <Logo onClick={close} />
          </SheetTitle>
          <SheetDescription className="sr-only">{APP_DESCRIPTION}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4">
          <MainNav orientation="vertical" onNavigate={close} />
          <Separator />
          <AuthActions stacked onNavigate={close} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

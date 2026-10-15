import { Container } from "@/components/common";
import { AuthActions } from "./AuthActions";
import { Logo } from "./Logo";
import { MainNav } from "./MainNav";
import { MobileNav } from "./MobileNav";

// Solid background (no translucency/blur) so nav text contrast never depends on the content
// scrolling underneath
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <Container className="flex h-16 items-center gap-4">
        <MobileNav />
        <Logo />
        <MainNav className="ml-4 hidden md:flex" />
        <div className="ml-auto hidden md:block">
          <AuthActions />
        </div>
      </Container>
    </header>
  );
}

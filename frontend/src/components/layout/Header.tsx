import { Container } from "@/components/common";
import { AuthActions } from "./AuthActions";
import { Logo } from "./Logo";
import { MainNav } from "./MainNav";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <Container className="flex h-16 items-center gap-4">
        <MobileNav />
        <Logo />
        <MainNav className="ml-4 hidden md:flex" />
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden md:block">
            <AuthActions />
          </div>
        </div>
      </Container>
    </header>
  );
}

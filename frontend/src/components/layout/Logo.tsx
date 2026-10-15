import { GraduationCap } from "lucide-react";
import { Link } from "react-router";
import { APP_NAME, ROUTES } from "@/constants";
import { cn } from "@/lib";

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export function Logo({ className, onClick }: LogoProps) {
  return (
    <Link
      to={ROUTES.home}
      onClick={onClick}
      className={cn("flex items-center gap-2 font-semibold tracking-tight", className)}
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <GraduationCap className="size-5" aria-hidden />
      </span>
      {APP_NAME}
    </Link>
  );
}

import { ArrowRight, Building2, MessageSquare, Search } from "lucide-react";
import { Link } from "react-router";
import { Container } from "@/components/common";
import { Button } from "@/components/ui";
import { APP_NAME, ROUTES } from "@/constants";
import { CAREERS } from "@/enums";
import { AcademySearchForm, LatestAcademies } from "@/features/academies";
import { ACADEMY_MANAGER_ROLES, hasRole, useCurrentUser } from "@/features/auth";
import { useDocumentTitle } from "@/hooks";
import { cn, TONE_CHIP_CLASSES } from "@/lib";

const STEPS = [
  {
    icon: Search,
    tone: "primary",
    title: "Search",
    description: "Find academies by name or career path: web, mobile, data science and more.",
  },
  {
    icon: Building2,
    tone: "info",
    title: "Compare",
    description: "Check courses, tuition, skill level, housing and job assistance side by side.",
  },
  {
    icon: MessageSquare,
    tone: "warning",
    title: "Review",
    description: "Read ratings from former students, then share your own experience.",
  },
] as const;

// "Other" isn't a useful starting point
const POPULAR_CAREERS = CAREERS.filter((career) => career !== "Other");

const careerUrl = (career: string) =>
  `${ROUTES.academies}?${new URLSearchParams({ career }).toString()}`;

export function HomePage() {
  useDocumentTitle();
  const { user } = useCurrentUser();
  const isManager = hasRole(user, ACADEMY_MANAGER_ROLES);

  return (
    <>
      <section className="border-b bg-accent">
        <Container className="flex flex-col items-center gap-6 py-12 text-center sm:py-16">
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            Find the right academy for your career
          </h1>
          <p className="max-w-2xl text-lg text-balance text-muted-foreground">
            {APP_NAME} brings academies, courses and student reviews together so you can choose with
            confidence.
          </p>
          <AcademySearchForm className="w-full max-w-xl" />
          <nav aria-label="Popular careers" className="w-full max-w-2xl">
            <ul className="flex flex-wrap justify-center gap-2">
              {POPULAR_CAREERS.map((career) => (
                <li key={career}>
                  <Link
                    to={careerUrl(career)}
                    className="inline-flex h-8 items-center rounded-full border border-input bg-background px-3 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                  >
                    {career}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </section>

      <Container className="space-y-12 py-12">
        <section aria-labelledby="how-heading" className="space-y-4">
          <h2 id="how-heading" className="text-xl font-semibold tracking-tight">
            How {APP_NAME} works
          </h2>
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, tone, title, description }, index) => (
              <li key={title} className="flex gap-4 rounded-xl border bg-card p-5">
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-lg",
                    TONE_CHIP_CLASSES[tone],
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="space-y-1">
                  <h3 className="font-semibold">
                    {index + 1}. {title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <LatestAcademies />

        {/* For academy owners; students have nothing to list */}
        {(!user || isManager) && (
          <section
            aria-labelledby="publish-heading"
            className="flex flex-col gap-4 rounded-xl bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:p-8"
          >
            <div className="space-y-1">
              <h2 id="publish-heading" className="text-xl font-semibold tracking-tight">
                Run an academy?
              </h2>
              <p>List it on {APP_NAME} so students can find it, compare it and review it.</p>
            </div>
            {/* The default focus ring is the primary colour, invisible on this band */}
            <Button
              size="lg"
              variant="secondary"
              className="shrink-0 focus-visible:border-primary-foreground focus-visible:ring-primary-foreground/60"
              asChild
            >
              <Link to={isManager ? ROUTES.dashboardAcademies : ROUTES.register}>
                {isManager ? "Manage my academies" : "Get started"}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </section>
        )}
      </Container>
    </>
  );
}

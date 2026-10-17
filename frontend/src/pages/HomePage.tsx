import { Building2, MessageSquare, Search } from "lucide-react";
import { Link, Navigate } from "react-router";
import { Container, PageLoading } from "@/components/common";
import { APP_NAME, ROUTES } from "@/constants";
import { CAREERS } from "@/enums";
import { AcademySearchForm, LatestAcademies } from "@/features/academies";
import { useCurrentUser } from "@/features/auth";
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

// The public landing page for visitors who aren't signed in
export function HomePage() {
  useDocumentTitle();
  const { user, isLoading } = useCurrentUser();

  // Signed-in users have no separate home: their dashboard is it
  if (isLoading) return <PageLoading />;
  if (user) return <Navigate to={ROUTES.dashboard} replace />;

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
      </Container>
    </>
  );
}

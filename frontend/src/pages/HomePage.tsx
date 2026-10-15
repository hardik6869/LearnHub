import { ArrowRight, BookOpen, Building2, Star } from "lucide-react";
import { Link } from "react-router";
import { Container } from "@/components/common";
import { Button, Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { APP_NAME, ROUTES } from "@/constants";
import { useDocumentTitle } from "@/hooks";

const HIGHLIGHTS = [
  {
    icon: Building2,
    title: "Compare academies",
    description: "Filter by career path, cost, housing and job assistance.",
  },
  {
    icon: BookOpen,
    title: "Explore courses",
    description: "See tuition, duration and the skill level each course expects.",
  },
  {
    icon: Star,
    title: "Read real reviews",
    description: "Ratings and reviews from students who studied there.",
  },
] as const;

export function HomePage() {
  useDocumentTitle();

  return (
    <>
      <section className="border-b">
        <Container className="flex flex-col items-center gap-6 py-16 text-center sm:py-24">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Find the right academy for your career
          </h1>
          <p className="max-w-2xl text-lg text-balance text-muted-foreground">
            {APP_NAME} brings academies, courses and student reviews together so you can choose with
            confidence.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button size="lg" asChild>
              <Link to={ROUTES.academies}>
                Browse academies
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to={ROUTES.register}>Create an account</Link>
            </Button>
          </div>
        </Container>
      </section>

      <section>
        <Container className="grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader>
                <Icon className="mb-2 size-6 text-primary" aria-hidden />
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </Container>
      </section>
    </>
  );
}

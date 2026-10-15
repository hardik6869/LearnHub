import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";
import { Container, PageError, PageHeader, PageLoading } from "@/components/common";
import { Badge } from "@/components/ui";
import { ROUTES } from "@/constants";
import { canManage, useCurrentUser } from "@/features/auth";
import { CourseList } from "@/features/courses";
import { ReviewList } from "@/features/reviews";
import { useDocumentTitle } from "@/hooks";
import { AcademyActions } from "../components/AcademyActions";
import { AcademyInfo } from "../components/AcademyInfo";
import { AcademyPhoto } from "../components/AcademyPhoto";
import { useAcademy } from "../hooks/useAcademies";

export function AcademyDetailPage() {
  const { id = "" } = useParams();
  const { user } = useCurrentUser();
  const { data: academy, isPending, isError, error, refetch } = useAcademy(id);
  useDocumentTitle(academy?.name ?? "Academy");

  if (isPending) return <PageLoading />;
  if (isError) {
    return (
      <PageError error={error} notFoundTitle="Academy not found" onRetry={() => void refetch()} />
    );
  }

  return (
    <Container className="space-y-8 py-8">
      <Link
        to={ROUTES.academies}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All academies
      </Link>

      <PageHeader
        title={academy.name}
        description={academy.address}
        actions={canManage(user, academy) && <AcademyActions academy={academy} />}
      />

      {/* Photo and key facts share one row of equal height on desktop; on phones the key
          facts come first */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <AcademyPhoto
          academy={academy}
          fit="contain"
          className="w-full lg:aspect-auto lg:h-full lg:min-h-72"
        />
        <AcademyInfo academy={academy} className="order-first h-full lg:order-none" />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">About</h2>
        <p className="leading-relaxed whitespace-pre-line">{academy.description}</p>
        <ul className="flex flex-wrap gap-1.5" aria-label="Careers">
          {academy.careers.map((career) => (
            <li key={career}>
              <Badge variant="secondary">{career}</Badge>
            </li>
          ))}
        </ul>
      </section>

      <CourseList academy={academy} />
      <ReviewList academy={academy} />
    </Container>
  );
}

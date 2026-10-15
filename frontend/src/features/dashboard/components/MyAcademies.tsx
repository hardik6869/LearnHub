import { Building2 } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "@/components/common";
import { USER_ROLES } from "@/enums";
import { AcademyCard, AddAcademyButton, useAcademies } from "@/features/academies";
import { cn, getGridColumns } from "@/lib";
import type { User } from "@/types";

// The academies the user owns. Publishers may own one, so "Add academy" shows only until they
// have it; admins can always add more.
export function MyAcademies({ user }: { user: User }) {
  const { data, isPending, isError, refetch } = useAcademies({ user: user._id, limit: 100 });
  const count = data?.data.length ?? 0;
  const canAdd = user.role === USER_ROLES.ADMIN || (!isPending && count === 0);

  const renderContent = () => {
    if (isPending) return <LoadingState count={3} label="Loading your academies…" />;
    if (isError) return <ErrorState onRetry={() => void refetch()} />;
    if (count === 0) {
      return (
        <EmptyState
          icon={Building2}
          title="You haven't added an academy yet"
          description="Add your academy so students can find it, then add its courses."
        />
      );
    }
    return (
      <ul className={cn("grid grid-cols-1 gap-4", getGridColumns(count))}>
        {data.data.map((academy) => (
          <li key={academy._id}>
            <AcademyCard academy={academy} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section aria-labelledby="my-academies-heading" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 id="my-academies-heading" className="text-lg font-semibold">
          My academies{count > 0 && ` (${String(count)})`}
        </h2>
        {canAdd && <AddAcademyButton />}
      </div>
      {renderContent()}
    </section>
  );
}

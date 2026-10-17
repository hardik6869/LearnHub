import { Building2 } from "lucide-react";
import { EmptyState, ErrorState, LoadingState, PageHeader } from "@/components/common";
import { USER_ROLES } from "@/enums";
import { AcademyCard, AddAcademyButton, useAcademies } from "@/features/academies";
import { CARD_GRID } from "@/lib";
import type { User } from "@/types";

// The academies the user owns, with the page header. Publishers may own one, so "Add academy"
// shows only until they have it; admins can always add more.
export function MyAcademies({ user }: { user: User }) {
  const { data, isPending, isError, refetch } = useAcademies({ user: user._id, limit: 100 });
  const count = data?.data.length ?? 0;

  const renderContent = () => {
    if (isPending) return <LoadingState count={3} label="Loading your academies…" />;
    if (isError) return <ErrorState onRetry={() => void refetch()} />;
    if (count === 0) {
      return (
        <EmptyState
          icon={Building2}
          title="You haven't added an academy yet"
          description="Add your academy so students can find it, then add its courses."
          action={<AddAcademyButton />}
        />
      );
    }
    return (
      <ul className={CARD_GRID}>
        {data.data.map((academy) => (
          <li key={academy._id}>
            <AcademyCard academy={academy} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <PageHeader
        title={count > 0 ? `My academies (${String(count)})` : "My academies"}
        description="Open an academy to edit it, upload a photo or manage its courses."
        // The empty state has its own button; publishers can't add a second academy
        actions={user.role === USER_ROLES.ADMIN && count > 0 && <AddAcademyButton />}
      />
      {renderContent()}
    </>
  );
}

import { useCurrentUser } from "@/features/auth";
import { useDocumentTitle } from "@/hooks";
import { MyReviews } from "../components/MyReviews";

// Students and admins; the router guards the roles
export function MyReviewsPage() {
  useDocumentTitle("My reviews");
  const { user } = useCurrentUser();
  return user && <MyReviews user={user} />;
}

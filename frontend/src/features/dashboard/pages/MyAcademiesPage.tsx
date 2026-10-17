import { useCurrentUser } from "@/features/auth";
import { useDocumentTitle } from "@/hooks";
import { MyAcademies } from "../components/MyAcademies";

// Publishers and admins; the router guards the roles
export function MyAcademiesPage() {
  useDocumentTitle("My academies");
  const { user } = useCurrentUser();
  return user && <MyAcademies user={user} />;
}

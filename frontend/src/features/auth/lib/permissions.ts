import { USER_ROLES, type UserRole } from "@/enums";
import type { Id, User } from "@/types";

// Mirrors the backend's authorize(...) lists. Hiding UI is a convenience; the API decides.
export const ACADEMY_MANAGER_ROLES: readonly UserRole[] = [USER_ROLES.PUBLISHER, USER_ROLES.ADMIN];
export const REVIEWER_ROLES: readonly UserRole[] = [USER_ROLES.USER, USER_ROLES.ADMIN];
export const ADMIN_ROLES: readonly UserRole[] = [USER_ROLES.ADMIN];

export const hasRole = (user: User | null, roles: readonly UserRole[]): boolean =>
  user !== null && roles.includes(user.role);

// `user` on a resource is an id, or a populated author on reviews
interface OwnedResource {
  user: Id | { _id: Id };
}

/** The owner or an admin may edit and delete a resource */
export const canManage = (user: User | null, resource: OwnedResource): boolean => {
  if (user === null) return false;
  const ownerId = typeof resource.user === "string" ? resource.user : resource.user._id;
  return ownerId === user._id || user.role === USER_ROLES.ADMIN;
};

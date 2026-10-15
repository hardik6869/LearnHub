// Allowed values shared by the Mongoose schema enums and the types in src/types

export const CAREERS = [
  "Web Development",
  "Mobile Development",
  "UI/UX",
  "Data Science",
  "Business",
  "Other",
] as const;

export const MINIMUM_SKILLS = ["beginner", "intermediate", "advanced"] as const;

// Roles a request may set (register, admin create/update user); never "admin"
export const ASSIGNABLE_ROLES = ["user", "publisher"] as const;

// Every role a stored user can have. "admin" is assigned directly in the database only, but must
// be valid in the schema, or saving an admin document (e.g. a password change) fails validation.
export const USER_ROLES = [...ASSIGNABLE_ROLES, "admin"] as const;

// Guard for roles coming from a request body: only "user" | "publisher" may be set
export const isAssignableRole = (role: unknown): role is (typeof ASSIGNABLE_ROLES)[number] =>
  typeof role === "string" && (ASSIGNABLE_ROLES as readonly string[]).includes(role);

export const INVALID_ROLE_MESSAGE = `Role must be one of: ${ASSIGNABLE_ROLES.join(", ")}`;

// Fields a client may set on create/update; everything else (user, academy, slug, photo,
// averageCost, averageRating, createdAt) is set by the server
export const ACADEMY_FIELDS = [
  "name",
  "description",
  "website",
  "phone",
  "email",
  "address",
  "careers",
  "housing",
  "jobAssistance",
  "jobGuarantee",
  "acceptGi",
] as const;

export const COURSE_FIELDS = [
  "title",
  "description",
  "weeks",
  "tuition",
  "minimumSkill",
  "scholarhipsAvailable",
] as const;

export const REVIEW_FIELDS = ["title", "text", "rating"] as const;

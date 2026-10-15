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

// Roles the user schema accepts; "admin" is only checked by `authorize`
export const ASSIGNABLE_ROLES = ["user", "publisher"] as const;

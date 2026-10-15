import { z } from "zod";
import { CAREERS } from "@/enums";
import type { Academy } from "@/types";

// Mirrors backend/src/models/Academy.ts. Optional text fields allow "" (which clears them).
export const academySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
  address: z.string().trim().min(1, "Enter an address"),
  website: z.union([
    z.literal(""),
    z.url({ protocol: /^https?$/, message: "Enter a URL starting with http:// or https://" }),
  ]),
  phone: z.string().trim().max(20, "Phone number must be at most 20 characters"),
  email: z.union([z.literal(""), z.email("Enter a valid email address")]),
  careers: z.array(z.enum(CAREERS)).min(1, "Choose at least one career"),
  housing: z.boolean(),
  jobAssistance: z.boolean(),
  jobGuarantee: z.boolean(),
  acceptGi: z.boolean(),
});

export type AcademyFormValues = z.infer<typeof academySchema>;

export const toAcademyFormValues = (academy?: Academy): AcademyFormValues => ({
  name: academy?.name ?? "",
  description: academy?.description ?? "",
  address: academy?.address ?? "",
  website: academy?.website ?? "",
  phone: academy?.phone ?? "",
  email: academy?.email ?? "",
  careers: academy?.careers ?? [],
  housing: academy?.housing ?? false,
  jobAssistance: academy?.jobAssistance ?? false,
  jobGuarantee: academy?.jobGuarantee ?? false,
  acceptGi: academy?.acceptGi ?? false,
});

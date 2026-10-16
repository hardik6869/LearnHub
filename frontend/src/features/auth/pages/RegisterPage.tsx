import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import { SelectField, SubmitButton, TextField } from "@/components/common";
import { FieldGroup } from "@/components/ui";
import { ROUTES } from "@/constants";
import { USER_ROLES, type AssignableRole } from "@/enums";
import type { SelectOption } from "@/types";
import { AuthCard } from "../components/AuthCard";
import { useRegister } from "../hooks/useAuthMutations";
import { registerSchema, type RegisterValues } from "../schemas/authSchemas";

// Says what each account type is for, so new users can choose without guessing
const ACCOUNT_TYPE_OPTIONS: readonly SelectOption<AssignableRole>[] = [
  { value: USER_ROLES.USER, label: "Student – review academies" },
  { value: USER_ROLES.PUBLISHER, label: "Publisher – list my academy" },
];

export function RegisterPage() {
  const register = useRegister();
  const [searchParams] = useSearchParams();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", role: USER_ROLES.USER },
  });

  return (
    <AuthCard
      title="Create an account"
      description="Join LearnHub to review academies, or publish your own."
      footer={
        <p>
          Already have an account?{" "}
          <Link
            to={{ pathname: ROUTES.login, search: searchParams.toString() }}
            className="font-medium text-foreground underline"
          >
            Log in
          </Link>
        </p>
      }
    >
      <form onSubmit={form.handleSubmit((values) => register.mutate(values))} noValidate>
        <FieldGroup>
          <TextField control={form.control} name="name" label="Name" autoComplete="name" required />
          <TextField
            control={form.control}
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
          />
          <TextField
            control={form.control}
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            description="At least 6 characters."
            required
          />
          <SelectField
            control={form.control}
            name="role"
            label="Account type"
            options={ACCOUNT_TYPE_OPTIONS}
            required
          />
          <SubmitButton isPending={register.isPending}>Sign up</SubmitButton>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}

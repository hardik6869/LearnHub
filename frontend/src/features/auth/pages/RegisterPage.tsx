import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import { SelectField, SubmitButton, TextField } from "@/components/common";
import { FieldGroup } from "@/components/ui";
import { ROUTES } from "@/constants";
import { ASSIGNABLE_ROLE_OPTIONS, USER_ROLES } from "@/enums";
import { AuthCard } from "../components/AuthCard";
import { useRegister } from "../hooks/useAuthMutations";
import { registerSchema, type RegisterValues } from "../schemas/authSchemas";

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
            label="I want to"
            options={ASSIGNABLE_ROLE_OPTIONS}
            description="Students write reviews; publishers add academies and courses."
            required
          />
          <SubmitButton isPending={register.isPending}>Create account</SubmitButton>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}

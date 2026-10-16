import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import { SubmitButton, TextField } from "@/components/common";
import { FieldGroup } from "@/components/ui";
import { ROUTES } from "@/constants";
import { AuthCard } from "../components/AuthCard";
import { useLogin } from "../hooks/useAuthMutations";
import { loginSchema, type LoginValues } from "../schemas/authSchemas";

// RequireGuest redirects once the login succeeds
export function LoginPage() {
  const login = useLogin();
  const [searchParams] = useSearchParams();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Keep ?redirect= so signing up instead still returns the user to where they were
  const registerLink = { pathname: ROUTES.register, search: searchParams.toString() };

  return (
    <AuthCard
      title="Log in"
      description="Welcome back. Log in to manage your academies and reviews."
      footer={
        <p>
          Don't have an account?{" "}
          <Link to={registerLink} className="font-medium text-foreground underline">
            Sign up
          </Link>
        </p>
      }
    >
      <form onSubmit={form.handleSubmit((values) => login.mutate(values))} noValidate>
        <FieldGroup>
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
            autoComplete="current-password"
            required
          />
          <Link
            to={ROUTES.forgotPassword}
            className="-mt-2 self-end text-sm text-muted-foreground underline hover:text-foreground"
          >
            Forgot password?
          </Link>
          <SubmitButton isPending={login.isPending}>Log in</SubmitButton>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}

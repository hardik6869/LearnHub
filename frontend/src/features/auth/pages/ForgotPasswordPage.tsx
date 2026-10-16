import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { SubmitButton, TextField } from "@/components/common";
import { FieldGroup } from "@/components/ui";
import { ROUTES } from "@/constants";
import { AuthCard } from "../components/AuthCard";
import { useForgotPassword } from "../hooks/useAuthMutations";
import { forgotPasswordSchema, type ForgotPasswordValues } from "../schemas/authSchemas";

export function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  return (
    <AuthCard
      title="Forgot your password?"
      description="Enter your email and we'll send you a link to choose a new one."
      footer={
        <Link to={ROUTES.login} className="font-medium text-foreground underline">
          Back to log in
        </Link>
      }
    >
      {forgotPassword.isSuccess ? (
        // The API answers the same for unknown emails, so this never reveals an account
        <p role="status" className="text-sm">
          {forgotPassword.data}
        </p>
      ) : (
        <form onSubmit={form.handleSubmit((values) => forgotPassword.mutate(values))} noValidate>
          <FieldGroup>
            <TextField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              required
            />
            <SubmitButton isPending={forgotPassword.isPending}>Send reset link</SubmitButton>
          </FieldGroup>
        </form>
      )}
    </AuthCard>
  );
}

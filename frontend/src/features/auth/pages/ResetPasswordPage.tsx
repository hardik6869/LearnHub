import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router";
import { SubmitButton, TextField } from "@/components/common";
import { FieldGroup } from "@/components/ui";
import { ROUTES } from "@/constants";
import { AuthCard } from "../components/AuthCard";
import { useResetPassword } from "../hooks/useAuthMutations";
import { resetPasswordSchema, type ResetPasswordValues } from "../schemas/authSchemas";

// Opened from the reset email; a successful reset signs the user in (RequireGuest redirects)
export function ResetPasswordPage() {
  const { token = "" } = useParams();
  const resetPassword = useResetPassword(token);
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  return (
    <AuthCard
      title="Choose a new password"
      footer={
        <Link to={ROUTES.forgotPassword} className="font-medium text-foreground underline">
          Request a new link
        </Link>
      }
    >
      <form
        onSubmit={form.handleSubmit(({ password }) => resetPassword.mutate({ password }))}
        noValidate
      >
        <FieldGroup>
          <TextField
            control={form.control}
            name="password"
            label="New password"
            type="password"
            autoComplete="new-password"
            description="At least 6 characters."
            required
          />
          <TextField
            control={form.control}
            name="confirmPassword"
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            required
          />
          <SubmitButton isPending={resetPassword.isPending}>Reset password</SubmitButton>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}

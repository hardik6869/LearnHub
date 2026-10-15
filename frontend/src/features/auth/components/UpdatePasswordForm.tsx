import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SubmitButton, TextField } from "@/components/common";
import { FieldGroup } from "@/components/ui";
import { useUpdatePassword } from "../hooks/useAuthMutations";
import { updatePasswordSchema, type UpdatePasswordValues } from "../schemas/authSchemas";

const EMPTY: UpdatePasswordValues = { currentPassword: "", password: "", confirmPassword: "" };

export function UpdatePasswordForm() {
  const updatePassword = useUpdatePassword();
  const form = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: EMPTY,
  });

  const onSubmit = ({ currentPassword, password }: UpdatePasswordValues) => {
    updatePassword.mutate(
      { currentPassword, newPassword: password },
      { onSuccess: () => form.reset(EMPTY) },
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <TextField
          control={form.control}
          name="currentPassword"
          label="Current password"
          type="password"
          autoComplete="current-password"
          required
        />
        <TextField
          control={form.control}
          name="password"
          label="New password"
          type="password"
          autoComplete="new-password"
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
        <SubmitButton isPending={updatePassword.isPending} className="self-start">
          Change password
        </SubmitButton>
      </FieldGroup>
    </form>
  );
}

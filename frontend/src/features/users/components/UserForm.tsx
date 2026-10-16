import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SelectField, SubmitButton, TextField } from "@/components/common";
import { FieldGroup } from "@/components/ui";
import { ASSIGNABLE_ROLE_OPTIONS } from "@/enums";
import { createUserSchema, userSchema, type UserFormValues } from "../schemas/userSchema";

interface UserFormProps {
  /** Create shows a password field; edit doesn't (users change their own password) */
  isNew: boolean;
  defaultValues: UserFormValues;
  onSubmit: (values: UserFormValues) => void;
  isPending: boolean;
}

export function UserForm({ isNew, defaultValues, onSubmit, isPending }: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(isNew ? createUserSchema : userSchema),
    defaultValues,
  });
  const { control } = form;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <TextField control={control} name="name" label="Name" autoComplete="off" required />
        <TextField
          control={control}
          name="email"
          label="Email"
          type="email"
          autoComplete="off"
          required
        />
        <SelectField
          control={control}
          name="role"
          label="Role"
          options={ASSIGNABLE_ROLE_OPTIONS}
          required
        />
        {isNew && (
          <TextField
            control={control}
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            description="At least 6 characters. Share it with the user so they can change it."
            required
          />
        )}
        <SubmitButton isPending={isPending} className="self-start">
          {isNew ? "Create user" : "Save changes"}
        </SubmitButton>
      </FieldGroup>
    </form>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SubmitButton, TextField } from "@/components/common";
import { FieldGroup } from "@/components/ui";
import type { User } from "@/types";
import { useUpdateDetails } from "../hooks/useAuthMutations";
import { updateDetailsSchema, type UpdateDetailsValues } from "../schemas/authSchemas";

export function UpdateDetailsForm({ user }: { user: User }) {
  const updateDetails = useUpdateDetails();
  const form = useForm<UpdateDetailsValues>({
    resolver: zodResolver(updateDetailsSchema),
    defaultValues: { name: user.name, email: user.email },
  });

  const onSubmit = (values: UpdateDetailsValues) => {
    updateDetails.mutate(values, { onSuccess: ({ name, email }) => form.reset({ name, email }) });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
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
        <SubmitButton
          isPending={updateDetails.isPending}
          disabled={!form.formState.isDirty}
          className="self-start"
        >
          Save changes
        </SubmitButton>
      </FieldGroup>
    </form>
  );
}

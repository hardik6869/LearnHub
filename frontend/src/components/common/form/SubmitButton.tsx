import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui";

type SubmitButtonProps = Omit<ComponentProps<typeof Button>, "type"> & {
  /** Disables the button and shows a spinner while the form's mutation runs */
  isPending?: boolean;
};

export function SubmitButton({
  isPending = false,
  disabled,
  children,
  ...props
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={isPending || disabled} aria-busy={isPending} {...props}>
      {isPending && <Loader2 className="motion-safe:animate-spin" aria-hidden />}
      {children}
    </Button>
  );
}

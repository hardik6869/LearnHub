import { Toaster } from "@/components/ui";

// The app is light-only. theme="light" overrides the generated ui/sonner.tsx, which would
// otherwise follow the OS dark mode. No `richColors`: toasts use the app's popover tokens
// (WCAG AA contrast) and their icons, so status is never conveyed by colour alone.
export function AppToaster() {
  return <Toaster theme="light" position="top-right" closeButton />;
}

import { Toaster } from "@/components/ui";
import { useTheme } from "./useTheme";

// The generated ui/sonner.tsx reads its theme from next-themes, which this app doesn't use;
// passing `theme` here overrides it so toasts follow the selected theme
export function AppToaster() {
  const { resolvedTheme } = useTheme();
  return <Toaster theme={resolvedTheme} position="top-right" richColors closeButton />;
}

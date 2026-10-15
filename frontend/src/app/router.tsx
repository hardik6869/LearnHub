import { createBrowserRouter } from "react-router";
import { PageLoading } from "@/components/common";
import { RootLayout } from "@/components/layout";
import { ROUTE_PATHS } from "@/constants";
import { NotFoundPage, RouteErrorPage } from "@/pages";

// Pages are lazy-loaded by file path so each one becomes its own chunk.
// Feature modules add their routes to the `children` of the layout route.
export const router = createBrowserRouter([
  {
    Component: RootLayout,
    // Rendered on the very first load until the initial lazy page has downloaded. Without it
    // React Router warns "No HydrateFallback element provided" and renders nothing meanwhile.
    HydrateFallback: PageLoading,
    // Errors outside a page (e.g. in the layout itself) replace the whole screen
    ErrorBoundary: RouteErrorPage,
    children: [
      {
        // Errors inside a page render within the layout, keeping header and footer
        ErrorBoundary: RouteErrorPage,
        children: [
          {
            index: true,
            lazy: async () => ({ Component: (await import("@/pages/HomePage")).HomePage }),
          },
          { path: ROUTE_PATHS.notFound, Component: NotFoundPage },
        ],
      },
    ],
  },
]);

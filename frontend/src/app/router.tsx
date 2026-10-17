import { createBrowserRouter } from "react-router";
import { PageLoading } from "@/components/common";
import { RootLayout } from "@/components/layout";
import { ROUTE_PATHS } from "@/constants";
import {
  ACADEMY_MANAGER_ROLES,
  ADMIN_ROLES,
  RequireAuth,
  RequireGuest,
  REVIEWER_ROLES,
} from "@/features/auth";
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
          {
            path: ROUTE_PATHS.academies,
            lazy: async () => ({
              Component: (await import("@/features/academies/pages/AcademiesPage")).AcademiesPage,
            }),
          },
          {
            path: ROUTE_PATHS.academyDetail,
            lazy: async () => ({
              Component: (await import("@/features/academies/pages/AcademyDetailPage"))
                .AcademyDetailPage,
            }),
          },

          // Signed-out only: redirects to ?redirect= (or home) once signed in
          {
            Component: RequireGuest,
            children: [
              {
                path: ROUTE_PATHS.login,
                lazy: async () => ({
                  Component: (await import("@/features/auth/pages/LoginPage")).LoginPage,
                }),
              },
              {
                path: ROUTE_PATHS.register,
                lazy: async () => ({
                  Component: (await import("@/features/auth/pages/RegisterPage")).RegisterPage,
                }),
              },
              {
                path: ROUTE_PATHS.forgotPassword,
                lazy: async () => ({
                  Component: (await import("@/features/auth/pages/ForgotPasswordPage"))
                    .ForgotPasswordPage,
                }),
              },
              {
                path: ROUTE_PATHS.resetPassword,
                lazy: async () => ({
                  Component: (await import("@/features/auth/pages/ResetPasswordPage"))
                    .ResetPasswordPage,
                }),
              },
            ],
          },

          // Any signed-in user
          {
            Component: RequireAuth,
            children: [
              {
                path: ROUTE_PATHS.account,
                lazy: async () => ({
                  Component: (await import("@/features/auth/pages/AccountPage")).AccountPage,
                }),
              },

              // The signed-in home: tabs above every page below
              {
                path: ROUTE_PATHS.dashboard,
                lazy: async () => ({
                  Component: (await import("@/features/dashboard/components/DashboardLayout"))
                    .DashboardLayout,
                }),
                children: [
                  {
                    index: true,
                    lazy: async () => ({
                      Component: (await import("@/features/dashboard/pages/DashboardPage"))
                        .DashboardPage,
                    }),
                  },
                  {
                    element: <RequireAuth roles={ACADEMY_MANAGER_ROLES} />,
                    children: [
                      {
                        path: ROUTE_PATHS.dashboardAcademies,
                        lazy: async () => ({
                          Component: (await import("@/features/dashboard/pages/MyAcademiesPage"))
                            .MyAcademiesPage,
                        }),
                      },
                    ],
                  },
                  {
                    element: <RequireAuth roles={REVIEWER_ROLES} />,
                    children: [
                      {
                        path: ROUTE_PATHS.dashboardReviews,
                        lazy: async () => ({
                          Component: (await import("@/features/dashboard/pages/MyReviewsPage"))
                            .MyReviewsPage,
                        }),
                      },
                    ],
                  },
                  {
                    element: <RequireAuth roles={ADMIN_ROLES} />,
                    children: [
                      {
                        path: ROUTE_PATHS.dashboardUsers,
                        lazy: async () => ({
                          Component: (await import("@/features/users/pages/UsersPage")).UsersPage,
                        }),
                      },
                    ],
                  },
                ],
              },
            ],
          },

          { path: ROUTE_PATHS.notFound, Component: NotFoundPage },
        ],
      },
    ],
  },
]);

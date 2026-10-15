// Pages the router needs eagerly (fallbacks). Lazy-loaded pages such as HomePage are imported
// by file path in app/router.tsx and must NOT be re-exported here — a barrel export would pull
// them into the main bundle and defeat code splitting.
export * from "./NotFoundPage";
export * from "./RouteErrorPage";

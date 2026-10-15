import { Outlet, ScrollRestoration } from "react-router";
import { Footer } from "./Footer";
import { Header } from "./Header";

const MAIN_ID = "main-content";

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      {/* WCAG 2.4.1: lets keyboard users jump past the header navigation */}
      <a
        href={`#${MAIN_ID}`}
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Header />
      <main id={MAIN_ID} tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}

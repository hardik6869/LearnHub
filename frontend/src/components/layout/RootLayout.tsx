import { Outlet, ScrollRestoration } from "react-router";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}

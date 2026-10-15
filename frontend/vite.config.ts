import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // "" loads every variable, not only VITE_*; DEV_API_TARGET stays on the dev server and is
  // never exposed to browser code. It comes from .env.development (override in *.local).
  const env = loadEnv(mode, import.meta.dirname, "");
  const apiTarget = env.DEV_API_TARGET;

  if (command === "serve" && !apiTarget) {
    throw new Error(
      "DEV_API_TARGET is not set. Add it to frontend/.env.development (see .env.example).",
    );
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    server: {
      port: 5173,
      // Same-origin in dev, like the Vercel rewrite in production, so the httpOnly auth cookie
      // works
      proxy: apiTarget ? { "/api": apiTarget, "/uploads": apiTarget } : undefined,
    },
  };
});

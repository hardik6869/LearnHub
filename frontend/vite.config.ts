import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// Dev-only proxy target; must match the backend's PORT (backend/config/config.env)
const DEFAULT_API_TARGET = "http://localhost:4000";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // "" loads every variable, not only VITE_*; DEV_API_TARGET stays on the dev server and is
  // never exposed to browser code
  const env = loadEnv(mode, import.meta.dirname, "");
  const apiTarget = env.DEV_API_TARGET || DEFAULT_API_TARGET;

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
      proxy: {
        "/api": apiTarget,
        "/uploads": apiTarget,
      },
    },
  };
});

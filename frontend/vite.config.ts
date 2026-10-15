import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Backend API in development (see backend/config/config.env PORT)
const API_TARGET = "http://localhost:4000";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    // Same-origin in dev, like the Vercel rewrite in production, so the httpOnly auth cookie works
    proxy: {
      "/api": API_TARGET,
      "/uploads": API_TARGET,
    },
  },
});

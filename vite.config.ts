import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Bind to 0.0.0.0 so the dev server is reachable from other devices on the
    // LAN (Vite prints a "Network:" URL like http://192.168.x.x:5173).
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
});

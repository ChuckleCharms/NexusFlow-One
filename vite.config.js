// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Helps avoid allowedHosts issues in dev environments
    allowedHosts: true,
  },
});

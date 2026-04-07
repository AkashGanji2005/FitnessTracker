import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/auth": "http://localhost:3001",
      "/workouts": "http://localhost:3001",
      "/logs": "http://localhost:3001",
      "/goals": "http://localhost:3001",
      "/admin": "http://localhost:3001",
      "/exercises": "http://localhost:3001",
      "/dashboard": "http://localhost:3001",
    },
  },
});

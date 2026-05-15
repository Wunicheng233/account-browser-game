import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    globals: true,
  },
} as Parameters<typeof defineConfig>[0] & {
  test: {
    environment: string;
    setupFiles: string;
    globals: boolean;
  };
});

import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      include: [
        "app/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "design-system/**/*.{ts,tsx}",
        "lib/**/*.ts",
        "tooling/**/*.mjs",
      ],
      exclude: ["app/**/*.d.ts"],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
});

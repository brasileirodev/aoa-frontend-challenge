import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { importAliases } from "./tooling/import-paths.mjs";
export default defineConfig({
  resolve: { alias: importAliases },
  test: {
    alias: {
      "server-only": fileURLToPath(
        new URL("./tests/support/server-only.ts", import.meta.url),
      ),
    },
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      include: [
        "app/**/*.{ts,tsx}",
        "modules/**/*.{ts,tsx}",
        "shared/**/*.{ts,tsx}",
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

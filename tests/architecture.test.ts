import { it, expect } from "vitest";
import { ESLint } from "eslint";
import type { Rule } from "eslint";
import tsParser from "@typescript-eslint/parser";
import fs from "node:fs";
import path from "node:path";
it("enforces vendor imports, reexports and layer direction", async () => {
  const architectureRule = (await import("../tooling/architecture.mjs").then(
    (module) => module.default,
  )) as Rule.RuleModule;
  const lint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [
      {
        files: ["**/*.{ts,tsx,js,mjs,mts}"],
        plugins: {
          architecture: {
            rules: {
              boundaries: architectureRule,
            },
          },
        },
        rules: { "architecture/boundaries": "error" },
        languageOptions: {
          parser: tsParser,
          ecmaVersion: "latest",
          sourceType: "module",
          parserOptions: { ecmaFeatures: { jsx: true } },
        },
      },
    ],
  });
  for (const [file, code, bad] of [
    ["app/page.tsx", 'import Button from "@mui/material/Button";', true],
    [
      "components/molecules/Example.tsx",
      'export {default as Button} from "@mui/material/Button";',
      true,
    ],
    [
      "components/atoms/Example.tsx",
      'export type {ButtonProps} from "@mui/material/Button";',
      true,
    ],
    [
      "components/atoms/Example.tsx",
      'import {Header} from "../organisms/Header";',
      true,
    ],
    [
      "components/atoms/Example.tsx",
      'import Button from "@mui/material/Button";',
      false,
    ],
    [
      "components/organisms/Example.tsx",
      'import {Button} from "@/components/atoms/Button";',
      false,
    ],
  ] as const) {
    const [result] = await lint.lintText(code, { filePath: file });
    expect(
      result.messages.some((m) => m.ruleId === "architecture/boundaries"),
    ).toBe(bad);
  }
});
it("contains no local component dependency cycles", () => {
  const root = process.cwd();
  const files = fs
    .readdirSync(path.join(root, "components"), { recursive: true })
    .map(String)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => path.resolve(root, "components", f));
  const graph = new Map(
    files.map((file) => [
      file,
      [...fs.readFileSync(file, "utf8").matchAll(/from\s+['"]([^'"]+)['"]/g)]
        .map((m) => m[1])
        .filter((p) => p.startsWith("@/") || p.startsWith("."))
        .map(
          (p) =>
            path.resolve(
              p.startsWith("@/") ? root : path.dirname(file),
              p.startsWith("@/") ? p.slice(2) : p,
            ) + ".tsx",
        )
        .filter((p) => files.includes(p)),
    ]),
  );
  const done = new Set<string>();
  function visit(file: string, stack: Set<string>) {
    expect(stack.has(file)).toBe(false);
    if (done.has(file)) return;
    const next = new Set(stack).add(file);
    for (const dep of graph.get(file) ?? []) visit(dep, next);
    done.add(file);
  }
  for (const file of files) visit(file, new Set());
});

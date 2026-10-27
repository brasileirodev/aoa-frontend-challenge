import { it, expect } from "vitest";
import { ESLint } from "eslint";
import type { Rule } from "eslint";
import tsParser from "@typescript-eslint/parser";
import fs from "node:fs";
import path from "node:path";
import { resolveLocalImport } from "../tooling/import-paths.mjs";
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
    [
      "modules/pokemon/api/example.ts",
      'import { getPlans } from "@aoa/checkout/services/plans";',
      true,
    ],
    [
      "modules/pokemon/api/example.ts",
      'import { getPlans } from "@modules/aoa/checkout/services/plans";',
      true,
    ],
    [
      "shared/utils/example.ts",
      'import type { Pokemon } from "@pokemon/models/pokemon";',
      true,
    ],
    ["shared/utils/example.ts", 'import Page from "@app/page";', true],
    [
      "modules/pokemon/models/example.ts",
      'import { state } from "@pokemon/state/example";',
      true,
    ],
    [
      "modules/aoa/checkout/hooks/example.ts",
      'import { getPixPayment } from "@aoa/checkout/server/payment-store";',
      true,
    ],
    [
      "modules/pokemon/components/organisms/Example.tsx",
      'import { Button } from "@components/atoms/Button";',
      false,
    ],
    [
      "modules/pokemon/components/organisms/Example.tsx",
      'import { cn } from "@shared/utils/cn";',
      false,
    ],
    [
      "shared/components/atoms/Example.tsx",
      'import { Provider } from "@design-system/Provider";',
      false,
    ],
    [
      "shared/components/atoms/Example.tsx",
      'import { Field } from "@components/molecules/PasswordField";',
      true,
    ],
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
      'import {Button} from "@/shared/components/atoms/Button";',
      false,
    ],
    [
      "components/atoms/Example.tsx",
      'export * from "@/modules/aoa/marketing/components/organisms/Header";',
      true,
    ],
    [
      "app/page.tsx",
      'async function load() { return import("@mui/material/Button"); }',
      true,
    ],
    ["app/page.tsx", 'const Button = require("@mui/material/Button");', true],
    ["app/page.tsx", 'const Button = maybe("@mui/material/Button");', false],
    ["app/page.tsx", "require();", false],
    [
      "app/page.tsx",
      'async function load() { const moduleName = "@mui/material/Button"; return import(moduleName); }',
      false,
    ],
    ["app/types.ts", 'type Button = import("@mui/material/Button");', true],
    [
      "modules/pokemon/api/example.ts",
      'import { getPlans } from "@/modules/aoa/checkout/services/plans";',
      true,
    ],
    [
      "shared/utils/example.ts",
      'import type { Pokemon } from "@/modules/pokemon/models/pokemon";',
      true,
    ],
    ["shared/utils/example.ts", 'import Page from "@/app/page";', true],
    [
      "modules/pokemon/models/example.ts",
      'import { useCheckoutStore } from "@/modules/pokemon/state/example";',
      true,
    ],
    [
      "modules/aoa/checkout/components/organisms/Example.tsx",
      'import { getPixPayment } from "@/modules/aoa/checkout/server/payment-store";',
      true,
    ],
    [
      "modules/aoa/checkout/hooks/example.ts",
      'import type { PixPayment } from "@/modules/aoa/checkout/models/pix-payment";',
      false,
    ],
    [
      "modules/aoa/checkout/components/organisms/Example.tsx",
      'import { Button } from "@/shared/components/atoms/Button";',
      false,
    ],
    [
      "modules/aoa/checkout/components/organisms/Example.tsx",
      'import { Header } from "@/modules/aoa/marketing/components/organisms/Header";',
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
  const files = ["shared", "modules"].flatMap((directory) =>
    fs
      .readdirSync(path.join(root, directory), { recursive: true })
      .map(String)
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => path.resolve(root, directory, file)),
  );
  const graph = new Map(
    files.map((file) => [
      file,
      [...fs.readFileSync(file, "utf8").matchAll(/from\s+['"]([^'"]+)['"]/g)]
        .map((m) => m[1])
        .map((source) => resolveLocalImport(source, file) + ".tsx")
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

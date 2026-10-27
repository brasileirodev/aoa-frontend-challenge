import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(
  fs.readFileSync(path.join(root, "tsconfig.json"), "utf8"),
);

// Keep the test runner and architecture checks aligned with TypeScript.
export const importAliases = Object.fromEntries(
  Object.entries(config.compilerOptions.paths).map(([alias, targets]) => [
    alias.replace(/\/\*$/, ""),
    path.resolve(root, targets[0].replace(/\/\*$/, "")),
  ]),
);

export function resolveLocalImport(source, importer) {
  if (source.startsWith("."))
    return path.resolve(path.dirname(importer), source);
  const alias = Object.keys(importAliases).find((name) =>
    source.startsWith(name + "/"),
  );
  return alias
    ? path.resolve(importAliases[alias], source.slice(alias.length + 1))
    : "";
}

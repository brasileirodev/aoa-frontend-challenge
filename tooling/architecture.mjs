import { resolveLocalImport } from "./import-paths.mjs";
const layers = ["atoms", "molecules", "organisms", "templates"];
function layer(file) {
  return layers.findIndex((l) => file.includes("/components/" + l + "/"));
}
const architecture = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      vendor: "Import third-party UI only inside atoms or design-system.",
      upward:
        "Atomic components cannot depend on higher layers or application routes.",
      public: "Do not re-export third-party UI contracts.",
      context: "Portfolio contexts must not depend on another project module.",
      shared: "Shared code must not depend on project modules or routes.",
      model:
        "Models must not depend on UI, state, services, API or server code.",
      server:
        "UI and hooks must use models or APIs, not server implementations.",
    },
  },
  create(context) {
    const file = context.filename.replaceAll("\\", "/");
    const allowed =
      file.includes("/components/atoms/") || file.includes("/design-system/");
    function check(node, source) {
      if (typeof source !== "string") return;
      const vendor = /^@(mui|emotion)\//.test(source);
      if (vendor && (!allowed || node.type.startsWith("Export")))
        context.report({ node, messageId: allowed ? "public" : "vendor" });
      const target = resolveLocalImport(source, context.filename);
      const normalized = target.replaceAll("\\", "/");
      const fromContext = file.match(/\/modules\/([^/]+)\//)?.[1];
      const toContext = normalized.match(/\/modules\/([^/]+)\//)?.[1];
      if (fromContext && toContext && fromContext !== toContext)
        context.report({ node, messageId: "context" });
      if (
        file.includes("/shared/") &&
        (toContext || normalized.includes("/app/"))
      )
        context.report({ node, messageId: "shared" });
      if (
        fromContext &&
        file.includes("/models/") &&
        /\/(components|hooks|state|services|api|server)\//.test(normalized)
      )
        context.report({ node, messageId: "model" });
      if (
        fromContext &&
        /\/(components|hooks)\//.test(file) &&
        normalized.includes("/server/")
      )
        context.report({ node, messageId: "server" });
      const from = layer(file);
      const to = layer(normalized + "/");
      if (
        from >= 0 &&
        (to > from ||
          normalized.includes("/app/") ||
          (from < 2 && normalized.includes("/models/registration-schema")))
      )
        context.report({ node, messageId: "upward" });
    }
    return {
      ImportDeclaration: (n) => check(n, n.source.value),
      ExportNamedDeclaration: (n) => n.source && check(n, n.source.value),
      ExportAllDeclaration: (n) => check(n, n.source.value),
      ImportExpression: (n) => check(n, n.source.value),
      CallExpression: (n) => {
        if (n.callee.name === "require" && n.arguments[0])
          check(n, n.arguments[0].value);
      },
      TSImportType: (n) => check(n, n.source.value),
    };
  },
};

export default architecture;

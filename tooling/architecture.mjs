import path from "node:path";
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
      const target = source.startsWith("@/")
        ? path.resolve(context.cwd, source.slice(2))
        : source.startsWith(".")
          ? path.resolve(path.dirname(context.filename), source)
          : "";
      const normalized = target.replaceAll("\\", "/");
      const from = layer(file);
      const to = layer(normalized + "/");
      if (
        from >= 0 &&
        (to > from ||
          normalized.includes("/app/") ||
          (from < 2 && normalized.includes("/lib/registration-schema")))
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

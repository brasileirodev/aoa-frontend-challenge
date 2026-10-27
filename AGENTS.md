# Project guidance

Read CHALLENGE.md and README.md before changing the registration flow.

## Portfolio architecture

Use the folder aliases declared in `tsconfig.json`: `@app/*`, `@modules/*`,
`@shared/*`, `@aoa/*`, `@pokemon/*`, `@components/*` (shared UI) and
`@design-system/*`. Prefer the most specific alias in application code.
The existing `@/*` remains compatible. Vitest and architecture checks read
the same mappings through `tooling/import-paths.mjs`. Aliases do not relax
module boundaries. Keep relative imports in Node tooling/config when needed
to bootstrap alias resolution.

Read [.codex/docs/arquitetura.md](.codex/docs/arquitetura.md) before adding files.
This single Next.js deployment hosts independent portfolio projects. AOA code
belongs in `modules/aoa` (checkout and marketing); Pokémon in `modules/pokemon`.
Never import one project module from another. `shared` contains only reusable
code without project rules and cannot depend on modules or app routes. Keep
Next routes in `app`, UI in module components, business contracts/rules in
models, React behavior in hooks/state, and HTTP/server implementations in their
respective layers. Preserve Atomic Design and MUI wrappers. Add folders only
when needed. The pending manual URL exercise belongs in
`modules/pokemon/routing/query.ts`, not a generic root utility file.

## Pokémon hands-on continuity

For the Pokémon study, start with [.codex/README.md](.codex/README.md) and
[the current checkpoint](.codex/docs/continuidade.md). Follow the canonical
[tutor profile](.codex/agents/pokemon-tutor.md). The learner writes application
code and tests; review/continue requests do not authorize editing the exercise.
Explain one step, let the learner implement, then validate actual files.
Use the repository skills [pokemon-study](.codex/skills/pokemon-study/SKILL.md)
and [pokemon-review](.codex/skills/pokemon-review/SKILL.md) as appropriate.
Keep checkpoint documentation current with verified results; never mark proposed
code or unverified work complete. US-08 remains the acceptance source of truth.

## Framework documentation

Study pacing update, 27/10/2026: Marcel explicitly postponed Pokémon unit tests
while the feature is exploratory. Do not create them or require them before the
next implementation step. Use code review, TypeScript and focused behavioral
checks as appropriate. Keep existing AOA tests and architecture checks. Formal
Pokémon tests and the final coverage requirement remain deferred delivery work,
not a blocker to learning. Resume the URL normalization exercise next.

Before suggesting every new implementation step in this study project, consult
Context7 MCP for the resources used in that step, including libraries, frameworks,
language APIs and testing tools. This is the learner's explicit project-wide
standard: prioritize didactic clarity and correctness grounded in documentation.
Check the current code and installed versions before proposing a solution.
Resolve the library with `resolve-library-id`, then retrieve relevant sections
with `query-docs`. Prefer the official library documentation in search results.

Check package.json and package-lock.json for the actual versions before querying.
The starter uses Next.js 16 (App Router), React 19, and Tailwind CSS 4 with
CSS-based theme configuration. Do not copy older framework patterns without
checking compatibility. If documentation for an exact version is unavailable,
state that limitation and verify the example against the installed packages.

If Context7 is unavailable or does not cover the resource, disclose the limitation
and consult the resource's official documentation. Distinguish this fallback from
a successful Context7 query. Never claim a lookup happened when it did not.
Use focused technical queries; do not send credentials or private project files.

## Context efficiency

Query only the topic needed for the current change, including the installed
framework version and relevant constraints. Reuse resolved library IDs, but make
a focused documentation query for each new implementation step. Avoid loading
entire guides. Explain the step's purpose, where it fits in the user flow, where
its code will be used, and why its file or abstraction is needed before showing
code. Include the documentation source and relevant version limitations.

The goal is better-grounded output and less rework, with efficient context use.
MCP calls and their results also consume tokens: do not promise or claim token
savings without measurements. Documentation does not replace code review or
validation of the resulting behavior. For business logic, consult documentation
for the language APIs or tools actually used; do not invent a framework dependency.
Editorial documentation changes alone do not require a framework lookup.

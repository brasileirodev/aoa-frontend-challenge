# Project guidance

Read CHALLENGE.md and README.md before changing the registration flow.

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

Context7 MCP is required for AI-assisted Next.js and Tailwind CSS work when
implementing framework-specific behavior, configuration, or troubleshooting.
Resolve the library with `resolve-library-id`, then retrieve relevant sections
with `query-docs`. Prefer the official library documentation in search results.

Check package.json and package-lock.json for the actual versions before querying.
The starter uses Next.js 16 (App Router), React 19, and Tailwind CSS 4 with
CSS-based theme configuration. Do not copy older framework patterns without
checking compatibility. If documentation for an exact version is unavailable,
state that limitation and verify the example against the installed packages.

If Context7 is unavailable, say so and consult official Next.js or Tailwind CSS
documentation. Never claim a documentation lookup happened when it did not.
Use focused technical queries; do not send credentials or private project files.

## Context efficiency

Query only the topic needed for the current change, including the installed
framework version and relevant constraints. Reuse library IDs and documentation
already retrieved in the session while they remain applicable. Fetch additional
sections only to resolve a specific gap; avoid loading entire guides or repeating
equivalent searches. Summarize the relevant API, version caveats, and source in
the implementation notes or PR when they explain a decision.

The goal is better-grounded output and less rework, with efficient context use.
MCP calls and their results also consume tokens: do not promise or claim token
savings without measurements. Documentation does not replace code review or
validation of the resulting behavior. Pure business-logic edits and unrelated
copy changes do not require a framework documentation lookup.

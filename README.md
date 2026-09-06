# Meridian

Meridian is a small SaaS product for team scheduling and planning. This repository contains the marketing site: a home page that introduces the product and a registration page. It is built with Next.js (App Router), TypeScript, Tailwind CSS, and Material UI.

## Getting started

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Other scripts:

```bash
npm run build         # production build
npm run start         # serve the production build
npm run lint          # ESLint
npm run format        # Prettier, write
npm run format:check  # Prettier, check only
```

## What's in the codebase

```
app/         routes: / (home) and /register
components/  shared UI components
lib/         small utilities
```

### Components

- `Button` - variants `primary` and `secondary`, sizes `sm`, `md`, `lg`
- `TextField` - Material UI input adapter with labels, errors and native input refs
- `Card` - bordered content surface
- `Container` - centered max-width page column
- `Header` - site header with navigation

### Design tokens

Defined in `design-system/tokens.css` and shared by Tailwind CSS and Material UI:

- Colors: `brand` scale (50-950), `neutral` scale (50-950), and semantic colors `success`, `warning`, `danger`, `info`
- Typography: Inter, exposed as `font-sans`
- Spacing: 4px base scale
- Border radius: `sm`, `md`, `lg`, `xl`, `2xl`

## Task

> See CHALLENGE.md file.

## AI-assisted development

Contributors using AI assistants must configure and use Context7 MCP for
Next.js and Tailwind CSS implementation, configuration, and framework-specific
troubleshooting. Retrieve documentation compatible with the versions in
`package.json` and `package-lock.json`, rather than relying only on model memory.
`AGENTS.md` defines the workflow for coding agents. Context7 is configured in each
developer's AI client; it is not an application dependency or a build requirement.

The goal is to improve output quality, avoid outdated APIs, and reduce rework.
Keep queries focused and reuse relevant documentation already in the session to
avoid unnecessary context. Lower token consumption is an objective, not a
guarantee: MCP requests and retrieved content also consume tokens. Validate the
implementation normally, even when its approach is grounded in documentation.

### Contributor setup (Codex)

Register the remote server in the user's Codex configuration:

```bash
codex mcp add context7 --url https://mcp.context7.com/mcp
```

Complete the browser authorization if prompted. Verify registration with
`codex mcp list`. If an already running session does not expose the tools,
restart the MCP connection from the client's settings, or reopen the Codex
client/session. Registration alone does not prove the current session has
loaded the tools.

Confirm the integration with an actual documentation lookup: resolve Next.js
using `resolve-library-id`, then use `query-docs` for a focused App Router
question that includes the installed version. Repeat for Tailwind CSS when
working on styling. If the exact version is not indexed, disclose the mismatch
and check compatibility with the installed packages. Other AI clients should
use the same remote endpoint with their own MCP configuration format.

If Context7 is unavailable, explicitly report the limitation and use official
framework documentation as a temporary fallback. Do not describe a fallback
as a successful Context7 lookup. No lookup is required for unrelated copy or
pure business-logic changes.

The remote HTTPS endpoint does not require a local Node process. Authentication
is managed locally by Codex; credentials must never be committed. As an
alternative to browser authentication, a personal API key can be supplied via
`--bearer-token-env-var CONTEXT7_API_KEY` when registering the server, with the
variable set in the environment that launches Codex. The application's `.env`
file is not automatically loaded by Codex.

References: [Codex MCP configuration](https://developers.openai.com/codex/mcp)
and [Context7 setup](https://github.com/upstash/context7).

### Material UI documentation MCP

Contributors must configure the official MUI MCP before AI-assisted Material UI
implementation or troubleshooting. This is a development-tool requirement;
it is not an application dependency or a prerequisite for building the app.
Material UI is now used through the local atomic component layer.

With a compatible Node.js runtime available to Codex, register the official
server in your personal Codex configuration:

```bash
codex mcp add mui -- npx -y @mui/mcp@latest
codex mcp get mui
```

On Windows, if Codex cannot launch `npx`, ensure that the intended Node.js
runtime and `npx` are available to the MCP process. Keep machine-specific paths
in personal Codex settings, outside the repository.

Reload the MCP connection or reopen the Codex session if its tools are missing.
Verify with a real documentation lookup, not just the configuration listing.
The official server exposes documentation tools including `useMuiDocs` and
`fetchDocs`. Use `useMuiDocs` to discover relevant MUI documentation and
`fetchDocs` to retrieve additional content from official documentation URLs
when needed. Inspect available tools after upgrades. Code generation via
`generateReactCode` is separate from documentation retrieval.
Check the installed Material UI version before choosing
examples, and keep requests focused. If the server is unavailable, disclose
that limitation and consult official MUI documentation as a temporary fallback.
Context7 remains the documentation source for Next.js and Tailwind CSS.

Reference: [Official MUI MCP setup](https://mui.com/material-ui/getting-started/mcp/).

## Component architecture

The interface uses Atomic Design and composition. Routes in `app/` represent pages
and supply content to templates; they remain server components.

```text
components/
  atoms/       Button, Link, TextField, Card, Typography, Container
  molecules/   PasswordField, RequirementList, SocialSignIn, FeatureCard
  organisms/   Header, Footer, HomeHero, FeaturesSection, registration sections
  templates/   SiteTemplate, RegistrationTemplate
design-system/ Provider and tokens.css
lib/           registration schema and shared utilities
```

Templates accept children and named slots (header, footer, aside). Atoms expose
local typed contracts and encapsulate MUI imports, variant mapping and refs.
Molecules compose atoms; organisms own feature behavior. Native semantic HTML is
allowed inside these components; there is no wrapper for every HTML tag.
Only atoms and design-system infrastructure may import MUI or Emotion. Direct
vendor reexports are forbidden, including types. ESLint enforces vendor and
upward layer boundaries; tests exercise the guard and detect component cycles.

Tailwind remains responsible for layout and responsive utilities, as required by
the challenge. The existing tokens now live in design-system/tokens.css and MUI
style overrides reference those CSS variables. CSS layer order is theme, base,
mui, components, utilities. The provider uses the Next 16 App Router cache adapter
for streamed styles; client boundaries are limited to interactive components and
MUI adapters. No global CssBaseline is added over Tailwind preflight.

Run `npm test`, `npm run lint`, `npm run typecheck` and `npm run build` to verify
the migration. Form tests cover invalid input, password rules, focus, accessible
errors, visibility controls and successful preview validation. Tests run locally;
CI and deployment gating remain a separate task. Registration still does not
create accounts, and Google sign-in remains disabled pending Auth0.

Documentation was consulted through Context7 for MUI/React composition and the
MUI MCP for MUI-specific Next.js integration guidance. Generic v15 cache examples
were adapted to the installed package's v16 entry point, following the official
version guidance.
References: [React composition](https://react.dev/learn/passing-props-to-a-component),
[Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/),
[MUI Next integration](https://mui.com/material-ui/integrations/nextjs/) and
[MUI Tailwind integration](https://mui.com/material-ui/integrations/tailwindcss/tailwindcss-v4/).

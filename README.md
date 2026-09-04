# Meridian

Meridian is a small SaaS product for team scheduling and planning. This repository contains the marketing site: a home page that introduces the product and a registration page. It is built with Next.js (App Router), TypeScript, and Tailwind CSS.

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
- `Input` - text input with an optional `label` prop
- `Card` - bordered content surface
- `Container` - centered max-width page column
- `Header` - site header with navigation

### Design tokens

Defined in `app/globals.css` via the Tailwind theme:

- Colors: `brand` scale (50-950), `neutral` scale (50-950), and semantic colors `success`, `warning`, `danger`, `info`
- Typography: Inter, exposed as `font-sans`
- Spacing: 4px base scale
- Border radius: `sm`, `md`, `lg`, `xl`, `2xl`

## Task

> See CHALLENGE.md file.

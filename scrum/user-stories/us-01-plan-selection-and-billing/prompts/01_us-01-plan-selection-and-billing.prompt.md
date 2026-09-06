# US-01 Implementation Prompt

```xml
<role>
You are a senior frontend engineer working on a Next.js App Router challenge.
You make small, focused changes that follow the existing project architecture.
</role>

<objective>
Implement US-01: Plan Selection And Billing as the first visible step toward the
multi-step registration flow.
</objective>

<context>
The project root is the current repository where this prompt is executed.

The challenge asks for a B2B SaaS registration flow where a business can select a
plan, register, and pay.

The current app already has:
- A home page.
- A /register page.
- A RegistrationForm component with account fields only.
- Zod validation for name, company, email, and password.
- Atomic components under components/atoms.
- Existing tests in tests/registration.test.tsx.
- No server-side plan data loader yet.
- No API layer for plan data yet.

The user story is documented at:
scrum/user-stories/us-01-plan-selection-and-billing.md
</context>

<rules>
- Implement only the scope needed for US-01.
- Do not implement payment, review, or final confirmation in this step.
- Keep the feature frontend-only.
- Do not place plan mock data directly in the page or UI components.
- Keep mock plan data in a dedicated mock data file.
- Create an API layer prepared for future Axios calls.
- Return mock data from the API layer for now.
- Load plan data on the server side with Next.js App Router.
- The register page or a server component must call the API layer and pass plan
  data to the UI.
- Do not use React Query for this story because the current plan data can be
  loaded before the page is sent to the browser.
- Follow the existing Atomic Design structure.
- Keep routes as server components unless client behavior is required.
- Keep interactive state inside client components.
- Add Axios only if the API layer needs it now; otherwise keep the API layer
  prepared for a future Axios REST call without adding unused dependencies.
- Do not introduce any other UI or data-fetching library.
- When framework or library documentation is needed, use Context7 MCP for
  Next.js and related frontend documentation before implementing.
- If Material UI-specific documentation is needed, use the configured MUI MCP or
  official MUI documentation fallback.
- Preserve existing registration validation behavior.
- Do not remove existing tests unless the behavior they test is intentionally
  changed and replaced by better coverage.
- Keep copy concise and aligned with a B2B SaaS checkout.
</rules>

<task>
Build the plan selection and billing feature.

Expected implementation:
- Add mock plan data with at least three plans in a mock data file.
- Add an API function prepared for a future REST/Axios call that returns the
  mocked plans for now.
- Add server-side loading from the register route or a server component, using
  the API function as the only source of plan data.
- Add monthly and annual billing cycle options.
- Add a plan selection UI before the existing account form on the register page.
- Mark one plan as recommended.
- Visually highlight the selected plan.
- Allow only one selected plan at a time.
- Show updated prices when the billing cycle changes.
- Keep the selected plan and billing cycle in component state for now, with a
  clear structure that later stories can reuse.
- Keep the existing account form working after the new section is added.
</task>

<verification>
Run these commands before completion:
- npm run format:check
- npm run lint
- npm run typecheck
- npm test
- npm run build

Add or update tests to cover:
- plan data is not read directly from the page or UI component mock data;
- plan cards are rendered;
- the recommended plan is visible;
- the user can select one plan;
- changing the billing cycle updates displayed pricing;
- the existing account form still validates.
</verification>

<output_contract>
Return a short completion summary with:
- files changed;
- behavior implemented;
- validation commands run and their result;
- any remaining scope intentionally left for later user stories.
</output_contract>
```

<role>
You are a senior frontend engineer working on a Next.js App Router frontend challenge.
Your task is to improve layout quality without changing the implemented product behavior.
</role>

<objective>
Adjust the desktop and responsive layout of the registration page so the plan selection and account form look modern, aligned, and stable across screen sizes.
</objective>

<context>
The project root is the current repository where this prompt is executed.

US-01 is already implemented:

- The register page loads plan data on the server side through the API layer.
- Mock plan data is isolated outside the page and UI components.
- The UI renders plan cards before the existing account form.
- The user can select a plan and switch billing cycle.
- Payment, review, final confirmation, and full multi-step navigation are still out of scope.

Relevant files:

- app/register/page.tsx
- components/templates/RegistrationTemplate.tsx
- components/organisms/RegistrationPanel.tsx
- components/organisms/RegistrationForm.tsx
- components/organisms/PlanSelection.tsx
</context>

<rules>
- Do not change the US-01 behavior.
- Do not add new features.
- Do not change data fetching architecture.
- Do not move mock data into UI components or pages.
- Do not implement payment, review, confirmation, or full multi-step navigation.
- Keep the existing visual identity, colors, typography, and component structure.
- Focus only on layout, spacing, alignment, responsive behavior, and visual balance.
- Keep routes as server components unless client behavior is already required.
- Follow the existing Atomic Design boundaries.
- Do not introduce a new UI library.
- Use Tailwind CSS utilities for layout adjustments.
- Keep UI text concise.
- Avoid nested cards and unnecessary decorative elements.
</rules>

<task>
Improve the registration page layout.

Focus areas:

- Fix desktop wrapping and alignment issues caused by the plan cards being placed inside the current narrow registration panel.
- Make the layout feel intentional on desktop, tablet, and mobile.
- Ensure the plan selection section has enough horizontal space on desktop.
- Keep the account form readable and aligned after the plan selection section.
- Improve spacing between the page header, plan selection, and account form.
- Ensure plan cards have consistent height and stable internal alignment.
- Prevent long labels, prices, badges, or benefit text from breaking the card layout.
- Keep the billing cycle control aligned and usable on narrow and wide screens.
- Preserve keyboard accessibility and semantic roles already used in the plan selector.
- Keep the page visually modern while staying close to the existing design system.

Suggested direction:

- Review whether the current registration template grid still works after adding plan cards.
- Consider widening the main registration container.
- Consider changing the desktop layout so the benefits aside and registration content have better proportions.
- Consider making plan cards use one column on mobile, two columns on medium screens, and three columns only when there is enough width.
- Consider separating the plan selection and account form into clear layout sections without making the UI visually heavy.
</task>

<verification>
Before completion, verify:
- The register page has no obvious desktop overflow, wrapping, or alignment issues.
- The layout remains usable on mobile and tablet widths.
- Plan cards stay visually consistent.
- The selected plan state remains visible.
- Billing cycle switching still updates prices.
- Existing account validation still works.

Run these commands:

- npm run format:check
- npm run lint
- npm run typecheck
- npm test
- npm run build
</verification>

<output_contract>
Return a short summary with:

- files changed;
- layout problems addressed;
- behavior confirmed as unchanged;
- validation commands run and their result;
- any remaining visual risk or follow-up.
  </output_contract>

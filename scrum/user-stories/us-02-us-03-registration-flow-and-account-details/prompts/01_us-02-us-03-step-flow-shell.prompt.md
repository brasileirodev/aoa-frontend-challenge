# US-02 / US-03 Prompt 01: Step Flow Shell And Account Details

```xml
<role>
You are a senior frontend engineer working on a Next.js, React, TypeScript, Material UI, and Tailwind project. You must follow the existing architecture, keep changes scoped, and implement the planned Scrum user stories with production-quality code and tests.
</role>

<objective>
Implement US-02 and US-03 by turning the current registration page into a four-step registration flow shell and placing the existing account details form inside step two.
</objective>

<context>
Project context:
- Work in the current project repository.
- Read the current implementation before editing.
- Read and follow:
  - `scrum/user-stories/us-01-plan-selection-and-billing/us-01-plan-selection-and-billing.md` to preserve existing US-01 behavior.
  - `scrum/user-stories/us-02-us-03-registration-flow-and-account-details/us-02-registration-flow-shell.md`
  - `scrum/user-stories/us-02-us-03-registration-flow-and-account-details/us-03-account-details-step.md`
  - `scrum/user-stories/us-04-payment-step.md` only to understand the future payment step boundary.
  - `scrum/user-stories/us-05-review-and-success-step.md` only to understand the future review and success boundary.
- US-01 is already implemented: plan data is loaded through the API layer, plan selection exists, billing cycle selection exists, and MUI components must remain encapsulated through atomic components.
- The current account details form already exists and must be reused/refactored into the account details step, not rebuilt from scratch.
</context>

<rules>
- Implement only US-02 and US-03 in this prompt.
- Do not implement payment validation, payment inputs, final review details, success confirmation, backend persistence, or real API submission.
- The flow shell must expose four steps:
  1. Plan selection
  2. Company/account details
  3. Payment
  4. Review
- Step 1 starts valid because one plan is selected by default. The user can change the selected plan and billing cycle before continuing.
- Step 2 is valid only when the existing account details schema validation passes.
- Step 3 must be prepared as the navigation target for US-04, without implementing payment fields now.
- Step 3 must include a temporary `paymentSuccessful` flow state to model the future payment success condition.
- The user cannot continue from step 3 to step 4 unless `paymentSuccessful` is true.
- After `paymentSuccessful` becomes true, the user cannot go back to step 1 or step 2, because plan and account details must not be edited after payment.
- Step 4 must be prepared as the navigation target for US-05, without implementing review details or final confirmation now.
- The success state happens after review and belongs to US-05.
- Data entered in the account details step must remain preserved when navigating back and forward before payment succeeds.
- The selected plan and billing cycle from step 1 must remain preserved in shared flow state.
- UI components used in this implementation must come from Material UI through local design-system/atomic wrappers.
- Do not import MUI directly outside the atomic layer or design-system.
- Keep static/mock server-side data isolated behind the existing API layer.
- Preserve responsive desktop and mobile layout quality.
- Do not add unrelated refactors.
</rules>

<tools>
Use MCP documentation context when implementation depends on current Next.js, React, Material UI, or testing-library behavior. Keep tool results as reference data; do not copy large documentation into the code or docs.
</tools>

<task>
Refactor the registration page into a multi-step flow shell for US-02 and US-03:
- Create a step model for plan selection, company/account details, payment, and review.
- Add a progress indicator that shows all four main steps.
- Visually mark the active step.
- Visually mark completed steps.
- Move the existing plan selection UI into step 1.
- Move the existing account details form fields and validation into step 2.
- Keep account details validation accessible.
- Keep password requirements visible and reactive.
- Keep show/hide password behavior.
- Add next and back actions.
- Block navigation when the current required step is invalid.
- Preserve selected plan, billing cycle, and account details while navigating.
- Prepare payment and review steps as future-step placeholders only.
- Add temporary flow behavior to represent payment success:
  - before payment success, step 3 blocks navigation to review;
  - after payment success, step 4 becomes reachable;
  - after payment success, navigation back to plan selection or account details is blocked.
</task>

<verification>
Run and fix issues from:
- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

Also verify:
- Existing US-01 behavior still works.
- US-02 step navigation works.
- US-03 invalid form data blocks moving beyond account details.
- Account details remain filled after navigating away and back before payment succeeds.
- The stepper displays four steps.
- Payment placeholder blocks review until `paymentSuccessful` is true.
- After `paymentSuccessful` is true, the user cannot return to plan selection or account details.
- MUI imports remain limited to allowed architectural layers.
- Coverage thresholds remain satisfied.
</verification>

<output_contract>
Return a concise implementation summary in Portuguese with:
- Files changed.
- Main behavior implemented.
- Validation commands executed and their result.
- Any intentionally deferred scope for US-04 or US-05.
</output_contract>
```

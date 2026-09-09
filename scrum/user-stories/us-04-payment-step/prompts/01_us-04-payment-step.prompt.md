# US-04 Prompt 01: Simulated Payment Step

```xml
<role>
You are a senior frontend engineer working on a Next.js, React, TypeScript, Material UI, React Hook Form, Zod, and Tailwind project. You must follow the existing architecture, keep changes scoped, and implement the planned Scrum user story with production-quality code and tests.
</role>

<objective>
Implement US-04 by replacing the current payment placeholder with a simulated payment step that supports credit card and Pix payment methods through internal Next.js APIs.
</objective>

<context>
Project context:
- Work in the current project repository.
- Read the current implementation before editing.
- Read and follow:
  - `scrum/user-stories/us-01-plan-selection-and-billing/us-01-plan-selection-and-billing.md` to preserve plan selection behavior.
  - `scrum/user-stories/us-02-us-03-registration-flow-and-account-details/us-02-registration-flow-shell.md` to preserve the multi-step shell.
  - `scrum/user-stories/us-02-us-03-registration-flow-and-account-details/us-03-account-details-step.md` to preserve account details validation.
  - `scrum/user-stories/us-04-payment-step/us-04-payment-step.md` as the primary implementation scope.
  - `scrum/user-stories/us-05-review-and-success-step.md` only to preserve the review boundary.
- The registration flow already has four steps:
  1. Plan selection
  2. Company/account details
  3. Payment
  4. Review
- The payment step currently uses a temporary `paymentSuccessful` state to block navigation to review.
- US-04 must replace the placeholder with a real frontend-only simulated payment experience.
</context>

<rules>
- Implement only US-04 in this prompt.
- Do not integrate with any real payment gateway.
- Do not implement final review details, success confirmation, backend persistence, invoice generation, stored payment methods, or PCI tokenization.
- Payment must be simulated through internal Next.js API routes.
- Create an internal API endpoint to create/process fake payment attempts.
- Create an internal API endpoint to return fake Pix payment data.
- Create an internal route/page that represents the fake Pix payment screen opened from the Pix QR Code/link.
- Pix confirmation must not use localStorage as the source of truth.
- Store fake Pix payment status in server memory, keyed by a unique `paymentId`.
- The in-memory Pix store must isolate simultaneous users by `paymentId`.
- Add a short expiration window for fake payment attempts to avoid stale in-memory entries.
- Store only non-sensitive demo metadata in memory, such as `paymentId`, method, status, and timestamps.
- The payment step must allow the user to choose between:
  - Credit card
  - Pix
- The selected payment method must be kept in the registration flow state.
- The user can continue to review only after the simulated payment succeeds.
- After payment succeeds, the existing rule remains: the user cannot go back to plan selection or account details.
- UI components used in this implementation must come from Material UI through local design-system/atomic wrappers.
- Do not import MUI directly outside the atomic layer or design-system.
- Keep API contracts typed and small.
- Keep sensitive card data limited to frontend demo state and simulated request payloads. Do not persist it.
- Do not display CVC outside the card input.
- Preserve responsive desktop and mobile layout quality.
- Do not add unrelated refactors.
</rules>

<tools>
Use MCP documentation context when implementation depends on current Next.js, React, Material UI, React Hook Form, Zod, or testing-library behavior. Keep tool results as reference data; do not copy large documentation into the code or docs.
</tools>

<task>
Implement the US-04 payment step:
- Replace the current payment placeholder with a payment method selector.
- Add a credit card payment form with:
  - Cardholder name
  - Card number
  - Expiration date
  - CVC
  - Billing postal code
- Add local validation for empty and clearly invalid card fields.
- Add live credit card feedback while the user types:
  - Detect card brand from the card number.
  - Detect or infer the issuing bank from the card number using local fake/demo BIN data.
  - Show the detected brand and bank as visual feedback in the card form.
  - Show a neutral fallback when brand or bank is unknown.
- Add a Pix payment option:
  - Call an internal API endpoint to create fake Pix payment data with a unique `paymentId`.
  - Display a Pix QR Code or QR-style visual that links to the internal fake Pix payment route.
  - Display the fake Pix copy text returned by the API.
  - Make clear in the UI that Pix payment is simulated.
  - Provide a way to check or refresh the payment status from the payment step.
- Add an internal fake Pix payment route/page:
  - It receives the `paymentId`.
  - It displays a small simulated Pix payment screen.
  - It shows the Pix payment as fake/demo.
  - It has a "Pay Pix" action.
  - When clicked, it marks that `paymentId` as paid in the in-memory server store.
  - It shows a success state after the fake payment is confirmed.
- Add an internal Next.js API endpoint for processing simulated payment.
  - It must accept the selected method and required payment data.
  - It must return a success response for valid simulated card data.
  - It must return a failure response for invalid simulated card data.
  - It must never persist sensitive card data.
- Add an internal Next.js API endpoint for fake Pix data/status.
  - It must return deterministic fake Pix data suitable for tests.
  - It must allow checking whether a specific `paymentId` is pending, paid, expired, or missing.
  - It must allow marking a specific fake Pix payment as paid from the internal fake payment route.
- Integrate successful simulated payment with the existing `paymentSuccessful` flow state.
- Keep the review step as a US-05 placeholder only.
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
- Existing US-02/US-03 step navigation and validation still work.
- The user can choose card or Pix.
- Invalid card data blocks simulated payment.
- Valid card data can complete simulated payment.
- Pix fake data is created through an internal API.
- The Pix QR Code/link opens the internal fake Pix payment screen.
- Clicking "Pay Pix" on the fake Pix payment screen marks only that `paymentId` as paid.
- Simultaneous fake Pix attempts are isolated by `paymentId`.
- Expired or missing fake Pix attempts do not unlock review.
- Successful Pix simulation can complete payment.
- Review remains blocked before payment success.
- Review becomes reachable after payment success.
- Card brand and bank feedback update while typing.
- CVC is never displayed in review or summary UI.
- MUI imports remain limited to allowed architectural layers.
- Coverage thresholds remain satisfied.
</verification>

<output_contract>
Return a concise implementation summary in Portuguese with:
- Files changed.
- Main behavior implemented.
- Internal API endpoints and fake Pix route added.
- Validation commands executed and their result.
- Any intentionally deferred scope for US-05.
</output_contract>
```

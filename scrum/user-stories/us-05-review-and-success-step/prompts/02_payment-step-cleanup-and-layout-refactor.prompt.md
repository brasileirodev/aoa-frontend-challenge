# Prompt 02: Payment Step Cleanup And Layout Refactor

Implement a focused cleanup and UX improvement pass for the payment step and
related checkout flow.

## Context

- This project uses Next.js, React, TypeScript, Material UI through local
  design-system and atomic components, Tailwind for layout utilities, React Hook
  Form for form state, and Zustand for checkout flow state.
- Keep the current payment behavior working: credit card payment, Pix payment,
  Pix polling, review redirection after successful payment, and checkout store
  flow.
- Prefer component composition and atomic design.
- Do not duplicate UI structure when only the inner content changes.

## Goals

### 1. Remove Browser Password-Save Modal

- Current behavior: after filling Company Details and entering the Payment step,
  the browser does not ask to save password immediately. But when switching from
  Credit Card to Pix, the browser shows a save-password modal using the email and
  password from Company Details.
- Analyze the real cause before changing code.
- Fix the flow so switching payment methods does not trigger the browser
  credential-save prompt.
- Do not mask the issue with unrelated UI-only changes.

### 2. Normalize Layout Between Credit Card And Pix Views

- Switching between Credit Card and Pix must not cause layout jumps.
- Credit Card and Pix payment content should share the same container background,
  width, spacing, and alignment.
- Prefer a composed payment content wrapper, for example a shared
  `PaymentMethodPanel` or similar component that receives `children`.
- The wrapper should own the common card/container structure.
- Credit Card and Pix should only provide their specific content.

### 4. Centralize Constants

- Move constants currently declared inside routes or components into centralized
  constants files.
- Example: move `CARD_BRAND_CACHE_TTL_MS` out of the route file.
- Group constants by domain when useful, such as payment, Pix, card brand, and
  checkout flow.
- Keep naming clear and avoid unrelated constant churn.

### 5. Extract Reusable Layout Components

- Search for repeated Tailwind layout strings or repeated UI structures.
- Example: `mx-auto w-full max-w-5xl space-y-8`.
- If a className pattern represents a reusable layout concept, extract it into a
  reusable component using composition.
- Follow the existing atomic/component architecture.
- Do not create abstractions for one-off styles.

### 6. Remove Duplicated Payment UI Actions

- The `Back to company details` action is duplicated between Pix and Credit Card
  flows.
- Refactor the Payment step so shared structure and shared actions are rendered
  once.
- Payment method-specific components should only render method-specific content.
- Use component composition so the payment method content changes, but the
  surrounding layout and actions remain shared.

## Constraints

- Keep the implementation scoped to this refactor and UX fix.
- Do not change business behavior unless required by the goals above.
- Keep Material UI usage encapsulated in project components.
- Avoid complex ternaries and large components.
- Prefer small named functions and clear component boundaries.
- Do not use third-party libraries directly inside UI components; keep
  wrappers/helpers when needed.
- Preserve accessibility and keyboard navigation.

## Validation

- Run formatting.
- Run typecheck.
- Run lint.
- Run the full test suite with coverage.
- Fix any regression caused by this change.

<role>
You are a senior frontend engineer refactoring an existing Next.js, React, TypeScript, Material UI, React Hook Form and Zustand-ready checkout implementation. Work with clean code principles, keep behavior stable, and make state ownership explicit.
</role>

<objective>
Refactor checkout state sharing to reduce prop overload by introducing a focused Zustand store for checkout flow state and validated step snapshots, without turning form fields into global onChange state.
</objective>

<context>
The project already implements a four-step registration checkout:
- Plan selection
- Company details
- Payment
- Review

US-04 payment behavior is already implemented and approved:
- card payment uses React Hook Form and submits directly to the internal payment API
- Pix creates a simulated payment attempt when the Pix view mounts
- Pix polling is silent and runs in the background
- Pix expires with a refresh action
- payment confirmation redirects to Review
- after payment confirmation, the user cannot return to Payment

Current refactor direction:
- Zustand should reduce prop drilling for checkout flow state
- Zustand must not mirror form fields on every keystroke
- React Hook Form remains responsible for form-local state and validation
- the company details form should save a validated snapshot to the store only when the user successfully advances to Payment
- card form data should not be stored globally because it is sent directly to the API on submit
- Pix lifecycle state should remain inside the Pix hook because it belongs to the mounted Pix view
</context>

<rules>
Do not change the approved user-facing behavior.
Do not introduce new features.
Do not store card form data in Zustand.
Do not store company details on each input change.
Do not move Pix loading, QR Code, countdown or polling state into the global store.
Use Zustand selectors to avoid subscribing components to the whole store.
Keep the store focused on checkout flow state and completed-step snapshots.
Keep Material UI usage encapsulated through the existing atomic design components.
Keep shared constants under lib/constants.
Preserve React Hook Form for form validation and field state.
Avoid large prop objects that simply recreate prop drilling through another shape.
</rules>

<task>
Install and configure Zustand if it is not already installed.

Create a focused checkout store that owns:
- active step
- selected plan id
- billing cycle
- account details snapshot after valid submit
- account details validity/completion state
- payment method
- payment success state
- checkout flow actions such as selecting plan, changing billing cycle, saving valid account details, changing payment method, confirming payment and navigating allowed steps

Refactor the checkout components to consume this store with selectors:
- RegistrationForm should stop owning checkout flow state with multiple useState calls.
- Plan selection should read and update plan and billing state through the store.
- Company details should keep React Hook Form local, then save the validated account details snapshot only when advancing to Payment.
- Payment should read method and payment success state from the store.
- Payment confirmation should update the store and redirect to Review.
- Review should remain locked after payment confirmation, with no return to Payment.

Keep the existing Pix hook responsible for:
- creating Pix on view mount
- clearing Pix state on unmount
- polling Pix status
- countdown expiration
- QR Code rendering data
- Pix loading and failure states
</task>

<verification>
Run and pass:
- npm run typecheck
- npm run lint
- npm test -- --run

The test suite must keep 100% coverage for statements, branches, functions, and lines.
</verification>

<output_contract>
Return a concise summary with:
- where the Zustand store was added
- which state moved into the store
- which state intentionally stayed local
- confirmation that approved behavior was preserved
- validation results
</output_contract>

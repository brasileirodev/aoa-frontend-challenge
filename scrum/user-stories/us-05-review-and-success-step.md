# US-05: Review And Success Step

## User Story

As a business user, I want to review my plan, account details, and payment
summary before confirming so that I can correct mistakes before completion.

## Priority

Must have

## Business Value

This story completes the registration journey and gives the user a clear finish
state.

## Deliverable Scope

Create the review step and the final success confirmation state.

## Acceptance Criteria

- The review step shows selected plan, billing cycle, price, and estimated total.
- The review step shows full name, company name, and work email.
- Payment details are masked.
- CVC is never displayed.
- The user can go back to edit previous steps.
- Confirmation shows a success message.
- Confirmation shows a fake reference code.
- The user can start over or return to the home page.

## Dependencies

- Plan selection and billing.
- Account details step.
- Payment step.

## Out Of Scope

- Real order creation.
- Email receipt.
- Backend persistence.

## Test Notes

- Test that review data matches previous steps.
- Test that card data is masked.
- Test that confirmation appears after final submit.

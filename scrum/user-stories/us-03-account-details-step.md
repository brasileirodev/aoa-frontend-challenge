# US-03: Account Details Step

## User Story

As a business user, I want to enter my account and company details so that I can
create a business account for the selected plan.

## Priority

Must have

## Business Value

This story collects the minimum account information needed for the registration
journey and reuses the existing validation work.

## Deliverable Scope

Refactor the current registration form into an account details step inside the
multi-step flow.

## Acceptance Criteria

- The user can enter full name, company name, work email, and password.
- Required fields show accessible validation errors.
- Invalid email is blocked.
- Password requirements are visible.
- Password requirements update while the user types.
- The user can show and hide the password.
- The user can continue only when account details are valid.

## Dependencies

- Existing registration schema.
- Registration flow shell.

## Out Of Scope

- Backend account creation.
- Email verification.
- Social sign-in.

## Test Notes

- Keep current validation coverage.
- Test that invalid account data blocks the next step.
- Test password visibility behavior.

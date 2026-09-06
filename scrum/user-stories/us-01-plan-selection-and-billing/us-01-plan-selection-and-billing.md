# US-01: Plan Selection And Billing

## User Story

As a business user, I want to compare plans, select one option, and choose a
billing cycle so that I can understand what I will buy before creating my
account.

## Priority

Must have

## Business Value

This story covers the challenge requirement that businesses must be able to
select a plan. It also gives the registration flow a clear SaaS checkout context.

## Deliverable Scope

Create the first step of the registration flow with static plan cards and billing
cycle selection.

## Acceptance Criteria

- The user can see at least three plans.
- Each plan shows name, price, billing cycle, description, and main benefits.
- One plan is visually marked as recommended.
- The user can select only one plan.
- The selected plan is visually active.
- The user can switch between monthly and annual billing.
- The selected plan and billing cycle are available for the next steps.

## Dependencies

- Static plan data.
- Shared registration flow state.

## Out Of Scope

- Pricing API.
- Coupons.
- Taxes.
- Custom enterprise quote flow.

## Test Notes

- Test plan selection.
- Test billing cycle change.
- Test that the selected plan appears in the review step.

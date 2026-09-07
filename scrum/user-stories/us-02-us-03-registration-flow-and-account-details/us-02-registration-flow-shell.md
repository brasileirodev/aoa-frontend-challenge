# US-02: Registration Flow Shell

## User Story

As a business user, I want a clear multi-step flow so that I know where I am and
what remains before finishing registration.

## Priority

Must have

## Business Value

This story turns the current single-step form into the requested multi-step
experience and creates the structure for the other features.

## Deliverable Scope

Build the flow shell with step state, progress indicator, next action, back
action, and data preservation between steps.

## Acceptance Criteria

- The flow displays all main steps.
- The current step is visually active.
- Completed steps are visually marked.
- The user can move forward and backward.
- The user cannot continue when the current step is invalid.
- Entered data is preserved when the user navigates between steps.
- The layout works on mobile and desktop.

## Dependencies

- Step definitions.
- Shared flow state model.

## Out Of Scope

- Persisting progress after page reload.
- Deep links for each step.
- Server-side sessions.

## Test Notes

- Test next and back navigation.
- Test that invalid steps block progress.
- Test that entered data remains available after navigation.

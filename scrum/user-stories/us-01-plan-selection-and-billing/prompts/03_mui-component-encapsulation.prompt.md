# US-01 Prompt 03: MUI Component Encapsulation

## Goal

Refactor the plan selection UI to prefer Material UI components while keeping the project's atomic design architecture.

## Context

- The project already uses Material UI.
- Third-party UI imports must stay encapsulated inside `components/atoms` or `design-system`.
- Feature components must not import Material UI directly.
- The existing US-01 behavior must be preserved:
  - Load plans through the API layer.
  - Render plan cards on the registration page.
  - Allow users to select a plan.
  - Allow users to switch the billing cycle.
  - Keep the selected plan visible through the card state.

## Implementation Instructions

- Use the MUI MCP documentation context when choosing or validating Material UI components.
- Create or update local atomic wrappers for the needed Material UI components.
- Replace custom UI structures in `PlanSelection` with local atomic components that wrap MUI.
- Keep the modern and responsive layout already implemented.
- Do not import Material UI directly in organisms, templates, app routes, or lib files.
- Do not change business behavior or mocked data structure unless required by the refactor.

## Acceptance Criteria

- `PlanSelection` consumes only project components and application utilities.
- MUI imports are limited to the atomic layer.
- Plan selection and billing cycle interactions keep working.
- Existing registration tests keep passing.
- Architecture, typecheck, lint, format, and build validations pass.

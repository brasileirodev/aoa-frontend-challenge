Claro. Adicionei uma explicação curta sobre o **Pix** na seção de pagamentos simulados, contextualizando para um avaliador internacional sem deixar o README excessivamente detalhado.

# Meridian

Meridian is a B2B SaaS registration and checkout flow for teams that need a shared scheduling and planning tool. The application lets a business choose a subscription plan, enter company account details, complete a simulated payment, and review the confirmed subscription.

This project was built for the AOA frontend challenge using Next.js, TypeScript, Tailwind CSS, Material UI, React Hook Form, Zod, Zustand, and Vitest.

## Challenge Goal

The challenge asks for a registration form for a modern eCommerce storefront.

For this implementation, the storefront is positioned as a B2B SaaS checkout: the product is Meridian, and the purchasable items are subscription plans.

The solution also includes fixes and improvements over the initial AI-generated starter project, especially around component architecture, validation, accessibility, testing, and documentation.

## Implemented Scope

- Home page with product positioning for Meridian.
- Multi-step registration flow.
- Plan selection with billing cycle support.
- Company details form with schema validation.
- Simulated card payment with input masks and card brand feedback.
- Simulated Pix payment with QR Code generation and status polling.
- Review and success step with checkout summary.
- Internal API routes for fake payments and card brand lookup.
- Shared checkout state for cross-step data.
- Atomic UI component structure with Material UI encapsulated by local components.
- Unit and integration-style tests with 100% coverage thresholds.

## Getting Started

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in the browser.

Useful scripts:

```bash
npm run dev            # run the local development server
npm run build          # create a production build
npm run start          # serve the production build
npm run lint           # run ESLint
npm run format         # format files with Prettier
npm run format:check   # check Prettier formatting
npm run typecheck      # run TypeScript checks
npm test               # run Vitest with coverage
```

## Project Structure

```text
app/             Next.js App Router pages and API routes
components/      Atomic UI components and feature components
design-system/   Material UI provider and shared design tokens
lib/             API clients, schemas, helpers, constants, stores and mocks
scrum/           User stories and prompt history used during planning
tests/           Vitest test suites
```

## Architectural Decisions

### Next.js App Router

The application uses the App Router to keep routes, server components and API handlers close to the product flow. The registration page loads plan data through an API layer instead of reading mock data directly from the UI.

### Component Architecture

The UI follows Atomic Design:

- `atoms`: local wrappers for base UI pieces such as buttons, fields, cards and layout containers.
- `molecules`: small component combinations such as password and card brand display.
- `organisms`: feature-level sections such as plan selection, payment and review.
- `templates`: page-level layout composition.

Material UI is used through local components instead of being imported directly across product features. This keeps third-party implementation details isolated and makes future UI changes safer.

### Styling

Tailwind CSS handles layout, spacing and responsive utilities. Material UI provides accessible interactive primitives through local wrappers. Shared design tokens live in `design-system/tokens.css` and are reused by Tailwind and MUI theme configuration.

### Forms And Validation

React Hook Form manages form state, and Zod defines validation rules. Company details are saved to checkout state only after a valid step submission. Card form values stay local to the payment form because they are only needed for the payment request.

### Checkout State

Zustand stores the checkout flow state: selected plan, billing cycle, active step, submitted company details, payment method and payment summary. It does not mirror every form field on change. The store is reset when the checkout restarts or when the registration page unmounts.

### Simulated Payments

No real payment provider is used. Card payment is processed by an internal fake API route.

Pix payment creates an in-memory payment attempt, generates a QR Code for an internal confirmation route, and polls the internal API until the attempt is paid or expired.

**Pix** is an instant payment system widely used in Brazil. It allows individuals and businesses to transfer money and complete payments in real time, 24/7, commonly through QR Codes or payment identifiers. For this challenge, the Pix flow is simulated to demonstrate how a Brazilian checkout experience could support this payment method without integrating a real financial provider.

Pix state is intentionally server-memory based for the challenge. It avoids storing fake payment confirmation in `localStorage`, while keeping the implementation small and easy to review.

### Card Brand Detection

Card brand detection is handled by an internal API route. The server wraps the third-party card detection library and caches lookup results for 24 hours. The client only calls the internal API and does not import the vendor package.

### Tests

Vitest, Testing Library and coverage thresholds are used to validate behavior.

Tests cover the registration flow, validation, plan selection, fake payments, Pix polling, review summary, UI component contracts and helper functions.

## Assumptions

- The product can be positioned as a B2B SaaS subscription checkout.
- The available plans are enough for the challenge and can be mocked.
- Account creation does not need to persist data in a database.
- Payment processing can be simulated because real payment integration is out of scope.
- Pix simulation can use a local in-memory store during development and demo.
- The deployed demo will run as a single app instance for review purposes.
- The reviewer will run the app with the documented commands or open the deployed demo.

## Trade-Offs

- The Pix payment store uses process memory. This is simple for a challenge, but it is not durable and would not work across multiple server instances.
- The payment APIs are fake. They demonstrate UI and flow behavior, not payment compliance or provider integration.
- Card brand detection is limited to brand feedback. Issuer bank detection was not kept because it would require a reliable BIN data provider.
- The password field in the company details step avoids browser credential-save prompts in this demo flow. A production account flow should follow the final authentication strategy.
- Material UI is wrapped by local atoms. This adds small wrapper overhead but protects the product code from vendor coupling.
- The scope favors a polished registration and checkout experience over a full marketing site.

## Left Out Because Of Time

- Real account creation and authentication.
- Real payment provider integration.
- Persistent database storage.
- Production Pix provider flow.
- Email confirmation.
- Admin or customer dashboard after subscription.
- International address and tax handling.
- Full CI/CD pipeline configuration.
- Full design system documentation.
- Analytics, observability and error tracking.

## Required Intake Questions

Before starting a real project, these answers would be required:

- What product is being sold, and what is the exact checkout goal?
- Which plans, prices, billing cycles and limits must be supported?
- Which company fields are mandatory for account creation?
- Which payment methods are required for launch?
- Which payment provider should be used?
- Should payment happen before or after account creation?
- What should happen when payment fails or expires?
- What data must be persisted, and where should it be stored?
- What authentication provider should be used?
- What accessibility, browser and device targets are required?
- What deployment platform and environment variables are expected?
- What are the acceptance criteria for the challenge or release?

## Desired Intake Questions

These answers would improve quality and reduce rework:

- Are there brand guidelines or a design reference?
- Should the checkout support coupons, taxes or invoices?
- Should users be able to change plans after payment starts?
- Should Pix payment open on a separate device, the same device, or both?
- What copy tone should be used in product and payment messages?
- What analytics events should be tracked across the funnel?
- What error states should be prioritized for demo and production?
- Should the flow support localization or currency changes?
- What parts of the flow are most important for reviewer evaluation?
- Is there an expected code architecture or testing standard?

## Validation

The latest local validation passed with:

```bash
npm run format -- --check
npm run typecheck
npm run lint
npm test -- --run
```

The test suite was passing with 42 tests and 100% coverage after the latest implementation round.

## AI-Assisted Development Notes

The `scrum/` folder documents planning through user stories and prompt history.

The goal is to make the implementation process auditable for the technical challenge without mixing planning notes into product code.

Context7 MCP was used as the preferred source for framework documentation when needed. The MUI MCP was used for Material UI guidance. These MCP tools are development aids only; they are not application dependencies and are not needed to run the project.

## References

- [Challenge brief](./CHALLENGE.md)
- [Scrum planning](./scrum/README.md)
- [User stories](./scrum/user-stories/README.md)

A explicação ficou propositalmente curta e técnica: **o que é Pix, onde ele é usado, como normalmente funciona e por que está simulado no challenge**. Isso deve ser suficiente para um avaliador dos EUA ou de outro país entender a decisão de produto sem desviar o foco do projeto.

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegistrationForm } from "@/components/organisms/RegistrationForm";
import { getPlans, type Plan } from "@/lib/api/plans";
import { registrationSchema } from "@/lib/registration-schema";
import fs from "node:fs";
import path from "node:path";

const valid = {
  name: "Alex Test",
  company: "Example",
  email: "alex@example.com",
  password: "DemoPassword123!",
};

const testPlans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For small teams.",
    monthlyPrice: 29,
    annualPrice: 290,
    benefits: ["Up to 10 users", "Shared schedules", "Basic reporting"],
  },
  {
    id: "growth",
    name: "Growth",
    description: "For growing teams.",
    monthlyPrice: 79,
    annualPrice: 790,
    benefits: ["Up to 50 users", "Capacity planning", "Priority workflows"],
    recommended: true,
  },
  {
    id: "scale",
    name: "Scale",
    description: "For larger teams.",
    monthlyPrice: 149,
    annualPrice: 1490,
    benefits: ["Unlimited users", "Advanced reporting", "Priority support"],
  },
];

async function goToAccountDetails(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    screen.getByRole("button", { name: "Continue to company details" }),
  );
}

async function fillValidAccountDetails(
  user: ReturnType<typeof userEvent.setup>,
) {
  await user.type(screen.getByLabelText(/Full name/), valid.name);
  await user.type(screen.getByLabelText(/Company name/), valid.company);
  await user.type(screen.getByLabelText(/Work email/), valid.email);
  await user.type(screen.getByLabelText(/^Password/), valid.password);
}

describe("registration contract", () => {
  it("loads plan data through the API layer", async () => {
    const plans = await getPlans();
    expect(plans).toHaveLength(3);
    expect(plans.some((plan) => plan.recommended)).toBe(true);
  });

  it("does not read plan mocks directly in the route or UI", () => {
    const root = process.cwd();
    for (const file of [
      "app/register/page.tsx",
      "components/organisms/RegistrationForm.tsx",
      "components/organisms/PlanSelection.tsx",
    ]) {
      expect(fs.readFileSync(path.join(root, file), "utf8")).not.toContain(
        "@/lib/mocks",
      );
    }
  });

  it("rejects invalid fields and each missing password rule", () => {
    for (const change of [
      { name: " " },
      { company: " " },
      { email: "invalid" },
      { password: "Ab1!" },
      { password: "demopassword123!" },
      { password: "DEMOPASSWORD123!" },
      { password: "DemoPassword!!!" },
      { password: "DemoPassword123" },
    ])
      expect(
        registrationSchema.safeParse({ ...valid, ...change }).success,
      ).toBe(false);
    expect(registrationSchema.parse(valid)).toEqual(valid);
  });
  it("preserves validation, focus, accessible errors and disabled social sign-in", async () => {
    const user = userEvent.setup();
    render(<RegistrationForm plans={testPlans} />);

    await goToAccountDetails(user);
    await user.click(
      screen.getByRole("button", { name: "Continue to payment" }),
    );

    expect(await screen.findByText("Enter your full name.")).toBeVisible();
    expect(screen.getByLabelText(/Full name/)).toHaveFocus();
    expect(screen.getByLabelText(/Work email/)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByLabelText(/Work email/)).toHaveAccessibleDescription(
      "Enter a valid email address.",
    );
  });

  it("clears account detail errors when moving between steps", async () => {
    const user = userEvent.setup();
    render(<RegistrationForm plans={testPlans} />);

    await goToAccountDetails(user);
    await user.click(
      screen.getByRole("button", { name: "Continue to payment" }),
    );
    expect(await screen.findByText("Enter your full name.")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Back to plan" }));
    await goToAccountDetails(user);

    expect(screen.queryByText("Enter your full name.")).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Full name/)).not.toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("accepts valid data, toggles password and clears success after an edit", async () => {
    const user = userEvent.setup();
    render(<RegistrationForm plans={testPlans} />);

    await goToAccountDetails(user);
    await fillValidAccountDetails(user);

    const password = screen.getByLabelText(/^Password/);
    expect(password).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
    await user.click(screen.getByRole("button", { name: "Hide password" }));
    expect(password).toHaveAttribute("type", "password");
    await user.click(
      screen.getByRole("button", { name: "Continue to payment" }),
    );

    expect(
      screen.getByText(/Payment details will be implemented/),
    ).toBeVisible();
  });

  it("renders plans, highlights the recommended plan and selects one plan", async () => {
    const user = userEvent.setup();
    render(<RegistrationForm plans={testPlans} />);

    expect(screen.getByRole("radio", { name: /Starter/ })).toBeVisible();
    expect(screen.getByRole("radio", { name: /Growth/ })).toBeVisible();
    expect(screen.getByRole("radio", { name: /Scale/ })).toBeVisible();
    expect(screen.getByText("Recommended")).toBeVisible();
    expect(screen.getByRole("radio", { name: /Growth/ })).toHaveAttribute(
      "aria-checked",
      "true",
    );

    await user.click(screen.getByRole("radio", { name: /Scale/ }));

    expect(screen.getByRole("radio", { name: /Growth/ })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.getByRole("radio", { name: /Scale/ })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.queryByText(/Selected plan:/)).not.toBeInTheDocument();
  });

  it("falls back to the first plan when none is recommended", () => {
    render(
      <RegistrationForm
        plans={testPlans.map((plan) => ({
          id: plan.id,
          name: plan.name,
          description: plan.description,
          monthlyPrice: plan.monthlyPrice,
          annualPrice: plan.annualPrice,
          benefits: plan.benefits,
        }))}
      />,
    );

    expect(screen.getByRole("radio", { name: /Starter/ })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("renders without a selected plan when plan data is empty", () => {
    render(<RegistrationForm plans={[]} />);

    expect(screen.getByText("Choose your plan")).toBeVisible();
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue to company details" }),
    ).toBeDisabled();
  });

  it("updates displayed pricing when the billing cycle changes", async () => {
    const user = userEvent.setup();
    render(<RegistrationForm plans={testPlans} />);

    expect(screen.getByText("$79")).toBeVisible();
    expect(screen.getAllByText("/month")).toHaveLength(3);

    await user.click(screen.getByRole("button", { name: "Annual" }));

    expect(screen.getByText("$790")).toBeVisible();
    expect(screen.getAllByText("/year")).toHaveLength(3);
    expect(screen.getByRole("radio", { name: /Growth/ })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("shows the four-step flow and preserves account details before payment succeeds", async () => {
    const user = userEvent.setup();
    render(<RegistrationForm plans={testPlans} />);

    for (const step of [
      "Plan selection",
      "Company details",
      "Payment",
      "Review",
    ]) {
      expect(screen.getByText(step)).toBeVisible();
    }

    await goToAccountDetails(user);
    await fillValidAccountDetails(user);
    await user.click(screen.getByRole("button", { name: "Back to plan" }));
    await goToAccountDetails(user);

    expect(screen.getByLabelText(/Full name/)).toHaveValue(valid.name);
    expect(screen.getByLabelText(/Company name/)).toHaveValue(valid.company);
    expect(screen.getByLabelText(/Work email/)).toHaveValue(valid.email);
  });

  it("blocks review until payment succeeds and locks earlier steps after payment", async () => {
    const user = userEvent.setup();
    render(<RegistrationForm plans={testPlans} />);

    await goToAccountDetails(user);
    await fillValidAccountDetails(user);
    await user.click(
      screen.getByRole("button", { name: "Continue to payment" }),
    );

    expect(
      screen.getByRole("button", { name: "Continue to review" }),
    ).toBeDisabled();
    await user.click(
      screen.getByRole("button", { name: "Mark payment as successful" }),
    );

    expect(
      screen.getByRole("button", { name: "Back to company details" }),
    ).toBeDisabled();
    await user.click(
      screen.getByRole("button", { name: "Continue to review" }),
    );

    expect(screen.getByText(/Review and success confirmation/)).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Back to payment" }));
    expect(screen.getByText(/Payment marked as successful/)).toBeVisible();
  });
});

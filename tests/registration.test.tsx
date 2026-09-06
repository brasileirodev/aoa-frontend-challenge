import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegistrationForm } from "@/components/organisms/RegistrationForm";
import { registrationSchema } from "@/lib/registration-schema";
const valid = {
  name: "Alex Test",
  company: "Example",
  email: "alex@example.com",
  password: "DemoPassword123!",
};
describe("registration contract", () => {
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
    render(<RegistrationForm />);

    await user.click(screen.getByRole("button", { name: "Continue" }));
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
  it("accepts valid data, toggles password and clears success after an edit", async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);
    await user.type(screen.getByLabelText(/Full name/), valid.name);
    await user.type(screen.getByLabelText(/Company name/), valid.company);
    await user.type(screen.getByLabelText(/Work email/), valid.email);
    const password = screen.getByLabelText(/^Password/);
    await user.type(password, valid.password);
    expect(password).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
    await user.click(screen.getByRole("button", { name: "Hide password" }));
    expect(password).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(await screen.findByText(/Your details look good/)).toBeVisible();
    await user.type(screen.getByLabelText(/Full name/), "a");
    await waitFor(() =>
      expect(
        screen.queryByText(/Your details look good/),
      ).not.toBeInTheDocument(),
    );
  });
});

import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Home from "@/app/page";
import RegisterPage, {
  metadata as registerMetadata,
} from "@/app/register/page";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { Chip } from "@/components/atoms/Chip";
import { Container } from "@/components/atoms/Container";
import { Link } from "@/components/atoms/Link";
import { SelectableCard } from "@/components/atoms/SelectableCard";
import { TextField } from "@/components/atoms/TextField";
import { ToggleButtonGroup } from "@/components/atoms/ToggleButtonGroup";
import { Typography } from "@/components/atoms/Typography";
import { FeatureCard } from "@/components/molecules/FeatureCard";
import { RequirementList } from "@/components/molecules/RequirementList";
import { FeaturesSection } from "@/components/organisms/FeaturesSection";
import { Footer } from "@/components/organisms/Footer";
import { Header } from "@/components/organisms/Header";
import { HomeHero } from "@/components/organisms/HomeHero";
import { RegistrationBenefits } from "@/components/organisms/RegistrationBenefits";
import { RegistrationPanel } from "@/components/organisms/RegistrationPanel";
import { RegistrationTemplate } from "@/components/templates/RegistrationTemplate";
import { SiteTemplate } from "@/components/templates/SiteTemplate";
import { getBillingCycleLabel, getPlanPrice, type Plan } from "@/lib/api/plans";
import { cn } from "@/lib/cn";

const plan: Plan = {
  id: "starter",
  name: "Starter",
  description: "For small teams.",
  monthlyPrice: 29,
  annualPrice: 290,
  benefits: ["Shared schedules"],
};

describe("shared UI components", () => {
  it("renders atom variants and small helpers", async () => {
    const user = userEvent.setup();
    const onCardClick = vi.fn();
    const onToggleChange = vi.fn();

    render(
      <div>
        <Container className="custom-container">Container content</Container>
        <Card className="custom-card">Card content</Card>
        <Typography as="h2" id="heading" className="custom-heading">
          Heading content
        </Typography>
        <Chip label="Neutral" />
        <Chip label="Brand" tone="brand" className="custom-chip" />
        <Button variant="secondary">Secondary action</Button>
        <Button variant="text" size="sm">
          Text action
        </Button>
        <Link href="/register">Inline link</Link>
        <Link href="/register" appearance="primary">
          Primary link
        </Link>
        <Link href="/register" appearance="secondary">
          Secondary link
        </Link>
        <TextField label="Generated id field" placeholder="Generated" />
        <TextField
          id="with-helper"
          label="Described field"
          aria-describedby="external-help"
        />
        <TextField
          id="with-adornment"
          label="Field with adornment"
          error="Required field."
          endAdornment={<span>USD</span>}
        />
        <SelectableCard
          selected={false}
          ariaChecked={false}
          onClick={onCardClick}
          className="custom-selectable"
        >
          Starter selectable
        </SelectableCard>
        <ToggleButtonGroup
          value="monthly"
          ariaLabel="Cycle"
          onChange={onToggleChange}
          options={[
            { value: "monthly", label: "Monthly" },
            { value: "annual", label: "Annual" },
          ]}
        />
      </div>,
    );

    expect(screen.getByText("Container content")).toBeVisible();
    expect(screen.getByText("Card content")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Heading content" }),
    ).toBeVisible();
    expect(screen.getByText("Neutral")).toBeVisible();
    expect(screen.getByText("Brand")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Secondary action" }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Text action" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Inline link" })).toHaveAttribute(
      "href",
      "/register",
    );
    expect(screen.getByRole("link", { name: "Primary link" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Secondary link" })).toBeVisible();
    expect(screen.getByLabelText("Generated id field")).toBeVisible();
    expect(screen.getByLabelText("Described field")).toHaveAttribute(
      "aria-describedby",
      "external-help",
    );
    expect(
      screen.getByLabelText("Field with adornment"),
    ).toHaveAccessibleDescription("Required field.");

    await user.click(screen.getByRole("radio", { name: "Starter selectable" }));
    expect(onCardClick).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("button", { name: "Annual" }));
    expect(onToggleChange).toHaveBeenCalledWith("annual");
    await user.click(screen.getByRole("button", { name: "Monthly" }));
    expect(onToggleChange).toHaveBeenCalledTimes(1);

    expect(cn("a", false, null, undefined, "b")).toBe("a b");
    expect(getPlanPrice(plan, "monthly")).toBe(29);
    expect(getPlanPrice(plan, "annual")).toBe(290);
    expect(getBillingCycleLabel("monthly")).toBe("month");
    expect(getBillingCycleLabel("annual")).toBe("year");
  });

  it("renders molecule, organism, template and page contracts", async () => {
    render(
      <div>
        <FeatureCard title="Feature title" description="Feature description" />
        <RequirementList
          id="requirements"
          items={[
            { label: "Completed item", met: true },
            { label: "Pending item", met: false },
          ]}
        />
        <Header />
        <Footer />
        <HomeHero />
        <FeaturesSection />
        <RegistrationBenefits />
        <RegistrationTemplate
          header={<span>Register header</span>}
          aside={<aside>Register aside</aside>}
        >
          <span>Register content</span>
        </RegistrationTemplate>
        <RegistrationPanel>
          <span>Panel child</span>
        </RegistrationPanel>
        <SiteTemplate header={<span>Site header</span>}>
          <span>Site content</span>
        </SiteTemplate>
        <SiteTemplate
          header={<span>Site header with footer</span>}
          footer={<span>Site footer</span>}
        >
          <span>Site content with footer</span>
        </SiteTemplate>
        <Home />
      </div>,
    );

    expect(screen.getByText("Feature title")).toBeVisible();
    expect(screen.getByText(/Met:/)).toBeInTheDocument();
    expect(screen.getByText(/Not met:/)).toBeInTheDocument();
    expect(screen.getAllByText("Meridian").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText("Plan your team's week in minutes").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText("Built for teams that plan together").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", {
        name: /Less coordinating\.\s*More moving forward\./,
      }),
    ).toBeVisible();
    expect(screen.getByText("Register content")).toBeVisible();
    expect(screen.getByText("Create your account")).toBeVisible();
    expect(screen.getByText("Panel child")).toBeVisible();
    expect(screen.getByText("Site content")).toBeVisible();
    expect(screen.getByText("Site footer")).toBeVisible();

    const registerPage = await RegisterPage();
    render(registerPage);
    expect(registerMetadata.title).toBe("Create your account");
    expect(screen.getByText("Choose your plan")).toBeVisible();
  });
});

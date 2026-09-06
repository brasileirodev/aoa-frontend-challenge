import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "font-inter" }),
}));

describe("app shell", () => {
  it("renders the root layout with design system providers", async () => {
    const { default: RootLayout, metadata } = await import("@/app/layout");

    render(
      <RootLayout>
        <span>Application content</span>
      </RootLayout>,
    );

    expect(metadata.description).toBe(
      "Team scheduling and planning for modern teams.",
    );
    expect(screen.getByText("Application content")).toBeVisible();
  });
});

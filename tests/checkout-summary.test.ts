import { describe, expect, it } from "vitest";
import {
  findSelectedPlan,
  formatCurrency,
  getDefaultSelectedPlanId,
  getPaymentSummaryLabel,
  getPlanBillingSummary,
} from "@/lib/checkout-summary";
import type { Plan } from "@/lib/api/plans";

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For small teams.",
    monthlyPrice: 29,
    annualPrice: 290,
    benefits: [],
  },
  {
    id: "growth",
    name: "Growth",
    description: "For growing teams.",
    monthlyPrice: 79,
    annualPrice: 790,
    benefits: [],
    recommended: true,
  },
];

describe("checkout summary helpers", () => {
  it("formats plan, default selection and payment summaries", () => {
    expect(formatCurrency(79)).toBe("$79");
    expect(findSelectedPlan(plans, "growth")?.name).toBe("Growth");
    expect(findSelectedPlan(plans, "missing")).toBeNull();
    expect(getDefaultSelectedPlanId(plans)).toBe("growth");
    expect(getDefaultSelectedPlanId([plans[0]])).toBe("starter");
    expect(getDefaultSelectedPlanId([])).toBe("");
    expect(getPlanBillingSummary(plans[1], "annual")).toEqual({
      billingLabel: "year",
      formattedPrice: "$790",
      estimatedTotal: "$790",
    });
    expect(getPaymentSummaryLabel(null)).toBe("Payment confirmed");
    expect(getPaymentSummaryLabel({ method: "pix" })).toBe(
      "Pix payment confirmed",
    );
    expect(
      getPaymentSummaryLabel({
        method: "card",
        brand: "Visa",
        bank: "Meridian Demo Bank",
        maskedNumber: "**** 1111",
      }),
    ).toBe("Visa - **** 1111");
  });
});

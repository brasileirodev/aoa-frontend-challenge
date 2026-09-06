export type BillingCycle = "monthly" | "annual";

export type Plan = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  benefits: string[];
  recommended?: boolean;
};

export async function getPlans(): Promise<Plan[]> {
  const { mockPlans } = await import("@/lib/mocks/plans");

  return mockPlans;
}

export function getPlanPrice(plan: Plan, billingCycle: BillingCycle): number {
  return billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
}

export function getBillingCycleLabel(billingCycle: BillingCycle): string {
  return billingCycle === "monthly" ? "month" : "year";
}

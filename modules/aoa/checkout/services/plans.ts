import type { Plan } from "@aoa/checkout/models/plans";

export async function getPlans(): Promise<Plan[]> {
  const { mockPlans } = await import("@aoa/checkout/data/plans");

  return mockPlans;
}

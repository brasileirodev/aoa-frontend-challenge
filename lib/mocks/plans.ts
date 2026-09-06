import type { Plan } from "@/lib/api/plans";

export const mockPlans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For small teams starting their shared planning workflow.",
    monthlyPrice: 29,
    annualPrice: 290,
    benefits: ["Up to 10 users", "Shared schedules", "Basic reporting"],
  },
  {
    id: "growth",
    name: "Growth",
    description: "For growing teams that need capacity and priority planning.",
    monthlyPrice: 79,
    annualPrice: 790,
    benefits: ["Up to 50 users", "Capacity planning", "Priority workflows"],
    recommended: true,
  },
  {
    id: "scale",
    name: "Scale",
    description: "For larger teams with advanced planning and support needs.",
    monthlyPrice: 149,
    annualPrice: 1490,
    benefits: ["Unlimited users", "Advanced reporting", "Priority support"],
  },
];

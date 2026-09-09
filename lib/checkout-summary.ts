import {
  getBillingCycleLabel,
  getPlanPrice,
  type BillingCycle,
  type Plan,
} from "@/lib/api/plans";
import type { PaymentSummary } from "@/lib/stores/checkout-store";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function findSelectedPlan(plans: Plan[], selectedPlanId: string) {
  return plans.find((plan) => plan.id === selectedPlanId) ?? null;
}

export function getDefaultSelectedPlanId(plans: Plan[]) {
  return plans.find((plan) => plan.recommended)?.id ?? plans[0]?.id ?? "";
}

export function getPlanBillingSummary(plan: Plan, billingCycle: BillingCycle) {
  const price = getPlanPrice(plan, billingCycle);
  const billingLabel = getBillingCycleLabel(billingCycle);

  return {
    billingLabel,
    formattedPrice: formatCurrency(price),
    estimatedTotal: formatCurrency(price),
  };
}

export function getPaymentSummaryLabel(paymentSummary: PaymentSummary | null) {
  if (!paymentSummary) return "Payment confirmed";
  if (paymentSummary.method === "pix") return "Pix payment confirmed";

  return [
    paymentSummary.brand,
    paymentSummary.bank,
    paymentSummary.maskedNumber,
  ].join(" - ");
}

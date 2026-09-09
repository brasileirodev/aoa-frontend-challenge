"use client";

import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { Notice } from "@/components/atoms/Notice";
import type { Plan } from "@/lib/api/plans";
import {
  findSelectedPlan,
  getPaymentSummaryLabel,
  getPlanBillingSummary,
} from "@/lib/checkout-summary";
import { useCheckoutStore } from "@/lib/stores/checkout-store";

type SummaryItem = [label: string, value: string];

export function ReviewStep({
  onStartOver,
  plans,
}: {
  onStartOver: () => void;
  plans: Plan[];
}) {
  const selectedPlanId = useCheckoutStore((state) => state.selectedPlanId);
  const billingCycle = useCheckoutStore((state) => state.billingCycle);
  const accountDetails = useCheckoutStore((state) => state.accountDetails);
  const paymentSummary = useCheckoutStore((state) => state.paymentSummary);
  const referenceCode = useCheckoutStore((state) => state.referenceCode);
  const selectedPlan = findSelectedPlan(plans, selectedPlanId);

  if (!selectedPlan || !accountDetails || !paymentSummary) {
    return (
      <Notice tone="warning">
        Review data is not available. Start over to create a new checkout.
      </Notice>
    );
  }

  return (
    <section aria-labelledby="review-title" className="space-y-6">
      <Notice tone="success">
        Plan contracted successfully. Payment was confirmed in the simulated
        checkout.
      </Notice>
      <Card className="space-y-5">
        <Header
          titleId="review-title"
          eyebrow={"Reference " + referenceCode}
          title="Subscription confirmed"
          description={selectedPlan.name + " is ready in this demo flow."}
        />
        <ReviewSummary
          accountDetails={accountDetails}
          billingCycle={billingCycle}
          paymentSummaryLabel={getPaymentSummaryLabel(paymentSummary)}
          selectedPlan={selectedPlan}
        />
      </Card>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" size="lg" onClick={onStartOver}>
          Start over
        </Button>
        <Button type="button" variant="secondary" size="lg" href="/">
          Return home
        </Button>
      </div>
    </section>
  );
}

function ReviewSummary({
  accountDetails,
  billingCycle,
  paymentSummaryLabel,
  selectedPlan,
}: {
  accountDetails: { name: string; company: string; email: string };
  billingCycle: "monthly" | "annual";
  paymentSummaryLabel: string;
  selectedPlan: Plan;
}) {
  const planSummary = getPlanBillingSummary(selectedPlan, billingCycle);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <SummarySection
        title="Plan"
        items={[
          ["Plan", selectedPlan.name],
          ["Billing", billingCycle],
          [
            "Price",
            planSummary.formattedPrice + "/" + planSummary.billingLabel,
          ],
          ["Estimated total", planSummary.estimatedTotal],
        ]}
      />
      <SummarySection
        title="Company"
        items={[
          ["Full name", accountDetails.name],
          ["Company", accountDetails.company],
          ["Work email", accountDetails.email],
        ]}
      />
      <SummarySection
        title="Payment"
        items={[
          ["Status", "Payment confirmed"],
          ["Method", paymentSummaryLabel],
        ]}
      />
    </div>
  );
}

function Header({
  description,
  eyebrow,
  title,
  titleId,
}: {
  description: string;
  eyebrow: string;
  title: string;
  titleId: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold tracking-wide text-brand-700 uppercase">
        {eyebrow}
      </p>
      <h2 id={titleId} className="text-2xl font-bold text-neutral-950">
        {title}
      </h2>
      <p className="text-sm text-neutral-600">{description}</p>
    </div>
  );
}

function SummarySection({
  title,
  items,
}: {
  title: string;
  items: SummaryItem[];
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-neutral-950">{title}</h3>
      <SummaryList items={items} />
    </div>
  );
}

function SummaryList({ items }: { items: SummaryItem[] }) {
  return (
    <dl className="space-y-3">
      {items.map(([label, value]) => (
        <div key={label} className="space-y-1">
          <dt className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {label}
          </dt>
          <dd className="text-sm font-medium wrap-break-word text-neutral-900">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

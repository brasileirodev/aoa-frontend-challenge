"use client";

import { Chip } from "@/components/atoms/Chip";
import { SelectableCard } from "@/components/atoms/SelectableCard";
import { ToggleButtonGroup } from "@/components/atoms/ToggleButtonGroup";
import {
  getBillingCycleLabel,
  getPlanPrice,
  type BillingCycle,
  type Plan,
} from "@/lib/api/plans";

export function PlanSelection({
  plans,
  selectedPlanId,
  billingCycle,
  onPlanChange,
  onBillingCycleChange,
}: {
  plans: Plan[];
  selectedPlanId: string;
  billingCycle: BillingCycle;
  onPlanChange: (planId: string) => void;
  onBillingCycleChange: (billingCycle: BillingCycle) => void;
}) {
  return (
    <section aria-labelledby="plan-selection-title" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-widest text-brand-700 uppercase">
            Step 1
          </p>
          <h2
            id="plan-selection-title"
            className="mt-2 text-xl font-semibold text-neutral-900"
          >
            Choose your plan
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Select the subscription that fits your team before creating the
            account.
          </p>
        </div>
        <ToggleButtonGroup
          value={billingCycle}
          ariaLabel="Billing cycle"
          onChange={onBillingCycleChange}
          className="w-full sm:w-auto sm:min-w-52"
          options={[
            { value: "monthly", label: "Monthly" },
            { value: "annual", label: "Annual" },
          ]}
        />
      </div>

      <div
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        role="radiogroup"
        aria-label="Subscription plans"
      >
        {plans.map((plan) => {
          const selected = plan.id === selectedPlanId;
          const price = getPlanPrice(plan, billingCycle);

          return (
            <SelectableCard
              key={plan.id}
              selected={selected}
              onClick={() => onPlanChange(plan.id)}
              ariaChecked={selected}
              className="min-h-72 min-w-0"
            >
              <span className="flex min-h-24 items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="block text-base font-semibold text-neutral-900">
                    {plan.name}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-neutral-500">
                    {plan.description}
                  </span>
                </span>
                {plan.recommended && <Chip label="Recommended" tone="brand" />}
              </span>

              <span className="mt-auto block">
                <span className="flex flex-wrap items-end gap-x-1">
                  <span className="text-3xl font-semibold text-neutral-900">
                    ${price}
                  </span>
                  <span className="pb-1 text-sm text-neutral-500">
                    /{getBillingCycleLabel(billingCycle)}
                  </span>
                </span>

                <span className="mt-5 block border-t border-neutral-100 pt-5">
                  <span className="sr-only">Plan benefits</span>
                  <span className="grid gap-2">
                    {plan.benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="flex gap-2 text-sm leading-5 text-neutral-600"
                      >
                        <span aria-hidden="true" className="text-brand-600">
                          ✓
                        </span>
                        {benefit}
                      </span>
                    ))}
                  </span>
                </span>
              </span>
            </SelectableCard>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/atoms/Button";
import { Notice } from "@/components/atoms/Notice";
import { Stepper } from "@/components/atoms/Stepper";
import { AccountDetailsStep } from "@/components/organisms/AccountDetailsStep";
import { PaymentStep } from "@/components/organisms/PaymentStep";
import { PlanSelection } from "@/components/organisms/PlanSelection";
import type { Plan } from "@/lib/api/plans";
import {
  registrationSchema,
  type RegistrationValues,
} from "@/lib/registration-schema";
import { useCheckoutStore } from "@/lib/stores/checkout-store";

const steps = [
  { label: "Plan selection" },
  { label: "Company details" },
  { label: "Payment" },
  { label: "Review" },
];

export function RegistrationForm({ plans }: { plans: Plan[] }) {
  const recommendedPlan = plans.find((plan) => plan.recommended) ?? plans[0];
  const activeStep = useCheckoutStore((state) => state.activeStep);
  const selectedPlanId = useCheckoutStore((state) => state.selectedPlanId);
  const accountDetailsCompleted = useCheckoutStore(
    (state) => state.accountDetailsCompleted,
  );
  const paymentSuccessful = useCheckoutStore(
    (state) => state.paymentSuccessful,
  );
  const initializeCheckout = useCheckoutStore(
    (state) => state.initializeCheckout,
  );
  const continueFromPlan = useCheckoutStore((state) => state.continueFromPlan);
  const goBack = useCheckoutStore((state) => state.goBack);
  const markAccountDetailsAsEditing = useCheckoutStore(
    (state) => state.markAccountDetailsAsEditing,
  );
  const saveAccountDetails = useCheckoutStore(
    (state) => state.saveAccountDetails,
  );
  const {
    register,
    control,
    trigger,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    mode: "onTouched",
    defaultValues: { name: "", company: "", email: "", password: "" },
  });

  useEffect(() => {
    initializeCheckout(recommendedPlan?.id ?? "");
  }, [initializeCheckout, recommendedPlan?.id]);

  const password = useWatch({ control, name: "password" });
  const canContinueFromPlan = Boolean(selectedPlanId);
  const completedSteps = [
    activeStep > 0 && canContinueFromPlan ? 0 : null,
    activeStep > 1 && accountDetailsCompleted ? 1 : null,
    paymentSuccessful ? 2 : null,
  ].filter((step): step is number => step !== null);

  function goBackToPreviousStep() {
    clearErrors();
    goBack();
  }

  async function continueFromAccountDetails() {
    const valid = await trigger(undefined, { shouldFocus: true });

    if (valid) {
      saveAccountDetails(getValues());
    }
  }

  function goToAccountDetails() {
    clearErrors();
    continueFromPlan();
  }

  return (
    <div className="space-y-10">
      <Stepper
        steps={steps}
        activeStep={activeStep}
        completedSteps={completedSteps}
      />

      {activeStep === 0 && (
        <div className="space-y-8">
          <PlanSelection plans={plans} />
          <Button
            type="button"
            size="lg"
            disabled={!canContinueFromPlan}
            onClick={goToAccountDetails}
          >
            Continue to company details
          </Button>
        </div>
      )}

      {activeStep === 1 && (
        <form
          noValidate
          onChange={markAccountDetailsAsEditing}
          onSubmit={(event) => {
            event.preventDefault();
            void continueFromAccountDetails();
          }}
          className="space-y-8 border-t border-neutral-200 pt-8"
        >
          <AccountDetailsStep
            errors={errors}
            password={password}
            register={register}
          />
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={goBackToPreviousStep}
            >
              Back to plan
            </Button>
            <Button
              type="submit"
              size="lg"
              className="gap-3 disabled:opacity-60"
            >
              Continue to payment
              <span aria-hidden="true">→</span>
            </Button>
          </div>
        </form>
      )}

      {activeStep === 2 && (
        <div className="space-y-6 border-t border-neutral-200 pt-8">
          <PaymentStep />
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={goBackToPreviousStep}
              disabled={paymentSuccessful}
            >
              Back to company details
            </Button>
          </div>
        </div>
      )}

      {activeStep === 3 && (
        <div className="space-y-6 border-t border-neutral-200 pt-8">
          <Notice tone="info">
            Review and success confirmation will be implemented in US-05. The
            flow has reached this step because payment is marked as successful.
          </Notice>
        </div>
      )}
    </div>
  );
}

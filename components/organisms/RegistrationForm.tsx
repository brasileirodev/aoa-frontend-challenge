"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/atoms/Button";
import { Notice } from "@/components/atoms/Notice";
import { Stepper } from "@/components/atoms/Stepper";
import { AccountDetailsStep } from "@/components/organisms/AccountDetailsStep";
import { PlanSelection } from "@/components/organisms/PlanSelection";
import type { BillingCycle, Plan } from "@/lib/api/plans";
import {
  registrationSchema,
  type RegistrationValues,
} from "@/lib/registration-schema";

const steps = [
  { label: "Plan selection" },
  { label: "Company details" },
  { label: "Payment" },
  { label: "Review" },
];

export function RegistrationForm({ plans }: { plans: Plan[] }) {
  const recommendedPlan = plans.find((plan) => plan.recommended) ?? plans[0];
  const [selectedPlanId, setSelectedPlanId] = useState(
    recommendedPlan?.id ?? "",
  );
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [activeStep, setActiveStep] = useState(0);
  const [accountDetailsValid, setAccountDetailsValid] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const {
    register,
    control,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    mode: "onTouched",
    defaultValues: { name: "", company: "", email: "", password: "" },
  });
  const password = useWatch({ control, name: "password" });
  const canContinueFromPlan = Boolean(selectedPlanId);
  const completedSteps = [
    activeStep > 0 && canContinueFromPlan ? 0 : null,
    activeStep > 1 && accountDetailsValid ? 1 : null,
    paymentSuccessful ? 2 : null,
  ].filter((step): step is number => step !== null);

  function goBack() {
    clearErrors();
    setActiveStep((currentStep) => {
      const previousStep = currentStep - 1;

      return Math.max(previousStep, 0);
    });
  }

  async function continueFromAccountDetails() {
    const valid = await trigger(undefined, { shouldFocus: true });

    setAccountDetailsValid(valid);
    if (valid) {
      setActiveStep(2);
    }
  }

  function goNext() {
    clearErrors();
    if (activeStep === 0 && canContinueFromPlan) setActiveStep(1);
    if (activeStep === 2 && paymentSuccessful) setActiveStep(3);
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
          <PlanSelection
            plans={plans}
            selectedPlanId={selectedPlanId}
            billingCycle={billingCycle}
            onPlanChange={setSelectedPlanId}
            onBillingCycleChange={setBillingCycle}
          />
          <Button
            type="button"
            size="lg"
            disabled={!canContinueFromPlan}
            onClick={goNext}
          >
            Continue to company details
          </Button>
        </div>
      )}

      {activeStep === 1 && (
        <form
          noValidate
          onChange={() => setAccountDetailsValid(false)}
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
            <Button type="button" variant="secondary" onClick={goBack}>
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
          <Notice tone={paymentSuccessful ? "success" : "info"}>
            {paymentSuccessful
              ? "Payment marked as successful for this frontend preview."
              : "Payment details will be implemented in US-04. This step is prepared to block review until payment succeeds."}
          </Notice>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={goBack}
              disabled={paymentSuccessful}
            >
              Back to company details
            </Button>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setPaymentSuccessful(true)}
                disabled={paymentSuccessful}
              >
                Mark payment as successful
              </Button>
              <Button
                type="button"
                size="lg"
                disabled={!paymentSuccessful}
                onClick={goNext}
              >
                Continue to review
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeStep === 3 && (
        <div className="space-y-6 border-t border-neutral-200 pt-8">
          <Notice tone="info">
            Review and success confirmation will be implemented in US-05. The
            flow has reached this step because payment is marked as successful.
          </Notice>
          <Button type="button" variant="secondary" onClick={goBack}>
            Back to payment
          </Button>
        </div>
      )}
    </div>
  );
}

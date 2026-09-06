"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/atoms/Button";
import { TextField } from "@/components/atoms/TextField";
import { PasswordField } from "@/components/molecules/PasswordField";
import { RequirementList } from "@/components/molecules/RequirementList";
import { PlanSelection } from "@/components/organisms/PlanSelection";
import type { BillingCycle, Plan } from "@/lib/api/plans";
import {
  passwordRules,
  registrationSchema,
  type RegistrationValues,
} from "@/lib/registration-schema";

export function RegistrationForm({ plans }: { plans: Plan[] }) {
  const recommendedPlan = plans.find((plan) => plan.recommended) ?? plans[0];
  const [selectedPlanId, setSelectedPlanId] = useState(
    recommendedPlan?.id ?? "",
  );
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [validated, setValidated] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    mode: "onTouched",
    defaultValues: { name: "", company: "", email: "", password: "" },
  });
  const password = useWatch({ control, name: "password" });

  return (
    <div className="space-y-10">
      <PlanSelection
        plans={plans}
        selectedPlanId={selectedPlanId}
        billingCycle={billingCycle}
        onPlanChange={setSelectedPlanId}
        onBillingCycleChange={setBillingCycle}
      />
      <form
        noValidate
        onChange={() => setValidated(false)}
        onSubmit={handleSubmit(() => setValidated(true))}
        className="max-w-2xl space-y-5 border-t border-neutral-200 pt-8"
      >
        <TextField
          id="register-name"
          label="Full name"
          autoComplete="name"
          placeholder="Alex Morgan"
          required
          maxLength={100}
          error={errors.name?.message}
          {...register("name")}
        />
        <TextField
          id="register-company"
          label="Company name"
          autoComplete="organization"
          placeholder="Your company"
          required
          maxLength={120}
          error={errors.company?.message}
          {...register("company")}
        />
        <TextField
          id="register-email"
          label="Work email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="alex@company.com"
          required
          maxLength={254}
          error={errors.email?.message}
          {...register("email")}
        />
        <div>
          <PasswordField
            id="register-password"
            label="Password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            required
            maxLength={128}
            aria-describedby="password-requirements"
            error={errors.password?.message}
            {...register("password")}
          />
          <RequirementList
            id="password-requirements"
            items={passwordRules.map((rule) => ({
              label: rule.label,
              met: rule.test(password),
            }))}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="mt-2 w-full gap-3 disabled:opacity-60"
        >
          {isSubmitting ? "Checking details…" : "Continue"}
          <span aria-hidden="true">→</span>
        </Button>
        <div role="status" aria-live="polite">
          {validated && (
            <p className="rounded-lg border border-brand-200 bg-brand-50 p-4 text-sm leading-6 text-brand-900">
              Your details look good. This preview validates the form only; no
              account has been created.
            </p>
          )}
        </div>
        <p className="text-center text-xs leading-5 text-neutral-500">
          Registration preview. Your details are not sent or saved.
        </p>
      </form>
    </div>
  );
}

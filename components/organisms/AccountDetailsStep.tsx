"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { PasswordField } from "@/components/molecules/PasswordField";
import { RequirementList } from "@/components/molecules/RequirementList";
import { TextField } from "@/components/atoms/TextField";
import {
  passwordRules,
  type RegistrationValues,
} from "@/lib/registration-schema";

export function AccountDetailsStep({
  errors,
  password,
  register,
}: {
  errors: FieldErrors<RegistrationValues>;
  password: string;
  register: UseFormRegister<RegistrationValues>;
}) {
  return (
    <div className="max-w-2xl space-y-5">
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
    </div>
  );
}

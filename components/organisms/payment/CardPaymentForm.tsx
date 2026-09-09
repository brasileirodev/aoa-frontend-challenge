"use client";

import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { Chip } from "@/components/atoms/Chip";
import { Notice } from "@/components/atoms/Notice";
import { TextField } from "@/components/atoms/TextField";
import type { CardPaymentInput } from "@/lib/payment";

type CardFeedback = {
  brand: string;
  bank: string;
};

export function CardPaymentForm({
  cardForm,
  feedback,
  message,
  paymentSuccessful,
  onFieldChange,
  onSubmit,
}: {
  cardForm: UseFormReturn<CardPaymentInput>;
  feedback: CardFeedback;
  message: string;
  paymentSuccessful: boolean;
  onFieldChange: () => void;
  onSubmit: (cardPayment: CardPaymentInput) => void | Promise<void>;
}) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = cardForm;

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Card className="space-y-5">
        <div className="flex flex-wrap gap-2">
          <Chip label={"Brand: " + feedback.brand} tone="brand" />
          <Chip label={"Bank: " + feedback.bank} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Cardholder name"
            error={errors.cardholderName?.message}
            disabled={paymentSuccessful}
            {...register("cardholderName", { onChange: onFieldChange })}
          />
          <TextField
            label="Card number"
            error={errors.cardNumber?.message}
            disabled={paymentSuccessful}
            inputMode="numeric"
            autoComplete="cc-number"
            {...register("cardNumber", { onChange: onFieldChange })}
          />
          <TextField
            label="Expiration date"
            placeholder="MM/YY"
            error={errors.expirationDate?.message}
            disabled={paymentSuccessful}
            autoComplete="cc-exp"
            {...register("expirationDate", { onChange: onFieldChange })}
          />
          <TextField
            label="CVC"
            error={errors.cvc?.message}
            disabled={paymentSuccessful}
            inputMode="numeric"
            autoComplete="cc-csc"
            type="password"
            {...register("cvc", { onChange: onFieldChange })}
          />
          <TextField
            label="Billing postal code"
            error={errors.billingPostalCode?.message}
            disabled={paymentSuccessful}
            autoComplete="postal-code"
            {...register("billingPostalCode", { onChange: onFieldChange })}
          />
        </div>
      </Card>

      {message && (
        <Notice tone={paymentSuccessful ? "success" : "warning"}>
          {message}
        </Notice>
      )}

      <Button type="submit" size="lg" disabled={paymentSuccessful}>
        Process simulated card payment
      </Button>
    </form>
  );
}

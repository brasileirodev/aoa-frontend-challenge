"use client";

import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { Chip } from "@/components/atoms/Chip";
import { Notice } from "@/components/atoms/Notice";
import { TextField } from "@/components/atoms/TextField";
import {
  formatCardNumber,
  formatCvc,
  formatExpirationDate,
  type CardPaymentInput,
} from "@/lib/payment";

type CardFeedback = {
  brand: string;
  bank: string;
};

export function CardPaymentForm({
  cardForm,
  feedback,
  message,
  paymentSuccessful,
  onBack,
  onFieldChange,
  onSubmit,
}: {
  cardForm: UseFormReturn<CardPaymentInput>;
  feedback: CardFeedback;
  message: string;
  paymentSuccessful: boolean;
  onBack?: () => void;
  onFieldChange: () => void;
  onSubmit: (cardPayment: CardPaymentInput) => void | Promise<void>;
}) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = cardForm;
  const cardNumber = register("cardNumber");
  const expirationDate = register("expirationDate");
  const cvc = register("cvc");

  function setMaskedField(
    field: "cardNumber" | "expirationDate" | "cvc",
    value: string,
    formatter: (value: string) => string,
  ) {
    setValue(field, formatter(value), {
      shouldDirty: true,
      shouldValidate: false,
    });
    onFieldChange();
  }

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
            {...cardNumber}
            onChange={(event) =>
              setMaskedField("cardNumber", event.target.value, formatCardNumber)
            }
          />
          <TextField
            label="Expiration date"
            placeholder="MM/YY"
            error={errors.expirationDate?.message}
            disabled={paymentSuccessful}
            autoComplete="cc-exp"
            inputMode="numeric"
            {...expirationDate}
            onChange={(event) =>
              setMaskedField(
                "expirationDate",
                event.target.value,
                formatExpirationDate,
              )
            }
          />
          <TextField
            label="CVC"
            error={errors.cvc?.message}
            disabled={paymentSuccessful}
            inputMode="numeric"
            autoComplete="cc-csc"
            type="password"
            {...cvc}
            onChange={(event) =>
              setMaskedField("cvc", event.target.value, formatCvc)
            }
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

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {onBack ? (
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            disabled={paymentSuccessful}
          >
            Back to company details
          </Button>
        ) : (
          <span aria-hidden="true" />
        )}
        <Button type="submit" size="lg" disabled={paymentSuccessful}>
          Process simulated card payment
        </Button>
      </div>
    </form>
  );
}

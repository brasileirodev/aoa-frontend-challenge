"use client";

import type { ChangeEvent } from "react";
import type { UseFormRegisterReturn, UseFormReturn } from "react-hook-form";
import { TextField } from "@/components/atoms/TextField";
import { CardBrandMark } from "@/components/molecules/CardBrandMark";
import {
  formatCardholderName,
  formatCardNumber,
  formatCvc,
  formatExpirationDate,
  type CardFeedback,
  type CardPaymentInput,
} from "@/lib/payment";

export function CardPaymentForm({
  cardForm,
  feedback,
  paymentSuccessful,
  onFieldChange,
}: {
  cardForm: UseFormReturn<CardPaymentInput>;
  feedback: CardFeedback;
  paymentSuccessful: boolean;
  onFieldChange: () => void;
}) {
  const {
    formState: { errors },
    register,
  } = cardForm;
  const cardholderName = register("cardholderName");
  const cardNumber = register("cardNumber");
  const expirationDate = register("expirationDate");
  const cvc = register("cvc");

  function setMaskedField(
    event: ChangeEvent<HTMLInputElement>,
    field: UseFormRegisterReturn,
    value: string,
    formatter: (value: string) => string,
  ) {
    event.target.value = formatter(value);
    void field.onChange(event);
    onFieldChange();
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <TextField
          label="Card number"
          error={errors.cardNumber?.message}
          disabled={paymentSuccessful}
          inputMode="numeric"
          autoComplete="cc-number"
          {...cardNumber}
          onChange={(event) =>
            setMaskedField(
              event,
              cardNumber,
              event.target.value,
              formatCardNumber,
            )
          }
        />
      </div>

      <TextField
        label="Cardholder name"
        error={errors.cardholderName?.message}
        disabled={paymentSuccessful}
        autoComplete="cc-name"
        {...cardholderName}
        onChange={(event) =>
          setMaskedField(
            event,
            cardholderName,
            event.target.value,
            formatCardholderName,
          )
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
            event,
            expirationDate,
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
          setMaskedField(event, cvc, event.target.value, formatCvc)
        }
      />
      <TextField
        label="Billing postal code"
        error={errors.billingPostalCode?.message}
        disabled={paymentSuccessful}
        autoComplete="postal-code"
        {...register("billingPostalCode", { onChange: onFieldChange })}
      />
      <div className="flex min-h-[56px] items-center justify-end sm:col-start-2">
        <CardBrandMark brand={feedback.brand} className="justify-end px-0" />
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Notice } from "@/components/atoms/Notice";
import { ToggleButtonGroup } from "@/components/atoms/ToggleButtonGroup";
import { CardPaymentForm } from "@/components/organisms/payment/CardPaymentForm";
import { PixPaymentPanel } from "@/components/organisms/payment/PixPaymentPanel";
import { usePixPayment } from "@/components/organisms/payment/usePixPayment";
import { processCardPayment } from "@/lib/api/payments";
import {
  PIX_PAYMENT_EXPIRATION_SECONDS,
  PIX_STATUS_POLLING_MS,
} from "@/lib/constants/payment";
import {
  cardPaymentSchema,
  getCardFeedback,
  onlyDigits,
  paymentMethodOptions,
  type CardPaymentInput,
  type PaymentMethod,
} from "@/lib/payment";
import type { PaymentSummary } from "@/lib/stores/checkout-store";
import { useCheckoutStore } from "@/lib/stores/checkout-store";

type CardFields = Omit<CardPaymentInput, "method">;

const emptyCardFields: CardFields = {
  cardholderName: "",
  cardNumber: "",
  expirationDate: "",
  cvc: "",
  billingPostalCode: "",
};

export function PaymentStep({
  pixCountdownTickMs = 1000,
  pixExpirationSeconds = PIX_PAYMENT_EXPIRATION_SECONDS,
  paymentStatusPollingMs = PIX_STATUS_POLLING_MS,
}: {
  pixCountdownTickMs?: number;
  pixExpirationSeconds?: number;
  paymentStatusPollingMs?: number;
}) {
  const method = useCheckoutStore((state) => state.paymentMethod);
  const paymentSuccessful = useCheckoutStore(
    (state) => state.paymentSuccessful,
  );
  const changePaymentMethod = useCheckoutStore(
    (state) => state.changePaymentMethod,
  );
  const confirmPayment = useCheckoutStore((state) => state.confirmPayment);
  const [message, setMessage] = useState("");
  const cardForm = useForm<CardPaymentInput>({
    resolver: zodResolver(cardPaymentSchema),
    defaultValues: {
      method: "card",
      ...emptyCardFields,
    },
  });
  const cardNumber = useWatch({
    control: cardForm.control,
    name: "cardNumber",
    defaultValue: "",
  });
  const feedback = useMemo(() => getCardFeedback(cardNumber), [cardNumber]);
  const pixPaymentState = usePixPayment({
    method,
    paymentSuccessful,
    onPaymentSuccess: confirmPayment,
    pixCountdownTickMs,
    pixExpirationSeconds,
    paymentStatusPollingMs,
  });

  function selectPaymentMethod(nextMethod: PaymentMethod) {
    changePaymentMethod(nextMethod);
    setMessage("");
  }

  function clearPaymentMessage() {
    setMessage("");
  }

  async function submitCardPayment(cardPayment: CardPaymentInput) {
    setMessage("");

    const response = await processCardPayment(cardPayment);
    setMessage(response.message);

    if (response.success) confirmPayment(createCardPaymentSummary(cardPayment));
  }

  return (
    <div className="space-y-6">
      <Notice tone={paymentSuccessful ? "success" : "info"}>
        {paymentSuccessful
          ? "Payment confirmed in the simulated checkout."
          : "This is a simulated payment step. No real payment service is used."}
      </Notice>

      <ToggleButtonGroup
        value={method}
        ariaLabel="Payment method"
        onChange={selectPaymentMethod}
        options={paymentMethodOptions}
        className="max-w-md"
      />

      {method === "card" && (
        <CardPaymentForm
          cardForm={cardForm}
          feedback={feedback}
          message={message}
          paymentSuccessful={paymentSuccessful}
          onFieldChange={clearPaymentMessage}
          onSubmit={submitCardPayment}
        />
      )}

      {method === "pix" && (
        <PixPaymentPanel
          {...pixPaymentState}
          paymentSuccessful={paymentSuccessful}
          onRefresh={pixPaymentState.createPix}
        />
      )}
    </div>
  );
}

function createCardPaymentSummary(
  cardPayment: CardPaymentInput,
): PaymentSummary {
  const feedback = getCardFeedback(cardPayment.cardNumber);
  const lastFourDigits = onlyDigits(cardPayment.cardNumber).slice(-4);

  return {
    method: "card",
    brand: feedback.brand,
    bank: feedback.bank,
    maskedNumber: "**** " + lastFourDigits,
  };
}

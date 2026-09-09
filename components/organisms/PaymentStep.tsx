"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { Chip } from "@/components/atoms/Chip";
import { Notice } from "@/components/atoms/Notice";
import { RefreshActionButton } from "@/components/atoms/RefreshActionButton";
import { TextField } from "@/components/atoms/TextField";
import { ToggleButtonGroup } from "@/components/atoms/ToggleButtonGroup";
import {
  createPixPaymentRequest,
  getPixPaymentStatus,
  processCardPayment,
  type PixStatusResponse,
} from "@/lib/api/payments";
import {
  PIX_PAYMENT_EXPIRATION_SECONDS,
  PIX_STATUS_POLLING_MS,
} from "@/lib/constants/payment";
import {
  cardPaymentSchema,
  getCardFeedback,
  paymentMethodOptions,
  type CardPaymentInput,
  type PaymentMethod,
} from "@/lib/payment";
import type { PixPayment } from "@/lib/payment-store";
import { createQrCodeDataUrl } from "@/lib/qr-code";

type CardFields = Omit<CardPaymentInput, "method">;

const emptyCardFields: CardFields = {
  cardholderName: "",
  cardNumber: "",
  expirationDate: "",
  cvc: "",
  billingPostalCode: "",
};

function formatTimeLeft(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return minutes + ":" + String(seconds).padStart(2, "0");
}

export function PaymentStep({
  method,
  paymentSuccessful,
  onMethodChange,
  onPaymentSuccess,
  pixCountdownTickMs = 1000,
  pixExpirationSeconds = PIX_PAYMENT_EXPIRATION_SECONDS,
  paymentStatusPollingMs = PIX_STATUS_POLLING_MS,
}: {
  method: PaymentMethod;
  paymentSuccessful: boolean;
  onMethodChange: (method: PaymentMethod) => void;
  onPaymentSuccess: () => void;
  pixCountdownTickMs?: number;
  pixExpirationSeconds?: number;
  paymentStatusPollingMs?: number;
}) {
  const [message, setMessage] = useState("");
  const [pixPayment, setPixPayment] = useState<PixStatusResponse | null>(null);
  const [pixQrCodeUrl, setPixQrCodeUrl] = useState("");
  const [pixLoading, setPixLoading] = useState(false);
  const [pixLoadFailed, setPixLoadFailed] = useState(false);
  const [pixTimeLeft, setPixTimeLeft] = useState(pixExpirationSeconds);
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
  const pixReady = pixPayment && "paymentId" in pixPayment;
  const pixPaymentId = pixReady ? pixPayment.paymentId : "";
  const pixPaymentExpired =
    (pixReady && pixPayment.status === "expired") ||
    (!paymentSuccessful && pixReady && pixTimeLeft === 0);
  const canDisplayPixPayment = pixReady && !pixPaymentExpired;
  const canDisplayPixQrCode = canDisplayPixPayment && Boolean(pixQrCodeUrl);
  const shouldDisplayPixLoadFailed = !pixLoading && pixLoadFailed;
  const shouldMonitorPixPayment =
    method === "pix" &&
    !paymentSuccessful &&
    pixReady &&
    pixPayment.status === "pending";

  const expirePixPayment = useCallback((payment: PixPayment) => {
    setMessage("");
    setPixQrCodeUrl("");
    setPixPayment({ ...payment, status: "expired" });
  }, []);

  const createPix = useCallback(async () => {
    setPixLoading(true);
    setPixLoadFailed(false);
    setMessage("");
    setPixQrCodeUrl("");

    try {
      const payment = await createPixPaymentRequest();
      setPixPayment(payment);
      setPixTimeLeft(pixExpirationSeconds);
      setPixQrCodeUrl(await createQrCodeDataUrl(payment.paymentUrl));
    } catch {
      setPixLoadFailed(true);
      setPixPayment(null);
      setPixQrCodeUrl("");
    } finally {
      setPixLoading(false);
    }
  }, [pixExpirationSeconds]);

  const clearPixPaymentView = useCallback(() => {
    setMessage("");
    setPixPayment(null);
    setPixQrCodeUrl("");
    setPixLoadFailed(false);
    setPixTimeLeft(pixExpirationSeconds);
  }, [pixExpirationSeconds]);

  const startPixPaymentView = useCallback(() => {
    if (method !== "pix" || paymentSuccessful) return;

    const timeoutId = window.setTimeout(() => {
      void createPix();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [createPix, method, paymentSuccessful]);

  useEffect(() => {
    return startPixPaymentView();
  }, [startPixPaymentView]);

  useEffect(() => {
    if (method !== "pix") return;

    return clearPixPaymentView;
  }, [clearPixPaymentView, method]);

  function changePaymentMethod(nextMethod: PaymentMethod) {
    onMethodChange(nextMethod);
    setMessage("");
  }

  function clearPaymentMessage() {
    setMessage("");
  }

  const checkPixStatus = useCallback(
    async (paymentId: string) => {
      const nextPixPayment = await getPixPaymentStatus(paymentId);
      setPixPayment(nextPixPayment);

      if ("paymentId" in nextPixPayment && nextPixPayment.status === "paid") {
        setMessage("Pix payment confirmed in the simulated flow.");
        onPaymentSuccess();
        return;
      }

      if (
        "paymentId" in nextPixPayment &&
        nextPixPayment.status === "expired"
      ) {
        expirePixPayment(nextPixPayment);
      }
    },
    [expirePixPayment, onPaymentSuccess],
  );

  const startPixStatusPolling = useCallback(() => {
    if (!shouldMonitorPixPayment) return;

    const intervalId = window.setInterval(() => {
      void checkPixStatus(pixPaymentId);
    }, paymentStatusPollingMs);

    return () => window.clearInterval(intervalId);
  }, [
    checkPixStatus,
    paymentStatusPollingMs,
    pixPaymentId,
    shouldMonitorPixPayment,
  ]);

  useEffect(() => {
    return startPixStatusPolling();
  }, [startPixStatusPolling]);

  const startPixExpirationCountdown = useCallback(() => {
    if (!shouldMonitorPixPayment) return;

    const currentPixPayment = pixPayment as PixPayment;
    const intervalId = window.setInterval(() => {
      setPixTimeLeft((current) => {
        const nextTimeLeft = Math.max(current - 1, 0);

        if (nextTimeLeft === 0) {
          expirePixPayment(currentPixPayment);
        }

        return nextTimeLeft;
      });
    }, pixCountdownTickMs);

    return () => window.clearInterval(intervalId);
  }, [
    expirePixPayment,
    pixCountdownTickMs,
    pixPayment,
    shouldMonitorPixPayment,
  ]);

  useEffect(() => {
    return startPixExpirationCountdown();
  }, [startPixExpirationCountdown]);

  async function submitCardPayment(cardPayment: CardPaymentInput) {
    setMessage("");

    const response = await processCardPayment(cardPayment);
    setMessage(response.message);

    if (response.success) onPaymentSuccess();
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
        onChange={changePaymentMethod}
        options={paymentMethodOptions}
        className="max-w-md"
      />

      {method === "card" && (
        <form
          className="space-y-5"
          noValidate
          onSubmit={cardForm.handleSubmit(submitCardPayment)}
        >
          <Card className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Chip label={"Brand: " + feedback.brand} tone="brand" />
              <Chip label={"Bank: " + feedback.bank} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Cardholder name"
                error={cardForm.formState.errors.cardholderName?.message}
                disabled={paymentSuccessful}
                {...cardForm.register("cardholderName", {
                  onChange: clearPaymentMessage,
                })}
              />
              <TextField
                label="Card number"
                error={cardForm.formState.errors.cardNumber?.message}
                disabled={paymentSuccessful}
                inputMode="numeric"
                autoComplete="cc-number"
                {...cardForm.register("cardNumber", {
                  onChange: clearPaymentMessage,
                })}
              />
              <TextField
                label="Expiration date"
                placeholder="MM/YY"
                error={cardForm.formState.errors.expirationDate?.message}
                disabled={paymentSuccessful}
                autoComplete="cc-exp"
                {...cardForm.register("expirationDate", {
                  onChange: clearPaymentMessage,
                })}
              />
              <TextField
                label="CVC"
                error={cardForm.formState.errors.cvc?.message}
                disabled={paymentSuccessful}
                inputMode="numeric"
                autoComplete="cc-csc"
                type="password"
                {...cardForm.register("cvc", {
                  onChange: clearPaymentMessage,
                })}
              />
              <TextField
                label="Billing postal code"
                error={cardForm.formState.errors.billingPostalCode?.message}
                disabled={paymentSuccessful}
                autoComplete="postal-code"
                {...cardForm.register("billingPostalCode", {
                  onChange: clearPaymentMessage,
                })}
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
      )}

      {method === "pix" && (
        <Card className="space-y-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="grid size-44 place-items-center rounded-lg border border-neutral-300 bg-white p-3">
              {canDisplayPixQrCode ? (
                <Image
                  src={pixQrCodeUrl}
                  alt="QR Code for fake Pix payment"
                  width={152}
                  height={152}
                  unoptimized
                />
              ) : pixPaymentExpired ? (
                <RefreshActionButton type="button" onClick={createPix} />
              ) : shouldDisplayPixLoadFailed ? (
                <RefreshActionButton type="button" onClick={createPix} />
              ) : (
                pixLoading && (
                  <p className="px-3 text-center text-sm text-neutral-600">
                    Generating QR Code...
                  </p>
                )
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <p className="text-sm font-semibold text-neutral-900">
                Fake Pix QR Code
              </p>
              {pixPaymentExpired ? (
                <>
                  <p className="text-sm text-neutral-600">
                    Generate a new Pix to continue with the simulated checkout.
                  </p>
                  <Notice tone="warning">
                    This simulated Pix payment was expired.
                  </Notice>
                </>
              ) : shouldDisplayPixLoadFailed ? (
                <>
                  <p className="text-sm text-neutral-600">
                    We could not load the Pix payment.
                  </p>
                  <Notice tone="warning">
                    Refresh the Pix payment and try again.
                  </Notice>
                </>
              ) : canDisplayPixPayment ? (
                <>
                  <p className="text-sm text-neutral-600">
                    Scan this QR Code with another device to open the simulated
                    Pix payment screen.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 rounded-lg border border-brand-100 bg-brand-50 px-3 py-2">
                    <span className="size-2 animate-pulse rounded-full bg-brand-600" />
                    <p className="text-sm font-medium text-brand-900">
                      Waiting for Pix confirmation
                    </p>
                    <p className="text-sm text-brand-700" role="timer">
                      Valid for {formatTimeLeft(pixTimeLeft)}
                    </p>
                  </div>
                  <p className="rounded-lg bg-neutral-100 px-3 py-2 text-sm break-all text-neutral-700">
                    {pixPayment.copyCode}
                  </p>
                </>
              ) : (
                pixLoading && (
                  <p className="text-sm text-neutral-600">
                    Creating fake Pix data...
                  </p>
                )
              )}
            </div>
          </div>

          {message && <Notice tone="success">{message}</Notice>}

          {pixReady && !paymentSuccessful && (
            <p className="text-sm text-neutral-600">
              {pixPaymentExpired
                ? "Pix expired. Refresh the Pix payment and try again."
                : "Keep this page open after paying. Confirmation updates automatically."}
            </p>
          )}
        </Card>
      )}
    </div>
  );
}

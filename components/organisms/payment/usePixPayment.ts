"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createPixPaymentRequest,
  getPixPaymentStatus,
} from "@/lib/api/payments";
import {
  PIX_PAYMENT_EXPIRATION_SECONDS,
  PIX_STATUS_POLLING_MS,
} from "@/lib/constants/payment";
import type { PaymentMethod } from "@/lib/payment";
import type { PixPayment } from "@/lib/payment-store";
import { createQrCodeDataUrl } from "@/lib/qr-code";
import type { PaymentSummary } from "@/lib/stores/checkout-store";

type UsePixPaymentOptions = {
  method: PaymentMethod;
  paymentSuccessful: boolean;
  onPaymentSuccess: (paymentSummary: PaymentSummary) => void;
  pixCountdownTickMs?: number;
  pixExpirationSeconds?: number;
  paymentStatusPollingMs?: number;
};

export function usePixPayment({
  method,
  paymentSuccessful,
  onPaymentSuccess,
  pixCountdownTickMs = 1000,
  pixExpirationSeconds = PIX_PAYMENT_EXPIRATION_SECONDS,
  paymentStatusPollingMs = PIX_STATUS_POLLING_MS,
}: UsePixPaymentOptions) {
  const [message, setMessage] = useState("");
  const [pixPayment, setPixPayment] = useState<PixPayment | null>(null);
  const [pixQrCodeUrl, setPixQrCodeUrl] = useState("");
  const [pixLoading, setPixLoading] = useState(false);
  const [pixLoadFailed, setPixLoadFailed] = useState(false);
  const [pixTimeLeft, setPixTimeLeft] = useState(pixExpirationSeconds);

  const pixPaymentExpired =
    pixPayment?.status === "expired" ||
    (!paymentSuccessful && Boolean(pixPayment) && pixTimeLeft === 0);
  const canDisplayPixPayment = Boolean(pixPayment) && !pixPaymentExpired;
  const canDisplayPixQrCode = canDisplayPixPayment && Boolean(pixQrCodeUrl);
  const shouldDisplayPixLoadFailed = !pixLoading && pixLoadFailed;
  const shouldMonitorPixPayment =
    method === "pix" && !paymentSuccessful && pixPayment?.status === "pending";

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

  const checkPixStatus = useCallback(
    async (payment: PixPayment) => {
      const nextPixPayment = await getPixPaymentStatus(payment.paymentId);

      if (!("paymentId" in nextPixPayment)) {
        setPixLoadFailed(true);
        setPixPayment(null);
        return;
      }

      setPixPayment(nextPixPayment);

      if (nextPixPayment.status === "paid") {
        setMessage("Pix payment confirmed in the simulated flow.");
        onPaymentSuccess({ method: "pix" });
        return;
      }

      if (nextPixPayment.status === "expired") {
        expirePixPayment(nextPixPayment);
      }
    },
    [expirePixPayment, onPaymentSuccess],
  );

  const startPixStatusPolling = useCallback(() => {
    if (!shouldMonitorPixPayment || !pixPayment) return;

    const intervalId = window.setInterval(() => {
      void checkPixStatus(pixPayment);
    }, paymentStatusPollingMs);

    return () => window.clearInterval(intervalId);
  }, [
    checkPixStatus,
    paymentStatusPollingMs,
    pixPayment,
    shouldMonitorPixPayment,
  ]);

  useEffect(() => {
    return startPixStatusPolling();
  }, [startPixStatusPolling]);

  const startPixExpirationCountdown = useCallback(() => {
    if (!shouldMonitorPixPayment || !pixPayment) return;

    const intervalId = window.setInterval(() => {
      setPixTimeLeft((current) => {
        const nextTimeLeft = Math.max(current - 1, 0);

        if (nextTimeLeft === 0) {
          expirePixPayment(pixPayment);
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

  return {
    canDisplayPixPayment,
    canDisplayPixQrCode,
    createPix,
    message,
    pixLoadFailed,
    pixLoading,
    pixPayment,
    pixPaymentExpired,
    pixQrCodeUrl,
    pixTimeLeft,
    shouldDisplayPixLoadFailed,
  };
}

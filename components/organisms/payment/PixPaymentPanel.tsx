"use client";

import Image from "next/image";
import { Card } from "@/components/atoms/Card";
import { Notice } from "@/components/atoms/Notice";
import { RefreshActionButton } from "@/components/atoms/RefreshActionButton";
import type { PixPayment } from "@/lib/payment-store";

function formatTimeLeft(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return minutes + ":" + String(seconds).padStart(2, "0");
}

function PixQrCodeFrame({
  canDisplayPixQrCode,
  isActionable,
  pixLoading,
  pixQrCodeUrl,
  onRefresh,
}: {
  canDisplayPixQrCode: boolean;
  isActionable: boolean;
  pixLoading: boolean;
  pixQrCodeUrl: string;
  onRefresh: () => void;
}) {
  if (canDisplayPixQrCode) {
    return (
      <Image
        src={pixQrCodeUrl}
        alt="QR Code for fake Pix payment"
        width={152}
        height={152}
        unoptimized
      />
    );
  }

  if (isActionable) {
    return <RefreshActionButton type="button" onClick={onRefresh} />;
  }

  if (pixLoading) {
    return (
      <p className="px-3 text-center text-sm text-neutral-600">
        Generating QR Code...
      </p>
    );
  }
}

function PixDetails({
  canDisplayPixPayment,
  pixLoadFailed,
  pixLoading,
  pixPayment,
  pixPaymentExpired,
  pixTimeLeft,
}: {
  canDisplayPixPayment: boolean;
  pixLoadFailed: boolean;
  pixLoading: boolean;
  pixPayment: PixPayment | null;
  pixPaymentExpired: boolean;
  pixTimeLeft: number;
}) {
  if (pixPaymentExpired) {
    return (
      <>
        <p className="text-sm text-neutral-600">
          Generate a new Pix to continue with the simulated checkout.
        </p>
        <Notice tone="warning">This simulated Pix payment was expired.</Notice>
      </>
    );
  }

  if (pixLoadFailed) {
    return (
      <>
        <p className="text-sm text-neutral-600">
          We could not load the Pix payment.
        </p>
        <Notice tone="warning">Refresh the Pix payment and try again.</Notice>
      </>
    );
  }

  if (canDisplayPixPayment && pixPayment) {
    return (
      <>
        <p className="text-sm text-neutral-600">
          Scan this QR Code with another device to open the simulated Pix
          payment screen.
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
    );
  }

  if (pixLoading) {
    return (
      <p className="text-sm text-neutral-600">Creating fake Pix data...</p>
    );
  }
}

function PixFooter({
  paymentSuccessful,
  pixPayment,
  pixPaymentExpired,
}: {
  paymentSuccessful: boolean;
  pixPayment: PixPayment | null;
  pixPaymentExpired: boolean;
}) {
  if (!pixPayment || paymentSuccessful) return null;

  return (
    <p className="text-sm text-neutral-600">
      {pixPaymentExpired
        ? "Pix expired. Refresh the Pix payment and try again."
        : "Keep this page open after paying. Confirmation updates automatically."}
    </p>
  );
}

export function PixPaymentPanel({
  canDisplayPixPayment,
  canDisplayPixQrCode,
  message,
  paymentSuccessful,
  pixLoadFailed,
  pixLoading,
  pixPayment,
  pixPaymentExpired,
  pixQrCodeUrl,
  pixTimeLeft,
  shouldDisplayPixLoadFailed,
  onRefresh,
}: {
  canDisplayPixPayment: boolean;
  canDisplayPixQrCode: boolean;
  message: string;
  paymentSuccessful: boolean;
  pixLoadFailed: boolean;
  pixLoading: boolean;
  pixPayment: PixPayment | null;
  pixPaymentExpired: boolean;
  pixQrCodeUrl: string;
  pixTimeLeft: number;
  shouldDisplayPixLoadFailed: boolean;
  onRefresh: () => void;
}) {
  return (
    <Card className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="grid size-44 place-items-center rounded-lg border border-neutral-300 bg-white p-3">
          <PixQrCodeFrame
            canDisplayPixQrCode={canDisplayPixQrCode}
            isActionable={pixPaymentExpired || shouldDisplayPixLoadFailed}
            pixLoading={pixLoading}
            pixQrCodeUrl={pixQrCodeUrl}
            onRefresh={onRefresh}
          />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <p className="text-sm font-semibold text-neutral-900">
            Fake Pix QR Code
          </p>
          <PixDetails
            canDisplayPixPayment={canDisplayPixPayment}
            pixLoadFailed={pixLoadFailed}
            pixLoading={pixLoading}
            pixPayment={pixPayment}
            pixPaymentExpired={pixPaymentExpired}
            pixTimeLeft={pixTimeLeft}
          />
        </div>
      </div>

      {message && <Notice tone="success">{message}</Notice>}

      <PixFooter
        paymentSuccessful={paymentSuccessful}
        pixPayment={pixPayment}
        pixPaymentExpired={pixPaymentExpired}
      />
    </Card>
  );
}

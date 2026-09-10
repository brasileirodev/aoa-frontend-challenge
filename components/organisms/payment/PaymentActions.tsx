"use client";

import { Button } from "@/components/atoms/Button";

export function PaymentActions({
  paymentSuccessful,
  submitLabel,
  onBack,
}: {
  paymentSuccessful: boolean;
  submitLabel?: string;
  onBack?: () => void;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      {onBack ? (
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onBack}
          disabled={paymentSuccessful}
        >
          Back to company details
        </Button>
      ) : (
        <span aria-hidden="true" />
      )}
      {submitLabel && (
        <Button type="submit" size="lg" disabled={paymentSuccessful}>
          {submitLabel}
        </Button>
      )}
    </div>
  );
}

"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { Notice } from "@/components/atoms/Notice";
import {
  confirmPixPayment,
  getPixPaymentStatus,
  type PixStatusResponse,
} from "@/lib/api/payments";

export function FakePixPaymentScreen({
  paymentId,
  initialPayment,
}: {
  paymentId: string;
  initialPayment: PixStatusResponse;
}) {
  const [payment, setPayment] = useState<PixStatusResponse>(initialPayment);
  const [loading, setLoading] = useState(false);

  const refreshPayment = useCallback(async () => {
    setLoading(true);

    try {
      setPayment(await getPixPaymentStatus(paymentId));
    } finally {
      setLoading(false);
    }
  }, [paymentId]);

  async function payPix() {
    setLoading(true);

    try {
      setPayment(await confirmPixPayment(paymentId));
    } finally {
      setLoading(false);
    }
  }

  const status = payment.status;
  const canPay =
    payment && "paymentId" in payment && payment.status === "pending";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center px-6 py-12">
      <Card className="w-full space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold tracking-wide text-brand-700 uppercase">
            Meridian fake Pix
          </p>
          <h1 className="text-3xl font-bold text-neutral-950">
            Simulated Pix payment
          </h1>
          <p className="text-sm text-neutral-600">
            This screen only confirms a demo payment inside this application.
          </p>
        </div>

        <Notice
          tone={
            status === "paid"
              ? "success"
              : status === "pending"
                ? "info"
                : "warning"
          }
        >
          {loading
            ? "Loading fake Pix payment..."
            : "Fake Pix status: " + status + "."}
        </Notice>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            size="lg"
            disabled={!canPay || loading}
            onClick={payPix}
          >
            Pay Pix
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={refreshPayment}
          >
            Refresh status
          </Button>
        </div>
      </Card>
    </main>
  );
}

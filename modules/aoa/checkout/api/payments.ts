import type {
  CardPaymentInput,
  PaymentStatus,
} from "@aoa/checkout/models/payment";
import type { PixPayment } from "@aoa/checkout/models/pix-payment";

export type CardPaymentResponse = {
  method: "card";
  success: boolean;
  message: string;
};

export type PixStatusResponse =
  | PixPayment
  | {
      status: Extract<PaymentStatus, "missing">;
    };

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export async function processCardPayment(input: CardPaymentInput) {
  const response = await fetch("/api/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return readJson<CardPaymentResponse>(response);
}

export async function createPixPaymentRequest() {
  const response = await fetch("/api/payments/pix", { method: "POST" });

  return readJson<PixPayment>(response);
}

export async function getPixPaymentStatus(paymentId: string) {
  const response = await fetch("/api/payments/pix/" + paymentId);

  return readJson<PixStatusResponse>(response);
}

export async function confirmPixPayment(paymentId: string) {
  const response = await fetch("/api/payments/pix/" + paymentId + "/pay", {
    method: "POST",
  });

  return readJson<PixStatusResponse>(response);
}

import type { PaymentStatus } from "@/lib/payment";
import { PIX_PAYMENT_EXPIRATION_MS } from "@/lib/constants/payment";

export type PixPayment = {
  paymentId: string;
  method: "pix";
  status: Exclude<PaymentStatus, "missing">;
  createdAt: number;
  expiresAt: number;
  copyCode: string;
  paymentUrl: string;
};

type PixStoreState = {
  counter: number;
  attempts: Map<string, PixPayment>;
};

declare global {
  var __meridianPixStore: PixStoreState | undefined;
}

function getStore() {
  globalThis.__meridianPixStore ??= { counter: 0, attempts: new Map() };

  return globalThis.__meridianPixStore;
}

function createPaymentId() {
  const store = getStore();
  store.counter += 1;

  return "pix-" + String(store.counter).padStart(4, "0");
}

export function createPixPayment(origin = "", now = Date.now()) {
  const store = getStore();
  const paymentId = createPaymentId();
  const payment: PixPayment = {
    paymentId,
    method: "pix",
    status: "pending",
    createdAt: now,
    expiresAt: now + PIX_PAYMENT_EXPIRATION_MS,
    copyCode: "MERIDIAN-PIX-" + paymentId.toUpperCase(),
    paymentUrl: origin + "/pix-payment/" + paymentId,
  };

  store.attempts.set(paymentId, payment);

  return payment;
}

export function getPixPayment(paymentId: string, now = Date.now()) {
  const payment = getStore().attempts.get(paymentId);
  if (!payment) return { status: "missing" as const };

  if (payment.status !== "paid" && payment.expiresAt < now) {
    payment.status = "expired";
  }

  return payment;
}

export function markPixPaymentPaid(paymentId: string, now = Date.now()) {
  const payment = getPixPayment(paymentId, now);

  if ("paymentId" in payment && payment.status === "pending") {
    payment.status = "paid";
  }

  return payment;
}

export function resetPixPaymentStore() {
  globalThis.__meridianPixStore = { counter: 0, attempts: new Map() };
}

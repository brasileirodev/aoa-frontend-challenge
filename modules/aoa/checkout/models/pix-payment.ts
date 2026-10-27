import type { PaymentStatus } from "@aoa/checkout/models/payment";

export type PixPayment = {
  paymentId: string;
  method: "pix";
  status: Exclude<PaymentStatus, "missing">;
  createdAt: number;
  expiresAt: number;
  copyCode: string;
  paymentUrl: string;
};

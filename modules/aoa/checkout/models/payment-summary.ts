import type { CardBrand } from "@aoa/checkout/models/payment";

export type PaymentSummary =
  | {
      method: "card";
      brand: CardBrand | "Unknown brand";
      bank: string;
      maskedNumber: string;
    }
  | {
      method: "pix";
    };

import { onlyDigits } from "@aoa/checkout/models/payment";

export function getCardBrandLookupKey(cardNumber: string) {
  return onlyDigits(cardNumber).slice(0, 8);
}

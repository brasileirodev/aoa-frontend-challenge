import { onlyDigits } from "@/lib/payment";

export function getCardBrandLookupKey(cardNumber: string) {
  return onlyDigits(cardNumber).slice(0, 8);
}

import creditCardType from "credit-card-type";
import { getCardBrandLookupKey } from "@/lib/card-brand-lookup";
import type { CardFeedback } from "@/lib/payment";

const supportedBrands = {
  visa: "Visa",
  mastercard: "Mastercard",
  "american-express": "American Express",
  elo: "Elo",
} satisfies Record<string, CardFeedback["brand"]>;

export function detectCardBrandFromLibrary(
  cardNumber: string,
): CardFeedback["brand"] {
  const digits = getCardBrandLookupKey(cardNumber);
  if (!digits) return "Unknown brand";

  const detectedCards = creditCardType(digits);
  for (const card of detectedCards) {
    const supportedBrand = getSupportedBrand(card.type);
    if (supportedBrand) return supportedBrand;
  }

  return "Unknown brand";
}

function getSupportedBrand(type: string) {
  if (type in supportedBrands) {
    return supportedBrands[type as keyof typeof supportedBrands];
  }

  return null;
}

import { z } from "zod";

export type PaymentMethod = "card" | "pix";
export type PaymentStatus = "pending" | "paid" | "expired" | "missing";

export type CardBrand = "Visa" | "Mastercard" | "American Express" | "Elo";

export type CardFeedback = {
  brand: CardBrand | "Unknown brand";
  bank: string;
};

export const paymentMethodOptions: { value: PaymentMethod; label: string }[] = [
  { value: "card", label: "Credit card" },
  { value: "pix", label: "Pix" },
];

const CARD_NUMBER_MAX_DIGITS = 16;
const CVC_MAX_DIGITS = 3;
const EXPIRATION_DATE_MAX_DIGITS = 4;

export const cardPaymentSchema = z.object({
  method: z.literal("card"),
  cardholderName: z
    .string()
    .trim()
    .min(2, "Enter the cardholder name.")
    .max(100, "Use no more than 100 characters.")
    .regex(/^[A-Za-z\s]+$/, "Use letters and spaces only."),
  cardNumber: z
    .string()
    .trim()
    .refine(
      (value) => onlyDigits(value).length === CARD_NUMBER_MAX_DIGITS,
      "Enter a 16-digit card number.",
    )
    .refine((value) => isValidCardNumber(value), "Enter a valid card number."),
  expirationDate: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format.")
    .refine((value) => isFutureExpiration(value), "Use a future date."),
  cvc: z
    .string()
    .trim()
    .regex(/^\d{3}$/, "Enter a valid CVC."),
  billingPostalCode: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9 -]{5,12}$/, "Enter a valid postal code."),
});

export type CardPaymentInput = z.infer<typeof cardPaymentSchema>;

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function formatCardholderName(value: string) {
  return value.replace(/[^A-Za-z\s]/g, "");
}

export function formatCardNumber(value: string) {
  return limitDigits(value, CARD_NUMBER_MAX_DIGITS)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

export function formatExpirationDate(value: string) {
  const digits = limitDigits(value, EXPIRATION_DATE_MAX_DIGITS);

  if (digits.length <= 2) return digits;

  return digits.slice(0, 2) + "/" + digits.slice(2);
}

export function formatCvc(value: string) {
  return limitDigits(value, CVC_MAX_DIGITS);
}

export function detectCardBrand(cardNumber: string): CardFeedback["brand"] {
  const digits = onlyDigits(cardNumber);

  if (/^(401178|431274|438935|451416|457393|504175|636297|636368)/.test(digits))
    return "Elo";
  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "American Express";

  return "Unknown brand";
}

export function detectIssuingBank(cardNumber: string) {
  const digits = onlyDigits(cardNumber);

  if (digits.startsWith("411111")) return "Meridian Demo Bank";
  if (digits.startsWith("555555")) return "Northwind Credit";
  if (digits.startsWith("378282")) return "Contoso Premium";
  if (digits.startsWith("401178")) return "Fabrikam Digital";

  return "Unknown bank";
}

export function getCardFeedback(cardNumber: string): CardFeedback {
  return {
    brand: detectCardBrand(cardNumber),
    bank: detectIssuingBank(cardNumber),
  };
}

export function isFutureExpiration(value: string, now = new Date()) {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
  if (!match) return false;

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const expiration = new Date(year, month, 0, 23, 59, 59, 999);

  return expiration >= now;
}

export function isValidCardNumber(value: string) {
  const digits = onlyDigits(value);
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

function limitDigits(value: string, maxLength: number) {
  return onlyDigits(value).slice(0, maxLength);
}

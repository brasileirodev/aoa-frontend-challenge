import type { CardFeedback } from "@/lib/payment";

export async function getCardBrand(
  lookupKey: string,
  signal?: AbortSignal,
): Promise<CardFeedback["brand"]> {
  if (!lookupKey) return "Unknown brand";

  const response = await fetch(
    "/api/payments/card-brand?number=" + encodeURIComponent(lookupKey),
    { signal },
  );

  if (!response.ok) return "Unknown brand";

  const result = (await response.json()) as { brand?: CardFeedback["brand"] };
  return result.brand ?? "Unknown brand";
}

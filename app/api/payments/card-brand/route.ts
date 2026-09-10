import { detectCardBrandFromLibrary } from "@/lib/card-brand-detector";
import { CARD_BRAND_CACHE_TTL_MS } from "@/lib/constants/payment";
import type { CardFeedback } from "@/lib/payment";

type CachedCardBrand = {
  brand: CardFeedback["brand"];
  expiresAt: number;
};

const cardBrandCache = new Map<string, CachedCardBrand>();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lookupKey = url.searchParams.get("number") ?? "";
  const cachedBrand = getCachedCardBrand(lookupKey);

  if (cachedBrand) {
    return Response.json(
      { brand: cachedBrand },
      { headers: getCardBrandCacheHeaders() },
    );
  }

  const brand = detectCardBrandFromLibrary(lookupKey);
  cardBrandCache.set(lookupKey, {
    brand,
    expiresAt: Date.now() + CARD_BRAND_CACHE_TTL_MS,
  });

  return Response.json({ brand }, { headers: getCardBrandCacheHeaders() });
}

function getCachedCardBrand(lookupKey: string) {
  const cached = cardBrandCache.get(lookupKey);

  if (!cached) return null;

  if (cached.expiresAt <= Date.now()) {
    cardBrandCache.delete(lookupKey);
    return null;
  }

  return cached.brand;
}

function getCardBrandCacheHeaders() {
  return {
    "Cache-Control": "private, max-age=86400",
  };
}

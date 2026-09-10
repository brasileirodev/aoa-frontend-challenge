"use client";

import { useEffect, useMemo, useState } from "react";
import { getCardBrand } from "@/lib/api/card-brand";
import { getCardBrandLookupKey } from "@/lib/card-brand-lookup";
import { detectIssuingBank, type CardFeedback } from "@/lib/payment";

export function useCardBrandFeedback(cardNumber: string): CardFeedback {
  const lookupKey = useMemo(
    () => getCardBrandLookupKey(cardNumber),
    [cardNumber],
  );
  const [brand, setBrand] = useState<CardFeedback["brand"]>("Unknown brand");

  useEffect(() => {
    const controller = new AbortController();

    void getCardBrand(lookupKey, controller.signal).then((detectedBrand) => {
      setBrand(detectedBrand);
    });

    return () => {
      controller.abort();
    };
  }, [lookupKey]);

  return {
    brand,
    bank: detectIssuingBank(cardNumber),
  };
}

"use client";

import type { CardFeedback } from "@/lib/payment";

export function CardBrandMark({
  brand,
  className = "",
}: {
  brand: CardFeedback["brand"];
  className?: string;
}) {
  return (
    <div className={"flex min-h-[56px] items-center px-1 " + className}>
      <CardBrandSvg brand={brand} />
    </div>
  );
}

function CardBrandSvg({ brand }: { brand: CardFeedback["brand"] }) {
  if (brand === "Visa") return <VisaLogo />;
  if (brand === "Mastercard") return <MastercardLogo />;
  if (brand === "American Express") return <AmexLogo />;
  if (brand === "Elo") return <EloLogo />;

  return null;
}

function VisaLogo() {
  return (
    <svg
      aria-label="Visa card brand"
      role="img"
      viewBox="0 0 120 38"
      className="h-9 w-28"
    >
      <text
        x="16"
        y="27"
        fill="#1434CB"
        fontFamily="Arial, sans-serif"
        fontSize="26"
        fontWeight="800"
        letterSpacing="1"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg
      aria-label="Mastercard card brand"
      role="img"
      viewBox="0 0 120 38"
      className="h-9 w-28"
    >
      <circle cx="49" cy="19" r="14" fill="#EB001B" />
      <circle cx="67" cy="19" r="14" fill="#F79E1B" fillOpacity="0.9" />
      <text
        x="24"
        y="34"
        fill="#333333"
        fontFamily="Arial, sans-serif"
        fontSize="7"
        fontWeight="700"
      >
        mastercard
      </text>
    </svg>
  );
}

function AmexLogo() {
  return (
    <svg
      aria-label="American Express card brand"
      role="img"
      viewBox="0 0 120 38"
      className="h-9 w-28"
    >
      <rect width="120" height="38" rx="6" fill="#2E77BC" opacity="0.9" />
      <text
        x="14"
        y="17"
        fill="#ffffff"
        fontFamily="Arial, sans-serif"
        fontSize="11"
        fontWeight="800"
      >
        AMERICAN
      </text>
      <text
        x="14"
        y="30"
        fill="#ffffff"
        fontFamily="Arial, sans-serif"
        fontSize="11"
        fontWeight="800"
      >
        EXPRESS
      </text>
    </svg>
  );
}

function EloLogo() {
  return (
    <svg
      aria-label="Elo card brand"
      role="img"
      viewBox="0 0 120 38"
      className="h-9 w-28"
    >
      <circle cx="37" cy="19" r="8" fill="#FFD400" />
      <circle cx="53" cy="19" r="8" fill="#00A4E4" />
      <circle cx="69" cy="19" r="8" fill="#EF3340" />
      <text
        x="33"
        y="25"
        fill="#111827"
        fontFamily="Arial, sans-serif"
        fontSize="22"
        fontWeight="800"
      >
        elo
      </text>
    </svg>
  );
}

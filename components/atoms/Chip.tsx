"use client";

import MuiChip from "@mui/material/Chip";

import { cn } from "@/lib/cn";

export function Chip({
  label,
  tone = "neutral",
  className,
}: {
  label: string;
  tone?: "brand" | "neutral";
  className?: string;
}) {
  return (
    <MuiChip
      label={label}
      size="small"
      className={cn(
        "shrink-0 font-semibold",
        tone === "brand" && "bg-brand-50 text-brand-700",
        tone === "neutral" && "bg-neutral-100 text-neutral-700",
        className,
      )}
    />
  );
}

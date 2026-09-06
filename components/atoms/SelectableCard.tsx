"use client";

import MuiCard from "@mui/material/Card";
import MuiCardActionArea from "@mui/material/CardActionArea";
import MuiCardContent from "@mui/material/CardContent";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function SelectableCard({
  children,
  selected,
  onClick,
  ariaChecked,
  className,
}: {
  children: ReactNode;
  selected?: boolean;
  onClick: () => void;
  ariaChecked: boolean;
  className?: string;
}) {
  return (
    <MuiCard
      variant="outlined"
      className={cn(
        "h-full rounded-lg border bg-white transition hover:border-brand-300 hover:shadow-sm",
        selected
          ? "border-brand-600 ring-1 ring-brand-600"
          : "border-neutral-200",
        className,
      )}
    >
      <MuiCardActionArea
        role="radio"
        aria-checked={ariaChecked}
        onClick={onClick}
        className="flex h-full items-stretch text-left focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <MuiCardContent className="flex h-full w-full flex-col p-5">
          {children}
        </MuiCardContent>
      </MuiCardActionArea>
    </MuiCard>
  );
}

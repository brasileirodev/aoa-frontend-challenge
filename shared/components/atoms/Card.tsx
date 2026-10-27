"use client";
import MuiCard from "@mui/material/Card";
import type { ReactNode } from "react";
import { cn } from "@shared/utils/cn";
export function Card({
  children,
  className,
  padding = "normal",
}: {
  children: ReactNode;
  className?: string;
  padding?: "normal" | "compact";
}) {
  return (
    <MuiCard
      variant="outlined"
      className={cn(
        "rounded-xl",
        padding === "normal" ? "p-6" : "p-4",
        className,
      )}
    >
      {children}
    </MuiCard>
  );
}

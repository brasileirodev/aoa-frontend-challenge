"use client";
import MuiCard from "@mui/material/Card";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <MuiCard variant="outlined" className={cn("rounded-xl p-6", className)}>
      {children}
    </MuiCard>
  );
}

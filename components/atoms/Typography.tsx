"use client";
import MuiTypography from "@mui/material/Typography";
import type { ReactNode } from "react";
export function Typography({
  as = "p",
  children,
  className,
  id,
}: {
  as?: "p" | "h1" | "h2" | "h3" | "span";
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <MuiTypography component={as} className={className} id={id}>
      {children}
    </MuiTypography>
  );
}

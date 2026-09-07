"use client";

import MuiAlert from "@mui/material/Alert";
import type { ReactNode } from "react";

export function Notice({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "success" | "warning";
}) {
  return (
    <MuiAlert severity={tone} role="status">
      {children}
    </MuiAlert>
  );
}

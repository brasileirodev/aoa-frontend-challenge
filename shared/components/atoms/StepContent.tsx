"use client";

import type { ReactNode } from "react";

export function StepContent({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-5xl space-y-8">{children}</div>;
}

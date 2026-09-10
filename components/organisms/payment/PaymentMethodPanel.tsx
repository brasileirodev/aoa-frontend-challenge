"use client";

import type { ReactNode } from "react";
import { Card } from "@/components/atoms/Card";

export function PaymentMethodPanel({ children }: { children: ReactNode }) {
  return (
    <Card className="mx-auto flex min-h-[360px] w-full max-w-3xl flex-col justify-center border-neutral-300 bg-gradient-to-br from-white via-brand-50 to-neutral-100 p-5 shadow-lg sm:p-6">
      {children}
    </Card>
  );
}

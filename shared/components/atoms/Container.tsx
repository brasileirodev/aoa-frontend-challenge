import type { ReactNode } from "react";
import { cn } from "@shared/utils/cn";

export interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "default" | "wide";
}

export function Container({
  children,
  className,
  size = "default",
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6",
        size === "wide" ? "max-w-300 lg:px-12" : "max-w-5xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

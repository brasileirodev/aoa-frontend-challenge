"use client";
import MuiButton from "@mui/material/Button";
import type { ComponentPropsWithRef } from "react";
export type ButtonProps = Omit<ComponentPropsWithRef<"button">, "color"> & {
  variant?: "primary" | "secondary" | "text";
  size?: "sm" | "md" | "lg";
};
export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <MuiButton
      {...props}
      type={type}
      variant={
        { primary: "contained", secondary: "outlined", text: "text" }[
          variant
        ] as "contained" | "outlined" | "text"
      }
      size={
        { sm: "small", md: "medium", lg: "large" }[size] as
          "small" | "medium" | "large"
      }
      disableElevation
    />
  );
}

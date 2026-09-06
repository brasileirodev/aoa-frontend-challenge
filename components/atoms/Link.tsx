"use client";
import NextLink from "next/link";
import MuiLink from "@mui/material/Link";
import MuiButton from "@mui/material/Button";
import type { ComponentPropsWithRef } from "react";
export type LinkProps = Omit<ComponentPropsWithRef<"a">, "color"> & {
  href: string;
  appearance?: "link" | "primary" | "secondary";
};
export function Link({ appearance = "link", ...props }: LinkProps) {
  return appearance === "link" ? (
    <MuiLink component={NextLink} underline="hover" {...props} />
  ) : (
    <MuiButton
      component={NextLink}
      variant={appearance === "primary" ? "contained" : "outlined"}
      size="large"
      disableElevation
      {...props}
    />
  );
}

"use client";

import SvgIcon from "@mui/material/SvgIcon";
import MuiIconButton from "@mui/material/IconButton";
import type { ComponentPropsWithRef } from "react";

export type RefreshActionButtonProps = ComponentPropsWithRef<"button">;

export function RefreshActionButton(props: RefreshActionButtonProps) {
  return (
    <MuiIconButton
      {...props}
      aria-label="Generate a new Pix"
      className="size-14"
      color="primary"
    >
      <RefreshIcon />
    </MuiIconButton>
  );
}

function RefreshIcon() {
  return (
    <SvgIcon fontSize="large" aria-hidden="true" viewBox="0 0 24 24">
      <path d="M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 7.75 10h-2.1A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h8V3z" />
    </SvgIcon>
  );
}

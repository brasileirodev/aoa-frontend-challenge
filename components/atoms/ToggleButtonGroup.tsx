"use client";

import MuiToggleButton from "@mui/material/ToggleButton";
import MuiToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type ToggleOption<T extends string> = {
  value: T;
  label: ReactNode;
};

export function ToggleButtonGroup<T extends string>({
  value,
  options,
  ariaLabel,
  onChange,
  className,
}: {
  value: T;
  options: ToggleOption<T>[];
  ariaLabel: string;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <MuiToggleButtonGroup
      exclusive
      value={value}
      aria-label={ariaLabel}
      onChange={(_, nextValue: T | null) => {
        if (nextValue) onChange(nextValue);
      }}
      className={cn(
        "grid grid-cols-2 rounded-lg border border-neutral-200 bg-neutral-50 p-1",
        className,
      )}
      size="small"
    >
      {options.map((option) => (
        <MuiToggleButton
          key={option.value}
          value={option.value}
          className="border-0 px-4 py-2 text-sm font-semibold text-neutral-600 normal-case [&.Mui-selected]:!bg-brand-600 [&.Mui-selected]:!text-white [&.Mui-selected:hover]:!bg-brand-700"
          sx={{
            "&.Mui-selected": {
              backgroundColor: "var(--color-brand-600)",
              color: "white",
            },
            "&.Mui-selected:hover": {
              backgroundColor: "var(--color-brand-700)",
            },
          }}
        >
          {option.label}
        </MuiToggleButton>
      ))}
    </MuiToggleButtonGroup>
  );
}

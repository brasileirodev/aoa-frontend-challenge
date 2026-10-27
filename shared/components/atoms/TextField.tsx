"use client";
import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import MuiTextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
export type TextFieldProps = Omit<
  ComponentPropsWithRef<"input">,
  "size" | "color"
> & { label: string; error?: string; endAdornment?: ReactNode };
export function TextField({
  ref,
  label,
  error,
  endAdornment,
  id,
  className,
  "aria-describedby": description,
  ...input
}: TextFieldProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <MuiTextField
      id={fieldId}
      label={label}
      error={Boolean(error)}
      helperText={error}
      fullWidth
      className={className}
      inputRef={ref}
      required={input.required}
      disabled={input.disabled}
      type={input.type}
      slotProps={{
        htmlInput: {
          ...input,
          "aria-describedby":
            [description, error ? fieldId + "-helper-text" : null]
              .filter(Boolean)
              .join(" ") || undefined,
        },
        inputLabel: { shrink: true },
        input: {
          endAdornment: endAdornment ? (
            <InputAdornment position="end">{endAdornment}</InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
}

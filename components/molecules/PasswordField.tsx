"use client";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { TextField, type TextFieldProps } from "@/components/atoms/TextField";

type PasswordFieldProps = Omit<TextFieldProps, "type" | "endAdornment"> & {
  suppressCredentialSave?: boolean;
};

const credentialSafePasswordClassName =
  "[&_.MuiInputBase-input]:[-webkit-text-security:disc]";

export function PasswordField({
  suppressCredentialSave = false,
  className,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const shouldUseCredentialSafeInput = suppressCredentialSave && !visible;
  const passwordClassName = [
    className,
    shouldUseCredentialSafeInput ? credentialSafePasswordClassName : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <TextField
      {...props}
      className={passwordClassName}
      type={visible || suppressCredentialSave ? "text" : "password"}
      endAdornment={
        <Button
          variant="text"
          size="sm"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-controls={props.id}
          onClick={() => setVisible(!visible)}
        >
          {visible ? "Hide" : "Show"}
        </Button>
      }
    />
  );
}

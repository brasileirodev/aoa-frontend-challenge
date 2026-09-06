"use client";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { TextField, type TextFieldProps } from "@/components/atoms/TextField";
export function PasswordField(
  props: Omit<TextFieldProps, "type" | "endAdornment">,
) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
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

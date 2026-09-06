"use client";
import type { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const theme = createTheme({
  typography: {
    fontFamily: "var(--font-sans)",
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "var(--radius-md)",
          variants: [
            {
              props: { variant: "contained", color: "primary" },
              style: {
                backgroundColor: "var(--color-brand-600)",
                color: "white",
                "&:hover": { backgroundColor: "var(--color-brand-700)" },
              },
            },
            {
              props: { variant: "outlined", color: "primary" },
              style: {
                color: "var(--color-brand-700)",
                borderColor: "var(--color-neutral-300)",
              },
            },
            {
              props: { variant: "text", color: "primary" },
              style: { color: "var(--color-brand-700)" },
            },
          ],
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "var(--radius-md)",
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-brand-600)",
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-danger)",
          },
        },
        notchedOutline: { borderColor: "var(--color-neutral-300)" },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": { color: "var(--color-brand-600)" },
          "&.Mui-error": { color: "var(--color-danger)" },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: { "&.Mui-error": { color: "var(--color-danger)" } },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { color: "var(--color-neutral-900)" } },
    },
  },
});
export function DesignSystemProvider({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppRouterCacheProvider>
  );
}

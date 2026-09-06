import { z } from "zod";

export const passwordRules = [
  {
    label: "At least 12 characters",
    test: (value: string) => value.length >= 12,
  },
  {
    label: "Uppercase and lowercase letters",
    test: (value: string) => /[A-Z]/.test(value) && /[a-z]/.test(value),
  },
  {
    label: "At least one number",
    test: (value: string) => /[0-9]/.test(value),
  },
  {
    label: "At least one symbol",
    test: (value: string) => /[^\p{L}\p{N}\s]/u.test(value),
  },
];

export const registrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(100, "Use no more than 100 characters."),
  company: z
    .string()
    .trim()
    .min(2, "Enter your company name.")
    .max(120, "Use no more than 120 characters."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(254, "Email address is too long."),
  password: z
    .string()
    .max(128, "Use no more than 128 characters.")
    .superRefine((value, ctx) => {
      for (const rule of passwordRules) {
        if (!rule.test(value))
          ctx.addIssue({ code: "custom", message: rule.label + "." });
      }
    }),
});

export type RegistrationValues = z.infer<typeof registrationSchema>;

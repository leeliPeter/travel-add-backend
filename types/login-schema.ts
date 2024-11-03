import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
  code: z.optional(z.string()),
  form: z.string().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

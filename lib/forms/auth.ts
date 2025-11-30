import * as z from "zod";

export const loginformSchema = z.object({
  email: z.string().email("must be a valid email"),
  password: z
    .string()
    .min(6, "must be at least 6 characters")
    .max(20, "must be at most 20 characters"),
});

export const forgotPasswordFormSchema = z.object({
  email: z.string().email("must be a valid email"),
});

export const resetPasswordformSchema = z
  .object({
    email: z.string().email("must be a valid email"),
    otp: z.string().min(4, "must be at least 4 characters"),
    password: z
      .string()
      .min(6, "must be at least 6 characters")
      .max(20, "must be at most 20 characters"),
    confirm_password: z
      .string()
      .min(6, "must be at least 6 characters")
      .max(20, "must be at most 20 characters"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

import * as z from "zod";

export const userFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Must be a valid email"),
    password: z.string().optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      // If password is provided and not empty, confirmPassword must match
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      // If password is provided and not empty, it must be at least 6 characters
      if (data.password && data.password.length > 0) {
        return data.password.length >= 6;
      }
      return true;
    },
    {
      message: "Password must be at least 6 characters",
      path: ["password"],
    }
  );

export type UserFormData = z.infer<typeof userFormSchema>;


import * as z from "zod";

export const userFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Must be a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // If password is provided, confirmPassword must match
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type UserFormData = z.infer<typeof userFormSchema>;


import * as z from "zod";

const fileSchema = typeof File !== "undefined" ? z.instanceof(File) : z.any(); // fallback for SSR/build

export const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  image: z.union([
    fileSchema.refine((f) => !!f, { message: "Image is required" }),
    z.string().min(1, "Image is required"),
  ]),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  visibleToUsers: z.array(z.string()).optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

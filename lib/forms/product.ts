import * as z from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  image: z.union([
    z.instanceof(File, { message: "Image is required" }),
    z.string().min(1, "Image is required"),
  ]),
  category: z.string().min(1, "Category is required"),
  price: z.union([
    z.number().min(0, "Price cannot be negative"),
    z.string().transform((val) => {
      const num = parseFloat(val);
      if (isNaN(num)) throw new Error("Price must be a number");
      return num;
    }),
  ]),
  description: z.string().optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;


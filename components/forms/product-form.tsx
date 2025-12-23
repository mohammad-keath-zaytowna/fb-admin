"use client";

import { productFormSchema, ProductFormData } from "@/lib/forms/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import RHFInput from "../react-hook-form/rhf-input";
import RHFTextarea from "../react-hook-form/rhf-textarea";
import RHFImageUpload from "../react-hook-form/rhf-image-upload";
import { Button } from "../ui/button";
import { Product } from "@/types";
import { useState } from "react";
import { Input } from "../ui/input";
import { Field, FieldLabel } from "../ui/field";
import { IconPlus, IconX } from "@tabler/icons-react";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ProductForm({ initialData, onSubmit, isLoading = false }: ProductFormProps) {
  const [colors, setColors] = useState<string[]>(initialData?.colors || []);
  const [sizes, setSizes] = useState<string[]>(initialData?.sizes || []);
  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      image: initialData?.image || "",
      category: initialData?.category || "",
      price: initialData?.price || '',
      description: initialData?.description || "",
      colors: initialData?.colors || [],
      sizes: initialData?.sizes || [],
    },
    mode: "onChange",
  });

  const handleSubmit = async (data: ProductFormData) => {
    await onSubmit({
      ...data,
      colors: colors.filter((c) => c.trim() !== ""),
      sizes: sizes.filter((s) => s.trim() !== ""),
    });
  };

  const addColor = () => {
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      setColors([...colors, newColor.trim()]);
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    setColors(colors.filter((c) => c !== color));
  };

  const addSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim()]);
      setNewSize("");
    }
  };

  const removeSize = (size: string) => {
    setSizes(sizes.filter((s) => s !== size));
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <RHFInput
          name="name"
          label="Product Name"
          type="text"
          placeholder="Product Name"
          disabled={isLoading}
        />
        <RHFImageUpload
          name="image"
          label="Product Image"
          disabled={isLoading}
          initialImageUrl={initialData?.image}
        />
        <RHFInput
          name="category"
          label="Category"
          type="text"
          placeholder="Electronics"
          disabled={isLoading}
        />
        <RHFInput
          name="price"
          label="Price"
          type="text"
          placeholder="99.99"
          disabled={isLoading}
        />
        <RHFTextarea
          name="description"
          label="Description"
          placeholder="Product description"
          rows={4}
          disabled={isLoading}
        />
        
        <Field>
          <FieldLabel>Colors</FieldLabel>
          <div className="flex gap-2">
            <Input
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              placeholder="Add color"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addColor();
                }
              }}
            />
            <Button type="button" onClick={addColor} variant="outline">
              <IconPlus className="h-4 w-4" />
            </Button>
          </div>
          {colors.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {colors.map((color) => (
                    <div
                      key={color}
                      className="flex items-center gap-2 px-2 py-1 bg-muted rounded-md"
                    >
                      <div
                        aria-hidden
                        style={{ backgroundColor: color }}
                        className="w-3 h-3 rounded-sm border border-input"
                      />
                      <span>{color}</span>
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <IconX className="h-3 w-3" />
                      </button>
                    </div>
              ))}
            </div>
          )}
        </Field>

        <Field>
          <FieldLabel>Sizes</FieldLabel>
          <div className="flex gap-2">
            <Input
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="Add size"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSize();
                }
              }}
            />
            <Button type="button" onClick={addSize} variant="outline">
              <IconPlus className="h-4 w-4" />
            </Button>
          </div>
          {sizes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {sizes.map((size) => (
                <div
                  key={size}
                  className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md"
                >
                  <span>{size}</span>
                  <button
                    type="button"
                    onClick={() => removeSize(size)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <IconX className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Field>

        <Button
          type="submit"
          variant="default"
          disabled={isLoading}
          className="w-full mt-2 p-6"
        >
          {isLoading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
        </Button>
      </form>
    </FormProvider>
  );
}


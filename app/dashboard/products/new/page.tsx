"use client";

import { ProductForm } from "@/components/forms/product-form";
import { createProduct } from "@/lib/api/products";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductFormData } from "@/lib/forms/product";

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setIsLoading(true);
      await createProduct({
        name: data.name,
        image: data.image,
        category: data.category,
        price: data.price,
        description: data.description,
        colors: data.colors,
        sizes: data.sizes,
        visibleToUsers: data.visibleToUsers,
      });
      router.push("/dashboard/products");
    } catch (error) {
      console.error("Failed to create product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Product</CardTitle>
          <CardDescription>Add a new product to the catalog</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}

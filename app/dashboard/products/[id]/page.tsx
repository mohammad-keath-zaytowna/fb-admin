"use client";

import { ProductForm } from "@/components/forms/product-form";
import { getProductById, updateProduct } from "@/lib/api/products";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormData } from "@/lib/forms/product";
import { Product } from "@/types";

function EditProductContent() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoadingProduct(true);
        const fetchedProduct = await getProductById(productId);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        router.push("/dashboard/products");
      } finally {
        setIsLoadingProduct(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setIsLoading(true);
      console.log('=== PAGE SUBMIT ===');
      console.log('data.stock:', data.stock, 'Type:', typeof data.stock);

      await updateProduct(productId, {
        name: data.name,
        image: data.image,
        category: data.category,
        price: data.price,
        description: data.description,
        colors: data.colors,
        sizes: data.sizes,
        stock: data.stock,
      });
      router.push("/dashboard/products");
    } catch (error) {
      console.error("Failed to update product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-muted-foreground">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
          <CardDescription>Update product information</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm initialData={product} onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditProductPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <EditProductContent />
    </Suspense>
  );
}


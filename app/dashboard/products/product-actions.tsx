"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { IconDotsVertical } from "@tabler/icons-react"
import { updateProductStatus, deleteProduct } from "@/lib/api/products"
import { useRouter } from "next/navigation"
import { Product } from "@/types"

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();

  const handleStatusChange = async (newStatus: "active" | "inactive" | "deleted") => {
    try {
      await updateProductStatus(product._id, newStatus);
      window.location.reload();;
    } catch (error) {
      console.error("Failed to update product status:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(product._id);
        window.location.reload();;
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <IconDotsVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/dashboard/products/${product._id}`)}>
          Edit
        </DropdownMenuItem>
        {product.status !== "active" && (
          <DropdownMenuItem onClick={() => handleStatusChange("active")}>
            Activate
          </DropdownMenuItem>
        )}
        {product.status !== "inactive" && (
          <DropdownMenuItem onClick={() => handleStatusChange("inactive")}>
            Deactivate
          </DropdownMenuItem>
        )}
        {product.status !== "deleted" && (
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


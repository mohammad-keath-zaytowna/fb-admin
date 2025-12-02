"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Product } from "@/types"
import { Badge } from "@/components/ui/badge"
import { ProductActions } from "./product-actions"
import Image from "next/image"
import { getImageUrl } from "@/lib/utils/image"

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = getImageUrl(row.original.image);
      return (
        <div className="w-16 h-16 relative rounded-md overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image}
              alt={row.original.name}
              fill
              className="object-cover"
              sizes="64px"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
              No Image
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return (
        <Badge variant="outline">
          {row.original.category}
        </Badge>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      return `$${row.original.price.toFixed(2)}`;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusConfig = {
        active: { label: "Active", className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" },
        inactive: { label: "Inactive", className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20" },
        deleted: { label: "Deleted", className: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20" },
      };
      const config = statusConfig[status] || statusConfig.active;
      return (
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.original.createdAt;
      if (!date) return "-";
      return new Date(date).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ProductActions product={row.original} />;
    },
  },
]

// Add edit link to product name
export const columnsWithEdit: ColumnDef<Product>[] = [
  ...columns.slice(0, 2),
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <a
          href={`/dashboard/products/${row.original._id}`}
          className="text-primary hover:underline"
        >
          {row.original.name}
        </a>
      );
    },
  },
  ...columns.slice(2),
]



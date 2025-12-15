"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Order } from "@/types"
import { Badge } from "@/components/ui/badge"
import { OrderActions } from "./order-actions"

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "_id",
    header: "Order ID",
    cell: ({ row }) => {
      return (
        <a
          href={`/dashboard/orders/${row.original._id}`}
          className="font-mono text-xs text-primary hover:underline"
        >
          {row.original._id.slice(-8).toUpperCase()}
        </a>
      );
    },
  },
  {
    accessorKey: "userName",
    header: "User",
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.original.items;
      const totalItems = items.reduce((sum, item) => sum + item.count, 0);
      return <span>{totalItems} item(s)</span>;
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      return `JOD ${row.original.total.toFixed(2)}`;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusConfig = {
        pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20" },
        paid: { label: "Paid", className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20" },
        shipped: { label: "Shipped", className: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20" },
        completed: { label: "Completed", className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" },
        cancelled: { label: "Cancelled", className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20" },
      };
      const config = statusConfig[status] || statusConfig.pending;
      return (
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.createdAt;
      if (!date) return "-";
      return new Date(date).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <OrderActions order={row.original} />;
    },
  },
]


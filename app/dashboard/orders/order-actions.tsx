"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDotsVertical } from "@tabler/icons-react";
import { updateOrderStatus } from "@/lib/api/orders";
import { useRouter } from "next/navigation";
import { Order } from "@/types";

interface OrderActionsProps {
  order: Order;
}

export function OrderActions({ order }: OrderActionsProps) {
  const router = useRouter();

  const handleStatusChange = async (
    newStatus: "pending" | "paid" | "shipped" | "completed" | "cancelled"
  ) => {
    try {
      await updateOrderStatus(order._id, newStatus);
      console.log("teste");
      router.refresh();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const statusOptions: Array<{
    value: "pending" | "paid" | "shipped" | "completed" | "cancelled";
    label: string;
  }> = [
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "shipped", label: "Shipped" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <IconDotsVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {statusOptions
          .filter((option) => option.value !== order.status)
          .map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
            >
              Mark as {option.label}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

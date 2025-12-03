"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/types"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { IconDotsVertical } from "@tabler/icons-react"
import { UserActions } from "./user-actions"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.name}
        </span>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge variant={role === "admin" || role === "superAdmin" ? "default" : "secondary"}>
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusConfig = {
        active: { label: "Active", className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" },
        blocked: { label: "Blocked", className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20" },
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
      return <UserActions user={row.original} />;
    },
  },
]
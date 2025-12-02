"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { IconDotsVertical } from "@tabler/icons-react"
import { updateUserStatus, deleteUser } from "@/lib/api/users"
import { useRouter } from "next/navigation"
import { User } from "@/types"

interface UserActionsProps {
  user: User;
}

export function UserActions({ user }: UserActionsProps) {
  const router = useRouter();
  
  const handleStatusChange = async (newStatus: "active" | "blocked" | "deleted") => {
    try {
      await updateUserStatus(user._id, newStatus);
      router.refresh();
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };
  
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(user._id);
        router.refresh();
      } catch (error) {
        console.error("Failed to delete user:", error);
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
        <DropdownMenuItem onClick={() => router.push(`/dashboard/users/${user._id}`)}>
          Edit
        </DropdownMenuItem>
        {user.status !== "active" && (
          <DropdownMenuItem onClick={() => handleStatusChange("active")}>
            Activate
          </DropdownMenuItem>
        )}
        {user.status !== "blocked" && (
          <DropdownMenuItem onClick={() => handleStatusChange("blocked")}>
            Block
          </DropdownMenuItem>
        )}
        {user.status !== "deleted" && (
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


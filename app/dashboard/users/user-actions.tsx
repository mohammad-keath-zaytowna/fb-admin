"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconDotsVertical } from "@tabler/icons-react"
import { updateUserStatus, deleteUser, updateUserPassword } from "@/lib/api/users"
import { useRouter } from "next/navigation"
import { User } from "@/types"

interface UserActionsProps {
  user: User;
}

export function UserActions({ user }: UserActionsProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await updateUserPassword(user._id, newPassword, confirmPassword);
      setIsPasswordDialogOpen(false);
      setNewPassword("");
      setConfirmPassword("");
      router.refresh();
    } catch (error) {
      console.error("Failed to update password:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPasswordDialog = () => {
    setDropdownOpen(false);
    setTimeout(() => {
      setIsPasswordDialogOpen(true);
    }, 150);
  };

  const isPasswordValid = newPassword.length >= 6 && newPassword === confirmPassword;

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/dashboard/users/${user._id}`)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => {
            e.preventDefault();
            openPasswordDialog();
          }}>
            Change Password
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

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Set a new password for {user.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                autoComplete="new-password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-500">Passwords do not match</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsPasswordDialogOpen(false);
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordChange}
              disabled={!isPasswordValid || isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { getUsers, updateUser } from "@/lib/api/users";
import { User } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function UserPermissions() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await getUsers({ rowsPerPage: 20 });
            setUsers(response.users || []);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePermissionChange = async (userId: string, canSeeAllOrders: boolean) => {
        try {
            setUpdatingUserId(userId);
            await updateUser(userId, { canSeeAllOrders });

            // Update local state
            setUsers(users.map(u =>
                u._id === userId ? { ...u, canSeeAllOrders } : u
            ));

            toast.success(`Permission updated successfully`);
        } catch (error) {
            console.error("Failed to update permission:", error);
            toast.error("Failed to update permission");
        } finally {
            setUpdatingUserId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                No users found. Create users to manage their permissions.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {users.map((user) => (
                <div
                    key={user._id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                >
                    <div className="flex-1">
                        <Label htmlFor={`permission-${user._id}`} className="font-medium">
                            {user.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Label
                            htmlFor={`permission-${user._id}`}
                            className="text-sm text-muted-foreground"
                        >
                            Can see all orders
                        </Label>
                        <Switch
                            id={`permission-${user._id}`}
                            checked={user.canSeeAllOrders || false}
                            onCheckedChange={(checked: boolean) => handlePermissionChange(user._id, checked)}
                            disabled={updatingUserId === user._id}
                        />
                        {updatingUserId === user._id && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import {
    getAllAdminSubscriptions,
    updateAdminExpiry,
    AdminSubscription,
} from "@/lib/api/subscription";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Calendar, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function AdminManagementPage() {
    const [admins, setAdmins] = useState<AdminSubscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAdmin, setSelectedAdmin] = useState<AdminSubscription | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newExpiryDate, setNewExpiryDate] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setIsLoading(true);
        try {
            const data = await getAllAdminSubscriptions();
            setAdmins(data.admins);
        } catch (error) {
            console.error("Failed to fetch admins:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditExpiry = (admin: AdminSubscription) => {
        setSelectedAdmin(admin);
        setNewExpiryDate(
            admin.subscriptionExpiryDate
                ? format(new Date(admin.subscriptionExpiryDate), "yyyy-MM-dd")
                : ""
        );
        setIsDialogOpen(true);
    };

    const handleExtend = (days: number) => {
        const currentExpiry = selectedAdmin?.subscriptionExpiryDate
            ? new Date(selectedAdmin.subscriptionExpiryDate)
            : new Date();
        const newDate = new Date(currentExpiry);
        newDate.setDate(newDate.getDate() + days);
        setNewExpiryDate(format(newDate, "yyyy-MM-dd"));
    };

    const handleSave = async () => {
        if (!selectedAdmin) return;

        setIsSaving(true);
        try {
            await updateAdminExpiry(selectedAdmin._id, newExpiryDate || null);
            await fetchAdmins();
            setIsDialogOpen(false);
            setSelectedAdmin(null);
        } catch (error) {
            console.error("Failed to update expiry:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const getStatusBadge = (admin: AdminSubscription) => {
        if (!admin.subscriptionExpiryDate) {
            return (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                    No Expiry
                </span>
            );
        }

        if (admin.isExpired) {
            return (
                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                    Expired
                </span>
            );
        }

        const days = admin.daysRemaining || 0;
        if (days > 7) {
            return (
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    {days} days
                </span>
            );
        } else if (days > 3) {
            return (
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    {days} days
                </span>
            );
        } else {
            return (
                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                    {days} days
                </span>
            );
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Admin Management</h1>
                <p className="text-muted-foreground mt-2">
                    Manage admin subscriptions and expiry dates
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Admin Users</CardTitle>
                    <CardDescription>
                        View and manage subscription expiry dates for all admin users
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Expiry Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {admins.map((admin) => (
                                    <TableRow key={admin._id}>
                                        <TableCell className="font-medium">{admin.name}</TableCell>
                                        <TableCell>{admin.email}</TableCell>
                                        <TableCell>
                                            {admin.subscriptionExpiryDate
                                                ? format(new Date(admin.subscriptionExpiryDate), "MMM d, yyyy")
                                                : "No expiry set"}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(admin)}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditExpiry(admin)}
                                            >
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Edit Expiry Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Subscription Expiry</DialogTitle>
                        <DialogDescription>
                            Set the subscription expiry date for {selectedAdmin?.name}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="expiry-date">Expiry Date</Label>
                            <Input
                                id="expiry-date"
                                type="date"
                                value={newExpiryDate}
                                onChange={(e) => setNewExpiryDate(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExtend(30)}
                                className="flex-1"
                            >
                                +30 Days
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExtend(90)}
                                className="flex-1"
                            >
                                +90 Days
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExtend(365)}
                                className="flex-1"
                            >
                                +365 Days
                            </Button>
                        </div>

                        {selectedAdmin?.isExpired && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-800 border border-red-200">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm">
                                    This admin's subscription is currently expired
                                </span>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

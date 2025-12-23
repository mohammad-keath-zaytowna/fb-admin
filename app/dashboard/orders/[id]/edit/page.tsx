"use client";

import { getOrderById, updateOrder } from "@/lib/api/orders";
import { getProducts } from "@/lib/api/products";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Order, Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { IconArrowLeft, IconTrash } from "@tabler/icons-react";

function OrderEditContent() {
    const router = useRouter();
    const params = useParams();
    const orderId = params.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [userName, setUserName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [shipping, setShipping] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [notes, setNotes] = useState("");
    const [status, setStatus] = useState<"pending" | "paid" | "shipped" | "completed" | "cancelled">("pending");
    const [items, setItems] = useState<Array<{
        prod_id: string;
        count: number;
        size?: string;
        color?: string;
        price: number;
    }>>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [fetchedOrder, productsResponse] = await Promise.all([
                    getOrderById(orderId),
                    getProducts({ page: 1, rowsPerPage: 10 })
                ]);

                setOrder(fetchedOrder);
                setProducts(productsResponse.products);

                // Initialize form with order data
                setUserName(fetchedOrder.userName);
                setPhoneNumber(fetchedOrder.phoneNumber);
                setAddress(fetchedOrder.address);
                setShipping(fetchedOrder.shipping);
                setDiscount(fetchedOrder.discount || 0);
                setNotes(fetchedOrder.notes || "");
                setStatus(fetchedOrder.status);
                setItems(fetchedOrder.items.map((item) => ({
                    prod_id: typeof item.prod_id === "string" ? item.prod_id : item.prod_id._id,
                    count: item.count,
                    size: item.size,
                    color: item.color,
                    price: item.price,
                })));
            } catch (error) {
                console.error("Failed to fetch order:", error);
                router.push("/dashboard/orders");
            } finally {
                setIsLoading(false);
            }
        };

        if (orderId) {
            fetchData();
        }
    }, [orderId, router]);

    const calculateTotal = () => {
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.count), 0);
        return Math.max(0, subtotal + shipping - discount);
    };

    const handleAddItem = () => {
        if (products.length > 0) {
            setItems([...items, {
                prod_id: products[0]._id,
                count: 1,
                price: parseFloat(products[0].price),
            }]);
        }
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await updateOrder(orderId, {
                items,
                userName,
                phoneNumber,
                address,
                shipping,
                discount,
                notes,
                status,
            });
            router.push(`/dashboard/orders/${orderId}`);
        } catch (error) {
            console.error("Failed to update order:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                        <p className="mt-4 text-muted-foreground">Loading order...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.count), 0);
    const total = calculateTotal();

    return (
        <div className="container mx-auto py-10 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                    <IconArrowLeft className="h-4 w-4" />
                    Back
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Order #{order._id.slice(-8).toUpperCase()}</CardTitle>
                    <CardDescription>
                        Update order information and items
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Customer Information */}
                    <div>
                        <h3 className="font-semibold mb-3">Customer Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="userName">Name</Label>
                                <Input
                                    id="userName"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="phoneNumber">Phone</Label>
                                <Input
                                    id="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">Order Items</h3>
                            <Button variant="outline" size="sm" onClick={handleAddItem}>
                                Add Item
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {items.map((item, index) => {
                                const product = products.find(p => p._id === item.prod_id);
                                return (
                                    <div key={index} className="flex gap-3 items-end p-3 border rounded-lg">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                                            <div>
                                                <Label>Product</Label>
                                                <Select
                                                    value={item.prod_id}
                                                    onValueChange={(value) => {
                                                        const selectedProduct = products.find(p => p._id === value);
                                                        handleItemChange(index, "prod_id", value);
                                                        if (selectedProduct) {
                                                            handleItemChange(index, "price", parseFloat(selectedProduct.price));
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {products.map((p) => (
                                                            <SelectItem key={p._id} value={p._id}>
                                                                {p.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Quantity</Label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={item.count}
                                                    onChange={(e) => handleItemChange(index, "count", parseInt(e.target.value))}
                                                />
                                            </div>
                                            <div>
                                                <Label>Price</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.price}
                                                    onChange={(e) => handleItemChange(index, "price", parseFloat(e.target.value))}
                                                />
                                            </div>
                                            <div>
                                                <Label>Total</Label>
                                                <div className="h-10 flex items-center font-semibold">
                                                    JOD {(item.price * item.count).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleRemoveItem(index)}
                                        >
                                            <IconTrash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Financial Details */}
                    <div>
                        <h3 className="font-semibold mb-3">Financial Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="shipping">Shipping</Label>
                                <Input
                                    id="shipping"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={shipping}
                                    onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="discount">Discount</Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={discount}
                                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </div>
                        <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>JOD {subtotal.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Discount</span>
                                    <span className="text-green-600">-JOD {discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>JOD {shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                                <span>Total</span>
                                <span>JOD {total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Status and Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function OrderEditPage() {
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
            <OrderEditContent />
        </Suspense>
    );
}

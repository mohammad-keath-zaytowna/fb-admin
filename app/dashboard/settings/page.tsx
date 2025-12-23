"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateCurrency } from "@/lib/api/currency";
import { getCurrentUser } from "@/lib/api/auth";
import { Loader2 } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

const CURRENCIES = [
    { value: "USD", label: "US Dollar ($)", symbol: "$" },
    { value: "JOD", label: "Jordanian Dinar (JOD)", symbol: "JOD" },
    { value: "SP", label: "Syrian Pound (SP)", symbol: "SP" },
];

export default function SettingsPage() {
    const [currency, setCurrency] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { updateUser } = useAuthContext();

    useEffect(() => {
        // Fetch current user from backend
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const user = await getCurrentUser();
                if (user?.currency) {
                    setCurrency(user.currency);
                } else {
                    setCurrency("JOD"); // Default if no currency set
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                setCurrency("JOD"); // Default on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updatedUser = await updateCurrency(currency as 'USD' | 'JOD' | 'SP');

            // Update AuthContext with fresh user data
            if (updatedUser) {
                await updateUser(updatedUser);
            }

        } catch (error) {
            console.error("Failed to update currency:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const selectedCurrency = CURRENCIES.find((c) => c.value === currency);

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your account preferences and settings
                </p>
            </div>

            <div className="max-w-2xl space-y-6">
                {/* Currency Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Currency Preference</CardTitle>
                        <CardDescription>
                            Choose your preferred currency. All prices throughout the dashboard will be displayed in this currency.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <Select value={currency} onValueChange={setCurrency}>
                                        <SelectTrigger id="currency">
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CURRENCIES.map((curr) => (
                                                <SelectItem key={curr.value} value={curr.value}>
                                                    {curr.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedCurrency && (
                                    <div className="rounded-lg bg-muted p-4">
                                        <p className="text-sm font-medium">Preview</p>
                                        <p className="text-2xl font-bold mt-2">
                                            {selectedCurrency.symbol === "$"
                                                ? `${selectedCurrency.symbol}1,234.56`
                                                : `${selectedCurrency.symbol} 1,234.56`
                                            }
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Example price display
                                        </p>
                                    </div>
                                )}

                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="w-full sm:w-auto"
                                >
                                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Additional Settings can be added here */}
                <Card>
                    <CardHeader>
                        <CardTitle>About</CardTitle>
                        <CardDescription>
                            Application information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Version</span>
                                <span className="font-medium">1.0.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Environment</span>
                                <span className="font-medium">
                                    {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

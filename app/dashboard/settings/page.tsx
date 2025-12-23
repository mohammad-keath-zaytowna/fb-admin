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
import { Loader2 } from "lucide-react";

const CURRENCIES = [
    { value: "USD", label: "US Dollar ($)", symbol: "$" },
    { value: "JOD", label: "Jordanian Dinar (JOD)", symbol: "JOD" },
    { value: "SP", label: "Syrian Pound (SP)", symbol: "SP" },
];

export default function SettingsPage() {
    const [currency, setCurrency] = useState<string>(JSON.parse(localStorage.getItem("user") || "{}")?.currency || "USD");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Get current user from localStorage or context
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user.currency) {
                    setCurrency(user.currency);
                }
            } catch (error) {
                console.error("Failed to parse user data:", error);
            }
        }
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updatedUser = await updateCurrency(currency as 'USD' | 'JOD' | 'SP');

            // Update localStorage with new currency
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const user = JSON.parse(storedUser);
                user.currency = currency;
                localStorage.setItem("user", JSON.stringify(user));
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

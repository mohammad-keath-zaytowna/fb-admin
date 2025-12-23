"use client";

import { useEffect, useState } from "react";
import { getSubscriptionStatus, SubscriptionStatus } from "@/lib/api/subscription";
import { AlertCircle, Clock } from "lucide-react";

export function SubscriptionTimer() {
    const [status, setStatus] = useState<SubscriptionStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStatus();
        // Refresh every minute
        const interval = setInterval(fetchStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchStatus = async () => {
        try {
            const data = await getSubscriptionStatus();
            setStatus(data);
        } catch (error) {
            console.error("Failed to fetch subscription status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || !status || !status.hasExpiry) {
        return null;
    }

    const { daysRemaining, isExpired } = status;

    if (isExpired) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-100 text-red-800 border border-red-200">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Subscription Expired</span>
            </div>
        );
    }

    // Color coding based on days remaining
    const getColorClasses = () => {
        if (!daysRemaining) return "";
        if (daysRemaining > 7) {
            return "bg-green-100 text-green-800 border-green-200";
        } else if (daysRemaining > 3) {
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        } else {
            return "bg-red-100 text-red-800 border-red-200";
        }
    };

    const getTimeDisplay = () => {
        if (!daysRemaining) return "";
        if (daysRemaining === 1) return "1 day";
        return `${daysRemaining} days`;
    };

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getColorClasses()}`}>
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
                {getTimeDisplay()} remaining
            </span>
        </div>
    );
}

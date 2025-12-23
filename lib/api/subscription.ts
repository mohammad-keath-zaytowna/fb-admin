import apiClient from "./config";
import { toast } from "sonner";

export interface SubscriptionStatus {
  hasExpiry: boolean;
  role: string;
  expiryDate?: string;
  isExpired?: boolean;
  daysRemaining?: number;
}

export interface AdminSubscription {
  _id: string;
  name: string;
  email: string;
  subscriptionExpiryDate: string | null;
  status: string;
  createdAt: string;
  isExpired: boolean;
  daysRemaining: number | null;
}

// Get current user's subscription status
export const getSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  try {
    const { data } = await apiClient.get("/subscription/status");
    return data?.data || data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || error?.message || "Failed to fetch subscription status");
    throw error;
  }
};

// Get all admins with subscription info (SuperAdmin only)
export const getAllAdminSubscriptions = async (): Promise<{ admins: AdminSubscription[] }> => {
  try {
    const { data } = await apiClient.get("/subscription/admins");
    return data?.data || data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || error?.message || "Failed to fetch admin subscriptions");
    throw error;
  }
};

// Update admin expiry date (SuperAdmin only)
export const updateAdminExpiry = async (
  userId: string,
  expiryDate: string | null
): Promise<{ message: string; user: any }> => {
  try {
    const { data } = await apiClient.put(`/subscription/admin/${userId}`, { expiryDate });
    toast.success(data?.message || "Subscription updated successfully");
    return data?.data || data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || error?.message || "Failed to update subscription");
    throw error;
  }
};


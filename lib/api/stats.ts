import apiClient from "./config";
import { toast } from "sonner";

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  remainingUsers: number | null;
  maxManagedUsers: number | null;
  totalOrders: number;
  totalProducts: number;
}

export interface StatsResponse {
  stats: DashboardStats;
}

export const getStats = async (): Promise<DashboardStats> => {
  try {
    const { data } = await apiClient.get("/stats");
    return data?.data?.stats;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || error?.message || "Failed to fetch stats");
    throw error;
  }
};


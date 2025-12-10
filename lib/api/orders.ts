import apiClient from "./config";
import { Order, OrderListResponse } from "@/types";
import { toast } from "sonner";

export interface GetOrdersParams {
  page?: number;
  rowsPerPage?: number;
  search?: string;
  status?: string;
  user?: string;
  sort?: string;
  sortBy?: string;
  startDate?: string;
  endDate?: string;
}

export const getOrders = async (params?: GetOrdersParams): Promise<OrderListResponse> => {
  try {
    const queryParams: Record<string, any> = {
      page: params?.page || 1,
      rowsPerPage: params?.rowsPerPage || 10,
    };
    
    if (params?.search && params.search.trim() !== "") {
      queryParams.search = params.search;
    }
    
    if (params?.status && params.status.trim() !== "") {
      queryParams.status = params.status;
    }
    
    if (params?.user && params.user.trim() !== "") {
      queryParams.user = params.user;
    }
    
    if (params?.sort) {
      queryParams.sort = params.sort;
    }
    
    if (params?.sortBy) {
      queryParams.sortBy = params.sortBy;
    }
    
    if (params?.startDate) {
      queryParams.startDate = params.startDate;
    }
    
    if (params?.endDate) {
      queryParams.endDate = params.endDate;
    }
    
    const { data } = await apiClient.get("/orders", { params: queryParams });
    return data?.data || { orders: [], meta: undefined };
  } catch (error: any) {
    toast.error(error?.response?.data?.message || error?.message || "Failed to fetch orders");
    throw error;
  }
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const { data } = await apiClient.get(`/orders/${orderId}`);
    return data?.data?.order;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || error?.message || "Failed to fetch order");
    throw error;
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled"
): Promise<Order> => {
  try {
    const { data } = await apiClient.patch(`/orders/${orderId}/status`, { status });
    toast.success(data?.message || "Order status updated successfully");
    return data?.data?.order;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || error?.message || "Failed to update order status");
    throw error;
  }
};


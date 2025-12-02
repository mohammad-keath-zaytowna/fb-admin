import apiClient from "./config";
import { User, UserListResponse } from "@/types";
import { toast } from "sonner";

export interface GetUsersParams {
  page?: number;
  rowsPerPage?: number;
  search?: string;
  sort?: string;
  filter?: Record<string, any>;
}

export const getUsers = async (params?: GetUsersParams): Promise<UserListResponse> => {
  try {
    const queryParams: Record<string, any> = {
      page: params?.page || 1,
      rowsPerPage: params?.rowsPerPage || 10,
    };
    
    if (params?.search && params.search.trim() !== "") {
      queryParams.search = params.search;
    }
    
    if (params?.sort) {
      queryParams.sort = params.sort;
    }
    
    if (params?.filter) {
      Object.assign(queryParams, params.filter);
    }
    
    const { data } = await apiClient.get("/users", { params: queryParams });
    return data?.data || { users: [], meta: undefined };
  } catch (error: any) {
    toast.error(error?.response?.data?.message || error?.message || "Failed to fetch users");
    throw error;
  }
};

export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: "customer" | "admin";
}): Promise<User> => {
  try {
    const { data } = await apiClient.post("/users", userData);
    toast.success(data?.message || "User created successfully");
    return data?.data?.user;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || error?.message || "Failed to create user");
    throw error;
  }
};

export const updateUserStatus = async (
  userId: string,
  status: "active" | "blocked" | "deleted"
): Promise<User> => {
  try {
    const { data } = await apiClient.patch(`/users/${userId}/status`, { status });
    toast.success(data?.message || "User status updated successfully");
    return data?.data?.user;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || error?.message || "Failed to update user status");
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const { data } = await apiClient.delete(`/users/${userId}`);
    toast.success(data?.message || "User deleted successfully");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || error?.message || "Failed to delete user");
    throw error;
  }
};


"use client";
import apiClient from "./config";
import { toast } from "sonner";

export const loginApiMethod = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const { data } = await apiClient.post("/auth/login", { email, password });

    // Store access token
    if (data?.data?.accessToken) {
      localStorage.setItem("@auth_token", data.data.accessToken);
    }

    // Store refresh token if provided
    if (data?.data?.refreshToken) {
      localStorage.setItem("@auth_refresh_token", data.data.refreshToken);
    }

    toast.success(data?.message || "Login successful");
    return data?.data;
    // eslint-disable-next-line
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || error?.message || "Login failed"
    );
  }
};

export const getCurrentUser = async () => {
  try {
    const { data } = await apiClient.get("/auth/me");
    return data?.data?.user;
    // eslint-disable-next-line
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || error?.message || "Failed to fetch user data"
    );
    throw error;
  }
};


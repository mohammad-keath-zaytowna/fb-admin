import { ApiError } from "@/types/api";
import axios, { AxiosInstance, AxiosResponse } from "axios";

// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Only access localStorage on the client side
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("@auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      // Don't set Content-Type for FormData, let browser set it with boundary
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - redirect to login
      if (error.response.status === 401) {
        // Clear auth data
        localStorage.removeItem("@auth_user");
        localStorage.removeItem("@auth_token");
        localStorage.removeItem("@auth_refresh_token");
        
        // Redirect to login if we're in the browser
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
      
      // Server responded with error status
      const apiError: ApiError = {
        message: error.response.data?.message || "An error occurred",
        errors: error.response.data?.errors,
        status: error.response.status,
      };
      return Promise.reject(apiError);
    } else if (error.request) {
      // Request was made but no response received
      const apiError: ApiError = {
        message: "No response from server",
        status: 0,
      };
      return Promise.reject(apiError);
    } else {
      // Something else happened
      const apiError: ApiError = {
        message: error.message || "An error occurred",
        status: 0,
      };
      return Promise.reject(apiError);
    }
  }
);

export default apiClient;

import apiClient from "./config";
import { toast } from "sonner";

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await apiClient.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Get the base URL from the API client
    const baseURL = apiClient.defaults.baseURL || "http://localhost:5000";
    const imageUrl = data?.data?.imageUrl;
    
    // Return full URL
    return imageUrl ? `${baseURL}${imageUrl}` : imageUrl;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || error?.message || "Failed to upload image");
    throw error;
  }
};


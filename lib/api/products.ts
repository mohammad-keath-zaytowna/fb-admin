import apiClient, { API_BASE_URL } from "./config";
import { Product, ProductListResponse } from "@/types";
import { toast } from "sonner";

export interface GetProductsParams {
  page?: number;
  rowsPerPage?: number;
  search?: string;
  category?: string;
  status?: string;
  sort?: string;
  sortBy?: string;
}

export const getProducts = async (
  params?: GetProductsParams
): Promise<ProductListResponse> => {
  try {
    const queryParams: Record<string, unknown> = {
      page: params?.page || 1,
      rowsPerPage: params?.rowsPerPage || 10,
    };

    if (params?.search && params.search.trim() !== "") {
      queryParams.search = params.search;
    }

    if (params?.category && params.category.trim() !== "") {
      queryParams.category = params.category;
    }

    if (params?.status && params.status.trim() !== "") {
      queryParams.status = params.status;
    }

    if (params?.sort) {
      queryParams.sort = params.sort;
    }

    if (params?.sortBy) {
      queryParams.sortBy = params.sortBy;
    }

    const { data } = await apiClient.get("/products", { params: queryParams });
    return data?.data || { products: [], meta: undefined };
  } catch (error: unknown) {
    toast.error(
      (error as any)?.response?.data?.message ||
        (error as Error)?.message ||
        "Failed to fetch products"
    );
    throw error;
  }
};

export const getProductById = async (productId: string): Promise<Product> => {
  try {
    const { data } = await apiClient.get(`/products/${productId}`);
    return data?.data?.product;
  } catch (error: unknown) {
    toast.error(
      (error as any)?.response?.data?.message ||
        (error as Error)?.message ||
        "Failed to fetch product"
    );
    throw error;
  }
};

export const createProduct = async (productData: {
  name: string;
  image: File | string;
  category: string;
  price: string;
  description?: string;
  colors?: string[];
  sizes?: string[];
  visibleToUsers?: string[];
}): Promise<Product> => {
  try {
    const isFile = (productData.image as any) instanceof File;

    if (isFile) {
      // Send as FormData for file upload
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("image", productData.image as File);
      formData.append("category", productData.category);
      formData.append("price", productData.price);
      if (productData.description) {
        formData.append("description", productData.description);
      }
      if (productData.colors && productData.colors.length > 0) {
        formData.append("colors", JSON.stringify(productData.colors));
      }
      if (productData.sizes && productData.sizes.length > 0) {
        formData.append("sizes", JSON.stringify(productData.sizes));
      }
      if (productData.visibleToUsers !== undefined) {
        formData.append("visibleToUsers", JSON.stringify(productData.visibleToUsers));
      }

      // Use fetch instead of axios for better FormData handling
      const token = localStorage.getItem("@auth_token");
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          // Don't set Content-Type - let fetch set it with proper boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      const data = await response.json();
      toast.success(data?.message || "Product created successfully");
      return data?.data?.product;
    } else {
      // Send as JSON for URL
      const { data } = await apiClient.post("/products", productData);
      toast.success(data?.message || "Product created successfully");
      return data?.data?.product;
    }
  } catch (error: unknown) {
    toast.error(
      (error as any)?.response?.data?.message ||
        (error as Error)?.message ||
        "Failed to create product"
    );
    throw error;
  }
};

export const updateProduct = async (
  productId: string,
  productData: Partial<Product & { image: File | string }>
): Promise<Product> => {
  try {
    const isFile = (productData.image as any) instanceof File;

    if (isFile) {
      // Send as FormData for file upload
      const formData = new FormData();
      if (productData.name) formData.append("name", productData.name);
      formData.append("image", productData.image as File);
      if (productData.category)
        formData.append("category", productData.category);
      if (productData.price !== undefined) {
        formData.append("price", productData.price);
      }
      if (productData.description !== undefined) {
        formData.append("description", productData.description);
      }
      if (productData.colors && productData.colors.length > 0) {
        formData.append("colors", JSON.stringify(productData.colors));
      }
      if (productData.sizes && productData.sizes.length > 0) {
        formData.append("sizes", JSON.stringify(productData.sizes));
      }
      if (productData.visibleToUsers !== undefined) {
        formData.append("visibleToUsers", JSON.stringify(productData.visibleToUsers));
      }

      const { data } = await apiClient.patch(
        `/products/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(data?.message || "Product updated successfully");
      return data?.data?.product;
    } else {
      // Send as JSON
      const { data } = await apiClient.patch(
        `/products/${productId}`,
        productData
      );
      toast.success(data?.message || "Product updated successfully");
      return data?.data?.product;
    }
  } catch (error: unknown) {
    toast.error(
      (error as any)?.response?.data?.message ||
        (error as Error)?.message ||
        "Failed to update product"
    );
    throw error;
  }
};

export const updateProductStatus = async (
  productId: string,
  status: "active" | "inactive" | "deleted"
): Promise<Product> => {
  try {
    const { data } = await apiClient.patch(`/products/${productId}/status`, {
      status,
    });
    toast.success(data?.message || "Product status updated successfully");
    return data?.data?.product;
  } catch (error: unknown) {
    toast.error(
      (error as any)?.response?.data?.message ||
        (error as Error)?.message ||
        "Failed to update product status"
    );
    throw error;
  }
};

export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const { data } = await apiClient.delete(`/products/product/${productId}`);
    toast.success(data?.message || "Product deleted successfully");
  } catch (error: unknown) {
    toast.error(
      (error as any)?.response?.data?.message ||
        (error as Error)?.message ||
        "Failed to delete product"
    );
    throw error;
  }
};

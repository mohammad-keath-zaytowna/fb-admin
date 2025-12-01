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
    const { data } = await apiClient.post("/login", { email, password });
    toast("created successfully");
    return data;
    // eslint-disable-next-line
  } catch (error: any) {
    toast.error(error.message ?? "creation failed");
  }
};

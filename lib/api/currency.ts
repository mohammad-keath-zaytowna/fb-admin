import apiClient from './config';
import { toast } from 'sonner';

export interface UpdateCurrencyData {
  currency: 'USD' | 'JOD' | 'SP';
}

/**
 * Update current user's currency preference
 */
export async function updateCurrency(currency: 'USD' | 'JOD' | 'SP'): Promise<any> {
  try {
    const response = await apiClient.patch('/users/currency', { currency });
    toast.success('Currency updated successfully');
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to update currency';
    toast.error(message);
    throw error;
  }
}

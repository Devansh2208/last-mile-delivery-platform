import { apiClient } from './client';
import { OrderCreate, OrderResponse } from '../types';

export const ordersApi = {
  /**
   * Create a new order
   */
  createOrder: async (data: OrderCreate): Promise<OrderResponse> => {
    const res = await apiClient.post<OrderResponse>('/orders/', data);
    return res.data;
  },

  /**
   * List all orders (authenticated)
   */
  getOrders: async (): Promise<OrderResponse[]> => {
    const res = await apiClient.get<OrderResponse[]>('/orders/');
    return res.data;
  },

  /**
   * Get single order by tracking number
   */
  getOrderByTrackingNumber: async (trackingNumber: string): Promise<OrderResponse> => {
    const res = await apiClient.get<OrderResponse>(`/orders/${encodeURIComponent(trackingNumber)}`);
    return res.data;
  },
};


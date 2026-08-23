import { apiClient } from './client';
import { PriceCalculationResult, RateCardCreate, RateCardResponse } from '../types';

export const pricingApi = {
  createRateCard: async (data: RateCardCreate): Promise<RateCardResponse> => {
    const res = await apiClient.post<RateCardResponse>('/rate-cards/', data);
    return res.data;
  },

  calculateOrderPrice: async (trackingNumber: string): Promise<PriceCalculationResult> => {
    const res = await apiClient.get<PriceCalculationResult>(
      `/rate-cards/calculate/${encodeURIComponent(trackingNumber)}`
    );
    return res.data;
  },
};

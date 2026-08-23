import { apiClient } from './client';
import { TrackingCreate, TrackingResponse } from '../types';

export const trackingApi = {
  /**
   * Get tracking history for an order (public)
   */
  getTrackingEvents: async (trackingNumber: string): Promise<TrackingResponse[]> => {
    const res = await apiClient.get<TrackingResponse[]>(
      `/tracking/${encodeURIComponent(trackingNumber)}`
    );
    return res.data;
  },

  /**
   * Add a tracking event and update status (Agent or Admin)
   */
  addTrackingEvent: async (
    trackingNumber: string,
    data: TrackingCreate
  ): Promise<TrackingResponse> => {
    const res = await apiClient.post<TrackingResponse>(
      `/tracking/${encodeURIComponent(trackingNumber)}`,
      data
    );
    return res.data;
  },
};


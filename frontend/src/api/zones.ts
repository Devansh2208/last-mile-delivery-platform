import { apiClient } from './client';
import { ZoneCreate, ZoneMappingCreate, ZoneMappingResponse, ZoneResponse } from '../types';

export const zonesApi = {
  getZones: async (): Promise<ZoneResponse[]> => {
    const res = await apiClient.get<ZoneResponse[]>('/zones/');
    return res.data;
  },

  getZone: async (zoneId: string): Promise<ZoneResponse> => {
    const res = await apiClient.get<ZoneResponse>(`/zones/${encodeURIComponent(zoneId)}`);
    return res.data;
  },

  createZone: async (data: ZoneCreate): Promise<ZoneResponse> => {
    const res = await apiClient.post<ZoneResponse>('/zones/', data);
    return res.data;
  },

  getZoneMappings: async (zoneId: string): Promise<ZoneMappingResponse[]> => {
    const res = await apiClient.get<ZoneMappingResponse[]>(
      `/zones/${encodeURIComponent(zoneId)}/mappings`
    );
    return res.data;
  },

  createZoneMapping: async (
    zoneId: string,
    data: ZoneMappingCreate
  ): Promise<ZoneMappingResponse> => {
    const res = await apiClient.post<ZoneMappingResponse>(
      `/zones/${encodeURIComponent(zoneId)}/mappings`,
      data
    );
    return res.data;
  },

  resolveZoneByPincode: async (pincode: string): Promise<ZoneResponse> => {
    const res = await apiClient.get<ZoneResponse>(`/zones/resolve/${encodeURIComponent(pincode)}`);
    return res.data;
  },
};

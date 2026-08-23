import { apiClient } from './client';

export interface HealthResponse {
  status: string;
  service?: string;
}

export interface DatabaseHealthResponse {
  status: string;
  database: string;
}

export const healthApi = {
  getHealth: async (): Promise<HealthResponse> => {
    const res = await apiClient.get<HealthResponse>('/health');
    return res.data;
  },

  getDatabaseHealth: async (): Promise<DatabaseHealthResponse> => {
    const res = await apiClient.get<DatabaseHealthResponse>('/api/health/db');
    return res.data;
  },
};

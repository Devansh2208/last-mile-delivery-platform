import { apiClient } from './client';
import { AgentAssignmentResponse, AgentCreate, AgentResponse } from '../types';

export const agentsApi = {
  /**
   * List all agents (public/authenticated)
   */
  getAgents: async (): Promise<AgentResponse[]> => {
    const res = await apiClient.get<AgentResponse[]>('/agents/');
    return res.data;
  },

  /**
   * Create a new agent (admin only)
   */
  createAgent: async (data: AgentCreate): Promise<AgentResponse> => {
    const res = await apiClient.post<AgentResponse>('/agents/', data);
    return res.data;
  },

  /**
   * Assign an available agent to an order (admin only)
   */
  assignOrder: async (trackingNumber: string): Promise<AgentAssignmentResponse> => {
    const res = await apiClient.post<AgentAssignmentResponse>(
      `/agents/assign/${encodeURIComponent(trackingNumber)}`
    );
    return res.data;
  },
};


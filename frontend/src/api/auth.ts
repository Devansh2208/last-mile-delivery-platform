import { apiClient } from './client';
import { LoginRequest, RegisterRequest, TokenResponse, UserResponse } from '../types';

export const authApi = {
  register: async (data: RegisterRequest): Promise<UserResponse> => {
    const res = await apiClient.post<UserResponse>('/api/auth/register', data);
    return res.data;
  },

  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const res = await apiClient.post<TokenResponse>('/api/auth/login', data);
    return res.data;
  },
};

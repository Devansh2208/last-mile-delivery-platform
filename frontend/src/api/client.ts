import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Get base URL from environment or default to empty string (which uses Vite server proxy)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: attach Bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // If token expired or invalid on a protected route, trigger auth cleanup
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register') && !currentPath.includes('/tracking')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Extracts a human-friendly error message from Axios / FastAPI error response
 */
export function extractErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected error occurred';

  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    
    // FastAPI validation errors (422) return detail as an array of objects
    if (data && Array.isArray(data.detail)) {
      return data.detail
        .map((item: { loc?: string[]; msg?: string }) => {
          const field = item.loc ? item.loc.filter(l => l !== 'body').join('.') : '';
          return field ? `${field}: ${item.msg}` : item.msg;
        })
        .join(', ');
    }

    // Standard FastAPI error (400, 401, 403, 404, etc.)
    if (data && typeof data.detail === 'string') {
      return data.detail;
    }

    if (data && typeof data.message === 'string') {
      return data.message;
    }

    if (error.response?.status === 403) {
      return "You don't have permission to perform this action.";
    }

    if (error.response?.status === 404) {
      return 'The requested resource was not found.';
    }

    if (error.response?.status === 500) {
      return 'Internal server error. Please try again later.';
    }

    if (error.message === 'Network Error') {
      return 'Cannot connect to backend server. Please make sure the backend is running.';
    }

    return error.message || 'API request failed';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}


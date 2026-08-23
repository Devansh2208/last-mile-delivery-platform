import React, { createContext, useCallback, useEffect, useState } from 'react';
import { LoginRequest, RegisterRequest, UserResponse, UserRole } from '../types';
import { authApi } from '../api/auth';
import { decodeJWT, isTokenExpired } from '../utils/jwt';

export interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<{ role: UserRole }>;
  register: (data: RegisterRequest) => Promise<UserResponse>;
  logout: () => void;
  setAuthUser: (token: string, user?: UserResponse) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<UserResponse | null>(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [role, setRole] = useState<UserRole | null>(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken && !isTokenExpired(savedToken)) {
      const decoded = decodeJWT(savedToken);
      return decoded?.role || null;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setRole(null);
  }, []);

  const setAuthUser = useCallback((newToken: string, newUser?: UserResponse) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);

    const decoded = decodeJWT(newToken);
    const userRole = decoded?.role || 'CUSTOMER';
    setRole(userRole);

    const fullUser: UserResponse = newUser || {
      id: decoded?.sub || '',
      name: decoded?.email ? decoded.email.split('@')[0] : 'User',
      email: decoded?.email || '',
      phone: null,
      role: userRole,
    };

    localStorage.setItem('user', JSON.stringify(fullUser));
    setUser(fullUser);
  }, []);

  // Initialize and check token validity
  useEffect(() => {
    const checkAuth = () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        if (isTokenExpired(savedToken)) {
          logout();
        } else {
          const decoded = decodeJWT(savedToken);
          if (decoded) {
            setRole(decoded.role);
            if (!user) {
              const fallbackUser: UserResponse = {
                id: decoded.sub,
                name: decoded.email ? decoded.email.split('@')[0] : 'User',
                email: decoded.email,
                phone: null,
                role: decoded.role,
              };
              setUser(fallbackUser);
              localStorage.setItem('user', JSON.stringify(fallbackUser));
            }
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen to unauthorized global events from Axios interceptor
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [logout, user]);

  const login = async (data: LoginRequest): Promise<{ role: UserRole }> => {
    const res = await authApi.login(data);
    const accessToken = res.access_token;
    const decoded = decodeJWT(accessToken);

    if (!decoded) {
      throw new Error('Received invalid token from authentication server');
    }

    const userRole = decoded.role;
    const loggedUser: UserResponse = {
      id: decoded.sub,
      name: data.email.split('@')[0],
      email: data.email,
      phone: null,
      role: userRole,
    };

    setAuthUser(accessToken, loggedUser);
    return { role: userRole };
  };

  const register = async (data: RegisterRequest): Promise<UserResponse> => {
    return await authApi.register(data);
  };

  const isAuthenticated = Boolean(token && !isTokenExpired(token));

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        setAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


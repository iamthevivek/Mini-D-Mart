import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { User, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('onemart_user') || localStorage.getItem('minidmart_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('onemart_token') || localStorage.getItem('minidmart_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const activeToken = localStorage.getItem('onemart_token') || localStorage.getItem('minidmart_token');
    if (!activeToken) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.get<User>('/auth/me');
      setUser(res.data);
      localStorage.setItem('onemart_user', JSON.stringify(res.data));
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.post<AuthResponse>('/auth/login', {
      email: email.trim().toLowerCase(),
      password,
    });
    const { accessToken, user: userData } = res.data;
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem('onemart_token', accessToken);
    localStorage.setItem('onemart_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<User> => {
    const res = await api.post<AuthResponse>('/auth/register', {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: phone?.trim() || undefined,
    });
    const { accessToken, user: userData } = res.data;
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem('onemart_token', accessToken);
    localStorage.setItem('onemart_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('onemart_token');
    localStorage.removeItem('onemart_user');
    localStorage.removeItem('minidmart_token');
    localStorage.removeItem('minidmart_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

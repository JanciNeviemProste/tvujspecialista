'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, type LoginCredentials } from '@/lib/api/auth';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

const getStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key) || sessionStorage.getItem(key);
};

const setStorageItem = (key: string, value: string, persistent = true): void => {
  if (typeof window === 'undefined') return;
  if (persistent) {
    localStorage.setItem(key, value);
  } else {
    sessionStorage.setItem(key, value);
  }
};

const removeStorageItem = (key: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
};

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations('auth');

  useEffect(() => {
    // Check if user is already logged in
    const token = getStorageItem('accessToken');
    if (token) {
      authApi
        .getMe()
        .then((res) => setUser(res.data))
        .catch(() => {
          // Don't remove tokens here — the API client interceptor handles
          // token refresh and cleanup. Just clear user state.
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const { data } = await authApi.login(credentials);
      const persistent = credentials.remember !== false;
      // Clear tokens from BOTH storages first to prevent stale tokens
      removeStorageItem('accessToken');
      removeStorageItem('refreshToken');
      // Then store in the chosen storage
      setStorageItem('accessToken', data.accessToken, persistent);
      setStorageItem('refreshToken', data.refreshToken, persistent);
      setUser(data.user);
      toast.success(t('loginSuccess'));
    } catch (error) {
      toast.error(t('loginError'));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      removeStorageItem('accessToken');
      removeStorageItem('refreshToken');
      setUser(null);
      toast.success(t('logoutSuccess'));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

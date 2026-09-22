'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { api, extractErrorMessage } from '@/lib/api';
import { useI18n } from '@/lib/i18n-provider';
import { AUTH_EVENT, authStorage } from '@/lib/storage';
import type {
  AuthCredentials,
  AuthResponse,
  AuthUser,
  RegisterPayload,
} from '@/lib/types';
import { toast } from 'sonner';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthUser(raw: Record<string, unknown>): AuthUser {
  return raw as unknown as AuthUser;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { t } = useI18n();

  const sync = useCallback(() => {
    setToken(authStorage.getToken());
    const raw = authStorage.getUser();
    setUser(raw ? toAuthUser(raw) : null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [sync]);

  const persist = useCallback((data: AuthResponse) => {
    authStorage.set(data.access_token, data.user as unknown as Record<string, unknown>);
    setToken(data.access_token);
    setUser(data.user);
  }, []);

  const login = useCallback(
    async (credentials: AuthCredentials) => {
      try {
        const { data } = await api.post<AuthResponse>('/auth/login', credentials);
        persist(data);
        toast.success(t('auth.welcomeBack'));
        return data.user;
      } catch (error) {
        toast.error(extractErrorMessage(error, t));
        throw error;
      }
    },
    [persist, t],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      try {
        const { data } = await api.post<AuthResponse>('/auth/register', payload);
        persist(data);
        toast.success(t('auth.accountCreated'));
        return data.user;
      } catch (error) {
        toast.error(extractErrorMessage(error, t));
        throw error;
      }
    },
    [persist, t],
  );

  const logout = useCallback(() => {
    authStorage.clear();
    setUser(null);
    setToken(null);
    toast(t('auth.loggedOut'));
    router.push('/');
  }, [router, t]);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [user, token, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
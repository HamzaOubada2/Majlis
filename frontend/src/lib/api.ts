import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from './config';
import { authStorage } from './storage';
import type { TranslationKey } from './translations';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ApiErrorPayload {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

type Translate = (key: TranslationKey, params?: Record<string, string | number>) => string;

export function extractErrorMessage(
  error: unknown,
  t?: Translate,
): string {
  if (axios.isAxiosError(error)) {
    const ax = error as AxiosError<ApiErrorPayload>;
    const data = ax.response?.data;
    if (data?.message) {
      if (Array.isArray(data.message)) {
        return data.message.join(t ? t('common.separator') : '، ');
      }
      return data.message;
    }
    if (ax.response?.status === 401) return t ? t('errors.sessionExpired') : 'انتهت الجلسة، يرجى تسجيل الدخول مجدداً';
    if (!ax.response) return t ? t('errors.serverUnreachable') : 'تعذّر الاتصال بالخادم، تأكد من تشغيل الخادم';
  }
  return t ? t('errors.unexpected') : 'حدث خطأ غير متوقع، حاول مرة أخرى';
}

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const { data } = await api.request<T>(config);
  return data;
}